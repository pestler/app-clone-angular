import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { Course } from '../../../core/models/dashboard.models';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';
import { User as UserService } from '../../../core/services/user';
import { getCourseLinks, LinkData } from '../../../shared/components/header/course-menu.data';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, NgStyle, NgClass, MatButtonModule],
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  private readonly data$ = this.route.queryParams.pipe(
    map((params) => params['course'] as string),
    switchMap((courseAlias) => {
      if (!courseAlias)
        return of({
          course: undefined,
          userProfile: undefined,
          scoreData: undefined,
          isMentor: false,
        });

      const course$ = this.courseService
        .getCourses()
        .pipe(map((courses) => courses.find((c) => c.alias === courseAlias)));

      const userProfile$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.userService.getUserProfile(githubId) : of(undefined),
        ),
      );

      const scoreData$ = this.authService.getScoreData(courseAlias);

      const isMentor$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.courseService.isUserMentorForCourse(courseAlias, githubId) : of(false),
        ),
      );

      return combineLatest({
        course: course$,
        userProfile: userProfile$,
        scoreData: scoreData$,
        isMentor: isMentor$,
      });
    }),
  );

  public readonly currentCourse: Signal<Course | undefined> = toSignal(
    this.data$.pipe(map((d) => d['course'])),
  );

  public readonly courseLinks: Signal<LinkData[]> = toSignal(
    this.data$.pipe(
      map((data) => {
        const course = data.course;
        const userProfile = data.userProfile;
        const isAdmin = userProfile?.roles?.admin ?? false;
        const isStudent = !!data.scoreData;
        const isMentor = data.isMentor;

        if (!course || !userProfile) return [];
        return getCourseLinks(course, isAdmin, isStudent, isMentor);
      }),
    ),
    { initialValue: [] },
  );

  isDashboardPage(): boolean {
    return this.router.url === '/';
  }
}
