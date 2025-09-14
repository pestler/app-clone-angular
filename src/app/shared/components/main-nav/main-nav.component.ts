import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Course } from '../../../core/auth/auth.models';
import { mockCourse, mockSession } from '../../../core/mocks/course-menu.mock';
import { getCourseLinks, LinkData } from '../header/course-menu.data';

@Component({
  selector: 'app-main-nav',
  imports: [MatIconModule, RouterModule, NgStyle, NgClass],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
})
export class MainNavComponent implements OnInit {
  courseLinks: LinkData[] = [];
  public mockCourse: Course = mockCourse;
  private router = inject(Router);

  ngOnInit(): void {
    // TODO: Replace with real session and course data
    this.courseLinks = getCourseLinks(mockSession, this.mockCourse);
  }

  isDashboardPage(): boolean {
    return this.router.url === '/dashboard';
  }
}
