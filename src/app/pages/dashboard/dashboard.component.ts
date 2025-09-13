import { Component } from '@angular/core';
import { CourseSelectComponent } from './course-select/course-select.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [SideNavComponent, CourseSelectComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
