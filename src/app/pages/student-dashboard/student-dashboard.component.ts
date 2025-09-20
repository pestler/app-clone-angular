import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { DashboardData, ScoreData } from '../../core/models/dashboard.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { AvailableReviewCardComponent } from '../../shared/components/cards/available-review-card/available-review-card.component';
import { DashboardCardComponent } from '../../shared/components/cards/dashboard-card/dashboard-card.component';
import { MainStatsCardComponent } from '../../shared/components/cards/main-stats-card/main-stats-card.component';
import { MentorCardComponent } from '../../shared/components/cards/mentor-card/mentor-card.component';
import { NextEventCardComponent } from '../../shared/components/cards/next-event-card/next-event-card.component';
import { RepositoryCardComponent } from '../../shared/components/cards/repository-card/repository-card.component';
import { TasksStatsCardComponent } from '../../shared/components/cards/tasks-stats-card/tasks-stats-card.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardCardComponent,
    MainStatsCardComponent,
    TasksStatsCardComponent,
    NextEventCardComponent,
    AvailableReviewCardComponent,
    MentorCardComponent,
    RepositoryCardComponent,
    RouterModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  public readonly data$: Observable<DashboardData>;

  constructor() {
    this.data$ = this.authService.scoreData$.pipe(
      filter((scoreData): scoreData is ScoreData => !!scoreData),
      switchMap((scoreData) => {
        const courseId = 124;
        return this.dashboardService
          .getDashboardData(courseId, scoreData)
          .pipe(tap((res) => console.log(res)));
      }),
    );
  }
}
