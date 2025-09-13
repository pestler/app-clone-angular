import { Component } from '@angular/core';
import { StudentStatsCardComponent } from '../../shared/components/student-stats-card/student-stats-card.component';
import { CourseSelectComponent } from './course-select/course-select.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [SideNavComponent, CourseSelectComponent, StudentStatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
