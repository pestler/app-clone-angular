import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardData, TaskStatus } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDashboardData(_courseId: number, _githubId: string): Observable<DashboardData> {
    // return this.http.get<DashboardData>(`${this.apiUrl}/courses/${_courseId}/dashboard/${_githubId}`);

    const mockData: DashboardData = {
      studentSummary: {
        rank: 10,
        totalScore: 150,
        isActive: true,
        repository: 'https://github.com/your-github/your-repo',
        mentor: {
          name: 'Mentor Name',
          githubId: 'mentor-github',
          email: 'mentor@example.com',
          telegram: '@mentor_telegram',
        },
      },
      courseStats: {
        activeStudentsCount: 100,
      },
      maxCourseScore: 200,
      tasksByStatus: {
        [TaskStatus.Checked]: [
          { id: '1', name: 'Task 1', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
          { id: '2', name: 'Task 2', status: TaskStatus.Checked },
        ],
        [TaskStatus.InProgress]: [
          { id: '3', name: 'Task 3', status: TaskStatus.InProgress },
          { id: '3', name: 'Task 3', status: TaskStatus.InProgress },
          { id: '3', name: 'Task 3', status: TaskStatus.InProgress },
        ],
        [TaskStatus.ToDo]: [
          { id: '4', name: 'Task 4', status: TaskStatus.ToDo },
          { id: '5', name: 'Task 5', status: TaskStatus.ToDo },
        ],
        [TaskStatus.Checking]: [],
      },
      nextEvents: [
        { topic: 'Event 1', date: '2025-10-01T10:00:00Z', time: '10:00' },
        { topic: 'Event 2', date: '2025-10-05T12:00:00Z', time: '12:00' },
      ],
      availableReviews: [
        {
          id: '1',
          name: 'Task 1 (Cross-check)',
          completedChecksCount: 2,
          checksCount: 3,
        },
        {
          id: '2',
          name: 'Task 2 (Cross-check)',
          completedChecksCount: 1,
          checksCount: 3,
        },
      ],
      course: {
        alias: 'angular-2025Q3',
        usePrivateRepositories: true,
      },
    };

    return of(mockData).pipe(delay(500));
  }
}
