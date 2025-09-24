import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, from, map, of, switchMap } from 'rxjs';
import { ScoreData } from '../../core/models/dashboard.models';
import { UserProfile } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
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
  private readonly firestoreService = inject(FirestoreService);

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
      const taskResultsCount$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) => {
          if (githubId) {
            return from(
              this.firestoreService.getCollectionCount(
                `courses/${courseAlias}/students/${githubId}/taskResults`,
              ),
            );
          }
          return of(0);
        }),
      );
      const totalTasksCount$ = from(
        this.firestoreService.getFilteredCollectionCount(
          `courses/${courseAlias}/tasks`,
          'type',
          'courseTask',
        ),
      );

      return combineLatest({
        scoreData: scoreData$,
        userProfile: userProfile$,
        taskResultsCount: taskResultsCount$,
        totalTasksCount: totalTasksCount$,
      });
    }),
  );

  public readonly studentData: Signal<ScoreData | undefined | null> = toSignal(
    this.data$.pipe(map((d) => d.scoreData)),
  );
  public readonly userProfile: Signal<UserProfile | undefined> = toSignal(
    this.data$.pipe(map((d) => d.userProfile)),
  );
  public readonly completedTasksCount: Signal<number> = toSignal(
    this.data$.pipe(map((d) => d.taskResultsCount)),
    { initialValue: 0 },
  );
  public readonly totalTasksCount: Signal<number> = toSignal(
    this.data$.pipe(map((d) => d.totalTasksCount)),
    { initialValue: 0 },
  );
}
