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
      courseStats: courseStats$,
      course: course$,
    }).pipe(
      map(({ allTasks, courseStats, course }) => {
        const safeAllTasks = allTasks ?? [];
        const studentTaskIds = new Set((student.taskResults ?? []).map((tr) => tr.courseTaskId));

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
          [TaskStatus.Checked]: [],
          [TaskStatus.InProgress]: [],
          [TaskStatus.ToDo]: [],
          [TaskStatus.Checking]: [],
        };

        safeAllTasks.forEach((task: Task) => {
          const taskItem: Task = { ...task, status: TaskStatus.ToDo };
          if (studentTaskIds.has(task.id as number)) {
            taskItem.status = TaskStatus.Checked;
            tasksByStatus[TaskStatus.Checked].push(taskItem);
          } else {
            tasksByStatus[TaskStatus.ToDo].push(taskItem);
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
