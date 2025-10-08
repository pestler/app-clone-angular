import { inject, Injectable } from '@angular/core';
import {
  arrayUnion,
  collection,
  collectionData,
  collectionGroup,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { Course, courseConverter, Mentor, ScoreData } from '../models/dashboard.models';
import {
  IPaginationInfo,
  ScoreOrder,
  ScoreStudentDto,
  ScoreTableFilters,
} from '../models/score.model';
import {
  CrossCheckAssignment,
  CrossCheckFeedback,
  SolutionComment,
  SolutionReview,
  TaskSolution,
} from '../models/solution.model';
import { TaskDetails } from '../models/task-details.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly firestore: Firestore = inject(Firestore);

  getCourses(): Observable<Course[]> {
    const coursesCollection = collection(this.firestore, 'courses').withConverter(courseConverter);
    return from(getDocs(coursesCollection)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data())),
    );
  }

  createCourse(course: Course): Observable<Course> {
    const courseDocRef = doc(this.firestore, `courses/${course.alias}`);
    const newCourseWithId: Course = { ...course, id: course.alias };

    return from(setDoc(courseDocRef, newCourseWithId)).pipe(map(() => newCourseWithId));
  }

  getCourseByAlias(alias: string): Observable<Course | undefined> {
    const courseDocRef = doc(this.firestore, `courses/${alias}`).withConverter(courseConverter);
    return docData(courseDocRef) as Observable<Course | undefined>;
  }

  updateCourse(alias: string, course: Course): Observable<Course> {
    const courseDocRef = doc(this.firestore, `courses/${alias}`);
    return from(setDoc(courseDocRef, course)).pipe(map(() => course));
  }

  isUserMentorForCourse(courseAlias: string, githubId: string): Observable<boolean> {
    const mentorDocRef = doc(this.firestore, `courses/${courseAlias}/mentors/${githubId}`);
    return from(getDoc(mentorDocRef)).pipe(map((snapshot) => snapshot.exists()));
  }

  getUnassignedStudents(courseAlias: string): Observable<ScoreData[]> {
    const studentsCollection = collection(this.firestore, `courses/${courseAlias}/students`);
    return (collectionData(studentsCollection) as Observable<ScoreData[]>).pipe(
      map((students) => students.filter((student) => !student.mentor)),
    );
  }

  getMentorStudents(courseAlias: string, mentorId: string): Observable<ScoreData[]> {
    const studentsCollection = collection(this.firestore, `courses/${courseAlias}/students`);
    const q = query(studentsCollection, where('mentor.githubId', '==', mentorId));
    return collectionData(q) as Observable<ScoreData[]>;
  }

  async assignMentorToStudent(
    courseAlias: string,
    mentorId: string,
    studentId: string,
  ): Promise<void> {
    const mentorDocRef = doc(this.firestore, `courses/${courseAlias}/mentors/${mentorId}`);
    const mentorSnapshot = await getDoc(mentorDocRef);

    if (!mentorSnapshot.exists()) {
      throw new Error(`Mentor with id ${mentorId} not found in course ${courseAlias}`);
    }
    const mentorData = mentorSnapshot.data() as Mentor;

    const studentDocRef = doc(this.firestore, `courses/${courseAlias}/students/${studentId}`);

    const studentUpdatePromise = updateDoc(studentDocRef, { mentor: mentorData });
    const mentorUpdatePromise = updateDoc(mentorDocRef, {
      students: arrayUnion(studentId),
    });

    await Promise.all([studentUpdatePromise, mentorUpdatePromise]);
  }

  getCourseStudentCounts(courseId: string): Observable<{ total: number; active: number }> {
    const studentsCollection = collection(this.firestore, `courses/${courseId}/students`);
    return from(getDocs(studentsCollection)).pipe(
      switchMap((snapshot) => {
        const students = snapshot.docs;
        if (students.length === 0) {
          return of({ total: 0, active: 0 });
        }

        const userChecks$ = students.map((studentDoc) => {
          const studentData = studentDoc.data();
          const githubId = studentData['githubId'];
          const userDocRef = doc(this.firestore, `users/${githubId}`);
          return from(getDoc(userDocRef)).pipe(
            map((userDoc) => {
              return userDoc.exists() && userDoc.data()['active'] === true;
            }),
          );
        });

        return forkJoin(userChecks$).pipe(
          map((activeStatuses) => {
            const activeCount = activeStatuses.filter((isActive) => isActive).length;
            return {
              total: students.length,
              active: activeCount,
            };
          }),
        );
      }),
    );
  }

  getCourseCrossCheckTasks(courseId: string): Observable<Task[]> {
    const tasksCollection = collection(this.firestore, `courses/${courseId}/tasks`);
    const q = query(tasksCollection, where('tags', 'array-contains', 'cross-check-submit'));
    return collectionData(q) as Observable<Task[]>;
  }

  postTaskSolution(
    courseId: string,
    taskId: number,
    githubId: string,
    url: string,
    review: SolutionReview[],
    comments: SolutionComment[],
  ): Promise<void> {
    const solutionDoc = doc(
      this.firestore,
      `courses/${courseId}/students/${githubId}/solutions/${taskId}`,
    );
    return setDoc(solutionDoc, {
      url,
      review,
      comments,
      courseId: courseId,
      taskId: taskId,
      studentId: githubId,
    });
  }

  deleteTaskSolution(courseId: string, taskId: number, githubId: string): Promise<void> {
    const solutionDoc = doc(
      this.firestore,
      `courses/${courseId}/students/${githubId}/solutions/${taskId}`,
    );
    return deleteDoc(solutionDoc);
  }

  getCrossCheckTaskSolution(
    courseId: string,
    taskId: number,
    githubId: string,
  ): Observable<TaskSolution> {
    const solutionDoc = doc(
      this.firestore,
      `courses/${courseId}/students/${githubId}/solutions/${taskId}`,
    );
    return docData(solutionDoc) as Observable<TaskSolution>;
  }

  getCrossCheckTaskDetails(courseId: string, taskId: number): Observable<TaskDetails> {
    const taskDetailsDoc = doc(this.firestore, `courses/${courseId}/taskDetails/${taskId}`);
    return docData(taskDetailsDoc) as Observable<TaskDetails>;
  }

  getMyCrossCheckFeedbacks(courseId: string, taskId: number): Observable<CrossCheckFeedback[]> {
    const feedbackCollection = collection(
      this.firestore,
      `courses/${courseId}/tasks/${taskId}/cross-check`,
    );
    return collectionData(feedbackCollection) as Observable<CrossCheckFeedback[]>;
  }

  getCrossCheckAssignments(
    courseId: string,
    taskId: number,
    reviewerId: string,
  ): Observable<CrossCheckAssignment[]> {
    const assignmentsCollection = collection(
      this.firestore,
      `courses/${courseId}/tasks/${taskId}/assignments`,
    );
    const q = query(assignmentsCollection, where('reviewerId', '==', reviewerId));
    return collectionData(q) as Observable<CrossCheckAssignment[]>;
  }

  getAllSolutionsForTask(courseId: string, taskId: number): Observable<TaskSolution[]> {
    const solutionsCollection = collectionGroup(this.firestore, 'solutions');
    const q = query(
      solutionsCollection,
      where('courseId', '==', courseId),
      where('taskId', '==', taskId),
    );
    return collectionData(q) as Observable<TaskSolution[]>;
  }

  getCourseScore(
    courseId: string,
    pagination: IPaginationInfo,
    filters: ScoreTableFilters,
    order: ScoreOrder,
  ): Observable<{ content: ScoreStudentDto[]; pagination: IPaginationInfo }> {
    const studentsCollection = collection(this.firestore, `courses/${courseId}/students`);
    const q = query(studentsCollection);

    return from(getDocs(q)).pipe(
      switchMap((snapshot) => {
        const rawStudents: DocumentData[] = snapshot.docs.map((doc) => doc.data());

        if (rawStudents.length === 0) {
          return of({
            content: [],
            pagination: {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: 0,
              totalPages: 0,
            },
          });
        }

        const studentObservables = rawStudents.map((student) => {
          const studentId = student['githubId'];
          const taskResultsCollection = collection(
            this.firestore,
            `courses/${courseId}/students/${studentId}/taskResults`,
          );
          const userDocRef = doc(this.firestore, `users/${studentId}`);

          const taskResults$ = from(getDocs(taskResultsCollection));
          const user$ = from(getDoc(userDocRef));

          return forkJoin({ tasks: taskResults$, user: user$ }).pipe(
            map(({ tasks, user }) => {
              const userData = user.data();
              const isActive = userData ? userData['active'] === true : false;

              const taskScores: Record<string, number> = {};
              tasks.docs.forEach((taskDoc) => {
                const taskId = taskDoc.id;
                const score = taskDoc.data()['score'];
                if (score !== undefined) {
                  taskScores[`task-${taskId}`] = score;
                }
              });

              return {
                githubId: studentId,
                name: student['displayName'] || studentId,
                city: userData?.['generalInfo']?.location?.cityName || '',
                score: student['totalScore'] || 0,
                rank: student['rank'] || 0,
                isActive: isActive,
                ...taskScores,
              } as ScoreStudentDto;
            }),
          );
        });

        return forkJoin(studentObservables).pipe(
          map((processedStudents) => {
            let filteredStudents = filters.activeOnly
              ? processedStudents.filter((s) => s.isActive)
              : processedStudents;

            if (filters.githubId) {
              filteredStudents = filteredStudents.filter((s) =>
                s.githubId.toLowerCase().includes(filters.githubId!.toLowerCase()),
              );
            }
            if (filters.name) {
              filteredStudents = filteredStudents.filter((s) =>
                s.name.toLowerCase().includes(filters.name!.toLowerCase()),
              );
            }
            if (filters.city) {
              filteredStudents = filteredStudents.filter((s) =>
                s.city?.toLowerCase().includes(filters.city!.toLowerCase()),
              );
            }

            if (order.field && order.order) {
              filteredStudents.sort((a, b) => {
                const isAsc = order.order === 'ascend';
                const valA = a[order.field];
                const valB = b[order.field];

                if (typeof valA === 'number' && typeof valB === 'number') {
                  return (valA - valB) * (isAsc ? 1 : -1);
                }
                if (typeof valA === 'string' && typeof valB === 'string') {
                  return valA.localeCompare(valB) * (isAsc ? 1 : -1);
                }
                return 0;
              });
            }

            const total = filteredStudents.length;
            const startIndex = (pagination.current - 1) * pagination.pageSize;
            const endIndex = startIndex + pagination.pageSize;
            const paginatedContent = filteredStudents.slice(startIndex, endIndex);

            return {
              content: paginatedContent,
              pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: total,
                totalPages: Math.ceil(total / pagination.pageSize),
              },
            };
          }),
        );
      }),
    );
  }

  getStudentCourseScore(
    courseId: string,
    githubId: string,
  ): Observable<ScoreStudentDto | undefined> {
    const studentDocRef = doc(this.firestore, `courses/${courseId}/students/${githubId}`);
    const userDocRef = doc(this.firestore, `users/${githubId}`);

    return forkJoin({
      student: from(getDoc(studentDocRef)),
      user: from(getDoc(userDocRef)),
    }).pipe(
      map(({ student, user }) => {
        const studentData = student.data();
        const userData = user.data();

        if (!studentData) return undefined;

        const isActive = userData ? userData['active'] === true : false;

        return {
          githubId: studentData['githubId'],
          name: studentData['displayName'] || studentData['githubId'],
          score: studentData['totalScore'] || 0,
          rank: studentData['rank'] || 0,
          isActive: isActive,
        };
      }),
    );
  }

  getCourseTasks(courseId: string): Observable<Task[]> {
    console.log('getCourseTasks: Querying tasks for courseId:', courseId);
    const tasksCollection = collection(this.firestore, `courses/${courseId}/tasks`);
    return from(getDocs(tasksCollection)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data() as Task)),
    );
  }

  postCrossCheckReview(
    courseId: string,
    taskId: number,
    review: CrossCheckFeedback,
  ): Promise<void> {
    const customId = `${review.studentId}_${review.reviewerId}`;
    const reviewDocRef = doc(
      this.firestore,
      `courses/${courseId}/tasks/${taskId}/cross-check`,
      customId,
    );
    const saveReviewPromise = setDoc(reviewDocRef, review);

    const taskResultDocRef = doc(
      this.firestore,
      `courses/${courseId}/students/${review.studentId}/taskResults/${taskId}`,
    );
    const saveScorePromise = setDoc(
      taskResultDocRef,
      { score: review.totalScore },
      { merge: true },
    );

    return Promise.all([saveReviewPromise, saveScorePromise]).then(() => undefined);
  }
}
