import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
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
  private readonly route = inject(ActivatedRoute);

  public readonly data: Signal<DashboardData | null> = toSignal(
    this.route.queryParams.pipe(
      map((params) => params['course'] as string),
      filter((courseAlias) => !!courseAlias),

      switchMap((courseAlias) =>
        this.authService
          .getScoreData(courseAlias)
          .pipe(map((scoreData) => ({ scoreData, courseAlias }))),
      ),

      filter(
        (result): result is { scoreData: ScoreData; courseAlias: string } => !!result.scoreData,
      ),

      switchMap(({ scoreData, courseAlias }) =>
        this.dashboardService.getDashboardData(scoreData, courseAlias),
      ),
    ),
    { initialValue: null },
  );

  public readonly isLoading: Signal<boolean> = computed(() => !this.data());
}
