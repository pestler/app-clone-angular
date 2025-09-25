import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { CourseRole, Session } from '../../../core/auth/auth.models';
import { Course, ScoreData } from '../../../core/models/dashboard.models';
import { UserProfile } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course';
import { User as UserService } from '../../../core/services/user';
import { getCourseLinks, LinkData } from '../../../shared/components/header/course-menu.data';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, NgStyle],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  private readonly data$ = this.route.queryParams.pipe(
    map((params) => params['course'] as string),
    switchMap((courseAlias) => {
      if (!courseAlias)
        return of({ course: undefined, userProfile: undefined, scoreData: undefined });
      const course$ = this.courseService
        .getCourses()
        .pipe(map((courses) => courses.find((c) => c.alias === courseAlias)));
      const userProfile$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.userService.getUserProfile(githubId) : of(undefined),
        ),
      );
      const scoreData$ = this.authService.getScoreData(courseAlias);
      return combineLatest({ course: course$, userProfile: userProfile$, scoreData: scoreData$ });
    }),
  );

  public readonly currentCourse: Signal<Course | undefined> = toSignal(
    this.data$.pipe(map((d) => d['course'])),
  );

  public readonly courseLinks: Signal<LinkData[]> = toSignal(
    this.data$.pipe(
      map((data) => {
        const course = data['course'];
        const userProfile = data['userProfile'];

        if (!course || !userProfile) return [];
        return getCourseLinks(course as Course);
      }),
    ),
    { initialValue: [] },
  );

  private createSessionFromData(
    profile: UserProfile,
    course: Course,
    scoreData: ScoreData | null | undefined,
  ): Session {
    let courseRole: CourseRole | undefined;
    if (scoreData) courseRole = CourseRole.Student;
    else if (profile.roles.mentor) courseRole = CourseRole.Mentor;

    return {
      id: profile.id,
      githubId: profile.githubId,
      isAdmin: profile.roles.admin,
      isHirer: false,
      appRoles: Object.keys(profile.roles).filter(
        (role) => !!profile.roles[role as keyof typeof profile.roles],
      ),
      roles: courseRole ? { [course.id]: courseRole } : {},
      courses: {},
    };
  }
}
