import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
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
  CrossCheckFeedback,
  SolutionComment,
  SolutionReview,
  TaskSolution,
} from '../models/solution.model'; // New import
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
    return setDoc(solutionDoc, { url, review, comments });
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
      `courses/${courseId}/tasks/${taskId}/feedback`,
    );
    return collectionData(feedbackCollection) as Observable<CrossCheckFeedback[]>;
  }
}
