import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CourseService } from '../../core/services/course';
import { ScoreTableComponent } from './score-table/score-table.component';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, ScoreTableComponent, MatButtonModule],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  activeOnly = signal(true);
  loading = signal(false);
  totalCourseStudents = signal<number | null>(null);
  activeCourseStudents = signal<number | null>(null);

  private courseAlias$ = this.route.queryParams.pipe(map((params) => params['course'] as string));

  course = toSignal(
    this.courseAlias$.pipe(
      switchMap((courseAlias) => {
        if (courseAlias) {
          return this.courseService
            .getCourses()
            .pipe(map((courses) => courses.find((c) => c.alias === courseAlias)));
        }
        return of(undefined);
      }),
    ),
  );

  csvEnabled = computed(() => !!this.course());

  mentorGithubId = signal<string | undefined>(undefined);
  cityName = signal<string | undefined>(undefined);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.mentorGithubId.set(params['mentor.githubId']);
      this.cityName.set(params['cityName']);
    });

    effect(() => {
      const currentCourse = this.course();
      if (currentCourse) {
        this.loading.set(true);
        this.courseService
          .getCourseStudentCounts(currentCourse.alias)
          .subscribe(({ total, active }) => {
            this.totalCourseStudents.set(total);
            this.activeCourseStudents.set(active);
            this.loading.set(false);
          });
      }
    });
  }

  setActive(isActive: boolean): void {
    this.activeOnly.set(isActive);
  }

  handleExportCsv(): void {
    const courseId = this.course()?.id;
    const cityName = this.cityName();
    const mentor = this.mentorGithubId();

    let exportUrl = '/api/export-csv';
    const queryParams = [];
    if (courseId) queryParams.push(`courseId=${courseId}`);
    if (cityName) queryParams.push(`cityName=${cityName}`);
    if (mentor) queryParams.push(`mentor=${mentor}`);

    if (queryParams.length > 0) {
      exportUrl += `?${queryParams.join('&')}`;
    }
    window.location.href = exportUrl;
  }
}
