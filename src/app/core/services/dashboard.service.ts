import { inject, Injectable } from '@angular/core';
import { forkJoin, from, map, Observable } from 'rxjs';
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
import { CourseService } from './course';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly firestoreService = inject(FirestoreService);
  private readonly courseService = inject(CourseService);

  getDashboardData(courseId: number, student: ScoreData): Observable<DashboardData> {
    const tasksPromise = this.firestoreService.getCollection<Task>('tasks', taskConverter);
    const schedulePromise = this.firestoreService.getCollection<ScheduleEvent>(
      'schedule',
      scheduleEventConverter,
    );
    const courseStatsPromise = this.firestoreService.getDoc<CourseStatistics>(
      'courseStatistics',
      'ZlY12vO9qy29M4a9v03l',
      courseStatisticsConverter,
    );
    const coursePromise = this.courseService.getCourses().pipe(
      map(
        (courses) =>
          courses.find((c) => c.alias === 'angular-2025q3') || {
            id: 0,
            name: 'Unknown Course',
            startDate: '',
            logo: '',
            alias: 'unknown',
            usePrivateRepositories: false,
          },
      ),
    );

    return forkJoin({
      allTasks: from(tasksPromise),
      schedule: from(schedulePromise),
      courseStats: from(courseStatsPromise),
      course: coursePromise,
    }).pipe(
      map(({ allTasks, schedule, courseStats, course }) => {
        const studentSummary: StudentSummary = {
          rank: student.rank,
          totalScore: student.totalScore,
          isActive: student.active,
          repository: `https://github.com/${student.githubId}/your-repo`,
          mentor: student.mentor
            ? {
                id: student.mentor.id,
                name: student.mentor.name,
                githubId: student.mentor.githubId,
              }
            : undefined,
        };

        const studentTaskIds = new Set(
          student.taskResults.map((tr: TaskResult) => tr.courseTaskId),
        );
        const tasksByStatus: Record<TaskStatus, Task[]> = {
          [TaskStatus.Checked]: [],
          [TaskStatus.InProgress]: [],
          [TaskStatus.ToDo]: [],
          [TaskStatus.Checking]: [],
        };

        allTasks.forEach((task: Task) => {
          const taskItem: Task = {
            ...task,
            status: TaskStatus.ToDo,
          };
          if (studentTaskIds.has(task.id as number)) {
            taskItem.status = TaskStatus.Checked;
            tasksByStatus[TaskStatus.Checked].push(taskItem);
          } else {
            tasksByStatus[TaskStatus.ToDo].push(taskItem);
          }
        });

        const nextEvents: Event[] = (schedule || [])
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
          courseStats: courseStats || {
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
          },
          maxCourseScore: course.maxCourseScore || 600,
          tasksByStatus,
          nextEvents,
          availableReviews: [],
          course: course!,
        };

        return dashboardData;
      }),
    );
  }
}
