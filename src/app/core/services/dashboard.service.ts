import { inject, Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, take } from 'rxjs';
import {
  CourseStatistics,
  courseStatisticsConverter,
  DashboardData,
  Event,
  ScheduleEvent,
  scheduleEventConverter,
  ScoreData,
  StudentSummary,
  Task,
  taskConverter,
  TaskResult,
  TaskStatus,
} from '../models/dashboard.models';
import { UserProfile, userProfileConverter } from '../models/user.model';
import { CourseService } from './course';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly firestoreService = inject(FirestoreService);
  private readonly courseService = inject(CourseService);

  getDashboardData(courseId: number, student: ScoreData): Observable<DashboardData> {
    const userDoc$ = from(
      this.firestoreService.getDoc<UserProfile>('users', student.githubId, userProfileConverter),
    );

    const tasks$ = from(this.firestoreService.getCollection<Task>('tasks', taskConverter));
    const schedule$ = from(
      this.firestoreService.getCollection<ScheduleEvent>('schedule', scheduleEventConverter),
    );
    const courseStats$ = from(
      this.firestoreService.getDoc<CourseStatistics>(
        'courseStatistics',
        'ZlY12vO9qy29M4a9v03l',
        courseStatisticsConverter,
      ),
    );
    const course$ = this.courseService.getCourses().pipe(
      map(
        (courses) =>
          courses.find((c) => c.alias === 'angular-2025q3') || {
            id: 0,
            name: 'Unknown Course',
            startDate: '',
            logo: '',
            alias: 'unknown',
            usePrivateRepositories: false,
            maxCourseScore: 600,
          },
      ),
      take(1),
    );

    return forkJoin({
      allTasks: tasks$,
      schedule: schedule$,
      courseStats: courseStats$,
      course: course$,
      userDoc: userDoc$,
    }).pipe(
      map(({ allTasks, schedule, courseStats, course, userDoc }) => {
        const safeAllTasks = allTasks ?? [];
        const safeSchedule = schedule ?? [];
        const safeCourseStats = courseStats ?? {
          studentsCountries: { countries: [] },
          studentsStats: {
            totalStudents: 0,
            activeStudentsCount: 0,
            studentsWithMentorCount: 0,
            certifiedStudentsCount: 0,
            eligibleForCertificationCount: 0,
          },
          mentorsCountries: { countries: [] },
          mentorsStats: {
            mentorsTotalCount: 0,
            mentorsActiveCount: 0,
            epamMentorsCount: 0,
          },
          courseTasks: [],
          studentsCertificatesCountries: { countries: [] },
        };

        const studentSummary: StudentSummary = {
          rank: student.rank,
          totalScore: student.totalScore,
          isActive: student.active,
          repository: `https://github.com/${student.githubId}/your-repo`,
          mentor: userDoc?.mentor,
        };

        const studentTaskIds = new Set(
          (student.taskResults ?? []).map((tr: TaskResult) => tr.courseTaskId),
        );

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

        const nextEvents: Event[] = safeSchedule
          .filter((event: ScheduleEvent) => new Date(event.startDate) > new Date())
          .map((event: ScheduleEvent) => ({
            topic: event.name,
            date: event.startDate,
            time: new Date(event.startDate).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))
          .slice(0, 2);

        const dashboardData: DashboardData = {
          studentSummary,
          courseStats: safeCourseStats,
          maxCourseScore: course.maxCourseScore ?? 600,
          tasksByStatus,
          nextEvents,
          availableReviews: [],
          course,
        };

        return dashboardData;
      }),
    );
  }
}
