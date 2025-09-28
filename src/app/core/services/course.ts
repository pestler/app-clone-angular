import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionGroup,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, shareReplay } from 'rxjs';
import { Course, courseConverter } from '../models/dashboard.models';
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
