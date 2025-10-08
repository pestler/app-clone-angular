import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, from, map, of, switchMap } from 'rxjs';
import { ScoreData } from '../../core/models/dashboard.models';
import { UserProfile } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course';
import { FirestoreService } from '../../core/services/firestore.service';
import { NotificationService } from '../../core/services/notification.service';
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
    MatButtonModule,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly firestoreService = inject(FirestoreService);
  private readonly notificationService = inject(NotificationService);
  private readonly courseService = inject(CourseService);

  private courseAlias: string | null = null;

  private readonly data$ = this.route.queryParams.pipe(
    map((params) => {
      this.courseAlias = params['course'] as string;
      return this.courseAlias;
    }),
    filter((courseAlias) => !!courseAlias),
    switchMap((courseAlias) => {
      const scoreData$ = this.authService.getScoreData(courseAlias);
      const userProfile$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.userService.getUserProfile(githubId) : of(undefined),
        ),
      );
      const isMentor$ = this.authService.githubUsername$.pipe(
        switchMap((githubId) =>
          githubId ? this.courseService.isUserMentorForCourse(courseAlias, githubId) : of(false),
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
        isMentor: isMentor$,
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
  public readonly isMentorForCourse: Signal<boolean> = toSignal(
    this.data$.pipe(map((d) => d.isMentor)),
    { initialValue: false },
  );
  public readonly completedTasksCount: Signal<number> = toSignal(
    this.data$.pipe(map((d) => d.taskResultsCount)),
    { initialValue: 0 },
  );
  public readonly totalTasksCount: Signal<number> = toSignal(
    this.data$.pipe(map((d) => d.totalTasksCount)),
    { initialValue: 0 },
  );
  public readonly isActiveInCourse: Signal<boolean> = computed(() => {
    const profile = this.userProfile();
    const courseData = this.studentData();

    return !!(profile?.active && courseData);
  });

  async enroll(): Promise<void> {
    const githubId = this.authService.githubUsername$.value;
    if (!githubId || !this.courseAlias) {
      this.notificationService.showError('Cannot enroll: missing user or course information.');
      return;
    }

    try {
      await this.userService.enrollInCourse(githubId, this.courseAlias);
      this.notificationService.showSuccess('Successfully enrolled in the course!');
      window.location.reload();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      this.notificationService.showError('Failed to enroll in the course.');
    }
  }

  async enrollAsMentor(): Promise<void> {
    const githubId = this.authService.githubUsername$.value;
    if (!githubId || !this.courseAlias) {
      this.notificationService.showError('Cannot enroll: missing user or course information.');
      return;
    }

    try {
      await this.userService.enrollAsMentor(githubId, this.courseAlias);
      this.notificationService.showSuccess('You are now a mentor for this course!');
      window.location.reload();
    } catch (error) {
      console.error('Error enrolling as mentor:', error);
      this.notificationService.showError('Failed to enroll as a mentor.');
    }
  }
}
