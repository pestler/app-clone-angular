import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Course } from '../../../core/models/dashboard.models';
import { CourseService } from '../../../core/services/course';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent {
  private courseService = inject(CourseService);
  private router = inject(Router);

  public courses: Signal<Course[]> = toSignal(this.courseService.getCourses(), {
    initialValue: [],
  });

  addCourse(): void {
    this.router.navigate(['admin/courses/add']);
  }

  editCourse(courseAlias: string): void {
    this.router.navigate([`admin/courses/edit/${courseAlias}`]);
  }
}
