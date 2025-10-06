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
    _order: ScoreOrder,
  ): Observable<{ content: ScoreStudentDto[]; pagination: IPaginationInfo }> {
    console.log('getCourseScore: Querying students for courseId:', courseId);
    const studentsCollection = collection(this.firestore, `courses/${courseId}/students`);
    let q = query(studentsCollection);

    if (filters.activeOnly) {
      q = query(q, where('active', '==', true));
    }

    return from(getDocs(q)).pipe(
      switchMap((snapshot) => {
        const rawStudents: DocumentData[] = snapshot.docs.map((doc) => doc.data());
        console.log('getCourseScore: Raw students data:', rawStudents);

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
          const taskResultsCollection = collection(
            this.firestore,
            `courses/${courseId}/students/${student['githubId']}/taskResults`,
          );
          return from(getDocs(taskResultsCollection)).pipe(
            map((taskSnapshot) => {
              const taskScores: Record<string, number> = {};
              taskSnapshot.docs.forEach((taskDoc) => {
                const taskId = taskDoc.id;
                const score = taskDoc.data()['score'];
                if (score !== undefined) {
                  taskScores[`task-${taskId}`] = score;
                }
              });
              return {
                githubId: student['githubId'],
                name: student['displayName'] || student['githubId'],
                score: student['totalScore'] || 0,
                rank: student['rank'] || 0,
                isActive: student['active'] || false,
                ...taskScores,
              } as ScoreStudentDto;
            }),
          );
        });

        return forkJoin(studentObservables).pipe(
          map((processedStudents) => {
            const total = processedStudents.length;
            const startIndex = (pagination.current - 1) * pagination.pageSize;
            const endIndex = startIndex + pagination.pageSize;
            const paginatedContent = processedStudents.slice(startIndex, endIndex);

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
    return docData(studentDocRef).pipe(
      map((data: DocumentData | undefined) => {
        if (!data) return undefined;
        return {
          githubId: data['githubId'],
          name: data['displayName'] || data['githubId'],
          score: data['totalScore'] || 0,
          rank: data['rank'] || 0,
          isActive: data['active'] || false,
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
