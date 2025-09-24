import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Course } from '../../../core/models/dashboard.models';
import { CourseService } from '../../../core/services/course';

const logoNameMap: Record<string, string> = {
  nodejsAws: 'nodejs-aws',
  ml: 'machine-learning',
};

@Component({
  selector: 'app-course-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './course-select.component.html',
  styleUrl: './course-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSelectComponent {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public courses: Signal<Course[]> = toSignal(
    this.courseService.getCourses().pipe(
      map((courses) =>
        courses.map((course) => {
          const logoName = logoNameMap[course.logo] || course.logo;
          return {
            ...course,
            logo: `assets/svg/${logoName}.svg`,
          };
        }),
      ),
    ),
    { initialValue: [] },
  );

  public selectedCourseAlias: Signal<string | undefined> = toSignal(
    this.route.queryParams.pipe(map((params) => params['course'])),
  );

  public selectedCourse: Signal<Course | undefined> = computed(() => {
    const alias = this.selectedCourseAlias();
    const courses = this.courses();
    return courses.find((c) => c.alias === alias);
  });

  onCourseChange(event: MatSelectChange): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { course: event.value },
      queryParamsHandling: 'merge',
    });
  }
}
