import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { Course } from '../../../core/models/dashboard.models';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';

const logoNameMap: Record<string, string> = {
  nodejsAws: 'nodejs-aws',
  ml: 'machine-learning',
};

export interface CourseWithStatus extends Course {
  isEmpty: boolean;
}

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
  private readonly authService = inject(AuthService);

  public courses: Signal<CourseWithStatus[]> = toSignal(
    this.courseService.getCourses().pipe(
      switchMap((courses) => {
        if (!courses.length) {
          return of([]);
        }
        const courseChecks$ = courses.map((course) =>
          this.authService.getScoreData(course.alias).pipe(
            map((scoreData) => {
              const defaultLogo = 'default-course';
              const logoName = course.logo ? logoNameMap[course.logo] || course.logo : defaultLogo;
              return {
                ...course,
                logo: `assets/svg/${logoName}.svg`,
                isEmpty: !scoreData,
              };
            }),
          ),
        );
        return combineLatest(courseChecks$);
      }),
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
