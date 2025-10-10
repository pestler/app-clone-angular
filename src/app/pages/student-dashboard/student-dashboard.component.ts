import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DashboardData } from '../../core/models/dashboard.models';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { AvailableReviewCardComponent } from '../../shared/components/cards/available-review-card/available-review-card.component';
import { DashboardCardComponent } from '../../shared/components/cards/dashboard-card/dashboard-card.component';
import { MainStatsCardComponent } from '../../shared/components/cards/main-stats-card/main-stats-card.component';
import { MentorCardComponent } from '../../shared/components/cards/mentor-card/mentor-card.component';
import { NextEventCardComponent } from '../../shared/components/cards/next-event-card/next-event-card.component';

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
    RouterModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly route = inject(ActivatedRoute);

  public readonly data: Signal<DashboardData | undefined | null> = toSignal(
    this.route.queryParams.pipe(
      map((params) => params['course'] as string),
      filter((courseAlias) => !!courseAlias),

      switchMap((courseAlias) =>
        this.authService.getScoreData(courseAlias).pipe(
          switchMap((scoreData) => {
            if (scoreData) {
              return this.dashboardService.getDashboardData(scoreData, courseAlias);
            }
            return of(null);
          }),
        ),
      ),
    ),
  );

  public readonly isLoading: Signal<boolean> = computed(() => !this.data());
}
