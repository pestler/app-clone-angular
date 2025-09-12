import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Course } from '../../../core/auth/auth.models';
import { mockCourse, mockSession } from '../../../core/mocks/course-menu.mock';
import { getCourseLinks, LinkData } from './course-menu.data';
import { ThemeMenuComponent } from './theme-menu/theme-menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    UserMenuComponent,
    ThemeMenuComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() title = '';
  @Input() courseName = '';
  @Input() showCourseName = false;

  courseLinks: LinkData[] = [];
  public mockCourse: Course = mockCourse;

  ngOnInit(): void {
    // TODO: Replace with real session and course data
    this.courseLinks = getCourseLinks(mockSession, this.mockCourse);
  }
}
