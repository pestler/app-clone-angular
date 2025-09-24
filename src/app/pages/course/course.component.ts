import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { ScoreData } from '../../core/models/dashboard.models';
import { UserProfile } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { User as UserService } from '../../core/services/user';
import { MentorCardComponent } from '../../shared/components/cards/mentor-card/mentor-card.component';
import { StudentStatsCardComponent } from '../../shared/components/cards/student-stats-card/student-stats-card.component';
import { CourseSelectComponent } from './course-select/course-select.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    CourseSelectComponent,
    StudentStatsCardComponent,
    MentorCardComponent,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  private readonly data$ = this.route.queryParams.pipe(
    map((params) => params['course'] as string),
    filter((courseAlias) => !!courseAlias),
    switchMap((courseAlias) => {
      const scoreData$ = this.authService.getScoreData(courseAlias);
      const userProfile$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.userService.getUserProfile(githubId) : of(undefined),
        ),
      );
      return combineLatest({ scoreData: scoreData$, userProfile: userProfile$ });
    }),
  );

  public readonly studentData: Signal<ScoreData | undefined | null> = toSignal(
    this.data$.pipe(map((d) => d.scoreData)),
  );
  public readonly userProfile: Signal<UserProfile | undefined> = toSignal(
    this.data$.pipe(map((d) => d.userProfile)),
  );

  public readonly isActiveInCourse: Signal<boolean> = computed(() => {
    const profile = this.userProfile();
    const courseData = this.studentData();

    return !!(profile?.active && courseData);
  });
}
