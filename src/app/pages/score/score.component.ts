import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
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
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);

  activeOnly = signal(true);
  loading = signal(false);

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

  mentorGithubId = signal<string | undefined>(undefined);
  cityName = signal<string | undefined>(undefined);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.mentorGithubId.set(params['mentor.githubId']);
      this.cityName.set(params['cityName']);
    });
  }

  handleActiveOnlyChange(): void {
    this.activeOnly.set(!this.activeOnly());
    console.log('ScoreComponent: activeOnly toggled to', this.activeOnly());
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

  csvEnabled = false;
}
