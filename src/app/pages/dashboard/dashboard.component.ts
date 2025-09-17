import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardData } from '../../core/models/dashboard.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { AvailableReviewCardComponent } from '../../shared/components/cards/available-review-card/available-review-card.component';
import { DashboardCardComponent } from '../../shared/components/cards/dashboard-card/dashboard-card.component';
import { MainStatsCardComponent } from '../../shared/components/cards/main-stats-card/main-stats-card.component';
import { MentorCardComponent } from '../../shared/components/cards/mentor-card/mentor-card.component';
import { NextEventCardComponent } from '../../shared/components/cards/next-event-card/next-event-card.component';
import { RepositoryCardComponent } from '../../shared/components/cards/repository-card/repository-card.component';
import { TasksStatsCardComponent } from '../../shared/components/cards/tasks-stats-card/tasks-stats-card.component';

@Component({
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data?: DashboardData;

  // TODO: get real githubId
  private githubId = 'test-user';
  // TODO: get real courseId
  private courseId = 1;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData(this.courseId, this.githubId).subscribe((data) => {
      this.data = data;
      console.log('[DashboardComponent] Data assigned:', this.data);
      console.log('[DashboardComponent] Mentor data:', this.data?.studentSummary?.mentor);
      console.log('[DashboardComponent] Student Summary data:', this.data?.studentSummary);
      console.log('[DashboardComponent] Course Stats data:', this.data?.courseStats);
      console.log('[DashboardComponent] Tasks By Status data:', this.data?.tasksByStatus);
      console.log('[DashboardComponent] Next Events data:', this.data?.nextEvents);
      console.log('[DashboardComponent] Available Reviews data:', this.data?.availableReviews);
      console.log('[DashboardComponent] Course data:', this.data?.course);
    });
  }
}
