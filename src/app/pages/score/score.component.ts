import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course';
import { User as UserService } from '../../core/services/user';
import { ScoreTableComponent } from './score-table/score-table.component';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, ScoreTableComponent, MatButtonModule],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly userService = inject(UserService);

  activeOnly = signal(true);
  loading = signal(false);
  totalUserCount = signal<number | null>(null);
  activeUserCount = signal<number | null>(null);

  csvEnabled = computed(() => !!this.course());

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

  ngOnInit(): void {
    this.userService
      .getTotalUserCount()
      .then((count) => this.totalUserCount.set(count))
      .catch((err) => {
        console.error('Error getting total user count:', err);
        this.totalUserCount.set(0);
      });

    this.userService
      .getActiveUserCount()
      .then((count) => this.activeUserCount.set(count))
      .catch((err) => {
        console.error('Error getting active user count:', err);
        this.activeUserCount.set(0);
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
