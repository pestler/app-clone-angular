import { inject, Injectable } from '@angular/core';
import {
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
  where,
} from '@angular/fire/firestore';
import { forkJoin, from, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { Course, courseConverter } from '../models/dashboard.models';
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

  private courses$: Observable<Course[]> | null = null;

  getCourses(): Observable<Course[]> {
    if (!this.courses$) {
      const coursesCollection = collection(this.firestore, 'courses').withConverter(
        courseConverter,
      );

      this.courses$ = (collectionData(coursesCollection) as Observable<Course[]>).pipe(
        shareReplay(1),
      );
    }

    return this.courses$;
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
            const filteredStudents = filters.activeOnly
              ? processedStudents.filter((s) => s.isActive)
              : processedStudents;

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
    return setDoc(reviewDocRef, review);
  }
}
