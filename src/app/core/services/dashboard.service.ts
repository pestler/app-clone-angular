import { inject, Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, take } from 'rxjs';
import {
  Course,
  CourseStatistics,
  courseStatisticsConverter,
  DashboardData,
  ScoreData,
  StudentSummary,
  Task,
  taskConverter,
  taskResultConverter,
  TaskResultDoc,
  TaskStatus,
} from '../models/dashboard.models';
import { CourseService } from './course';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly firestoreService = inject(FirestoreService);
  private readonly courseService = inject(CourseService);

  getDashboardData(student: ScoreData, courseAlias: string): Observable<DashboardData> {
    const taskResults$ = from(
      this.firestoreService.getCollection<TaskResultDoc>(
        `courses/${courseAlias}/students/${student.githubId}/taskResults`,
        taskResultConverter,
      ),
    );

    const tasks$ = from(
      this.firestoreService.getCollection<Task>(`courses/${courseAlias}/tasks`, taskConverter),
    );

    const courseStats$ = from(
      this.firestoreService.getDoc(
        'courseStatistics',
        'ZlY12vO9qy29M4a9v03l',
        courseStatisticsConverter,
      ),
    );

    const course$ = this.courseService.getCourses().pipe(
      map((courses) => courses.find((c) => c.alias === courseAlias) || null),
      take(1),
    );

    return forkJoin({
      allTasks: tasks$,
      taskResults: taskResults$,
      courseStats: courseStats$,
      course: course$,
    }).pipe(
      map(({ allTasks, taskResults, courseStats, course }) => {
        const safeAllTasks = (allTasks ?? []).filter((task) => task.type === 'courseTask');
        const studentTaskIds = new Set((taskResults ?? []).map((tr) => tr.id));

        const safeCourseStats: CourseStatistics =
          courseStats ??
          ({
            studentsStats: { activeStudentsCount: 0 },
          } as CourseStatistics);

        const safeCourse: Course = course ?? ({} as Course);

        const studentSummary: StudentSummary = {
          rank: student.rank,
          totalScore: student.totalScore,
          isActive: student.active,
          repository: student.repository,
          mentor: student.mentor,
        };

        const tasksByStatus: Record<TaskStatus, Task[]> = {
          [TaskStatus.Done]: [],
          [TaskStatus.Available]: [],
          [TaskStatus.Review]: [],
          [TaskStatus.Missed]: [],
          [TaskStatus.Future]: [],
        };

        const now = new Date('2025-09-24T12:00:00.000Z');

        safeAllTasks.forEach((task: Task) => {
          const taskItem: Task = { ...task };

          if (studentTaskIds.has(String(task.id))) {
            taskItem.status = TaskStatus.Done;
            tasksByStatus[TaskStatus.Done].push(taskItem);
            return;
          }

          const startDate = new Date(task.studentStartDate!);
          const endDate = new Date(task.studentEndDate!);

          if (now < startDate) {
            taskItem.status = TaskStatus.Future;
            tasksByStatus[TaskStatus.Future].push(taskItem);
          } else if (now > endDate) {
            taskItem.status = TaskStatus.Missed;
            tasksByStatus[TaskStatus.Missed].push(taskItem);
          } else {
            if (task.checker === 'crossCheck') {
              taskItem.status = TaskStatus.Review;
              tasksByStatus[TaskStatus.Review].push(taskItem);
            } else {
              taskItem.status = TaskStatus.Available;
              tasksByStatus[TaskStatus.Available].push(taskItem);
            }
          }
        });

        const dashboardData: DashboardData = {
          studentSummary,
          courseStats: safeCourseStats,
          maxCourseScore: safeCourse.maxCourseScore ?? 600,
          tasksByStatus,
          nextEvents: [],
          availableReviews: [],
          course: safeCourse,
        };

        return dashboardData;
      }),
    );
  }
}
