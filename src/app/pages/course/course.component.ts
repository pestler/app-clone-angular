import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MentorCardComponent } from '../../shared/components/cards/mentor-card/mentor-card.component';
import { StudentStatsCardComponent } from '../../shared/components/cards/student-stats-card/student-stats-card.component';
import { CourseSelectComponent } from './course-select/course-select.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    CourseSelectComponent,
    StudentStatsCardComponent,
    MentorCardComponent,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {}
