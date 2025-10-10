import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, filter, map, of, switchMap } from 'rxjs';
import { InterviewInfo } from '../../core/models/interview.model';
import { AuthService } from '../../core/services/auth.service';
import { InterviewService } from '../../core/services/interview.service';
import { User as UserService } from '../../core/services/user';
import { InterviewMentorCardComponent } from '../../shared/components/cards/interview-card/interview-mentor-card/interview-mentor-card.component';
import { InterviewStudentCardComponent } from '../../shared/components/cards/interview-card/interview-student-card/interview-student-card.component';
import { AssignInterviewComponent } from './assign-interview/assign-interview.component';

@Component({
  selector: 'app-interviews',
  imports: [InterviewMentorCardComponent, InterviewStudentCardComponent, AssignInterviewComponent],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss',
})
export class InterviewsComponent implements OnInit {
  private readonly interviewService = inject(InterviewService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  public interviews: WritableSignal<InterviewInfo[]> = signal([]);
  public currentCourseAlias: WritableSignal<string | null> = signal(null);
  public currentMentorId: WritableSignal<string | null> = signal(null);

  public role: 'student' | 'mentor' | 'none' = 'none';

  ngOnInit(): void {
    this.refresh$
      .pipe(
        switchMap(() =>
          combineLatest([this.authService.githubUsername$, this.route.queryParams]).pipe(
            filter(([githubId, params]) => !!githubId && !!params['course']),
            map(([githubId, params]) => ({
              githubId: githubId as string,
              courseAlias: params['course'] as string,
            })),
            switchMap(async ({ githubId, courseAlias }) => {
              this.currentCourseAlias.set(courseAlias);
              const userRole = await this.userService.getUserRoleForCourse(githubId, courseAlias);
              this.role = userRole;
              return { githubId, courseAlias, userRole };
            }),
            switchMap(({ githubId, courseAlias, userRole }) => {
              if (userRole === 'student') {
                return this.interviewService.getInterviews(courseAlias, githubId);
              }
              if (userRole === 'mentor') {
                this.currentMentorId.set(githubId);
                return this.interviewService.getMentorInterviews(courseAlias, githubId);
              }
              return of([]);
            }),
            catchError((err) => {
              console.error('Error fetching interviews:', err);
              return of([]);
            }),
          ),
        ),
      )
      .subscribe({
        next: (interviews) => this.interviews.set(interviews),
        error: (err) => console.error('Unhandled error in interview subscription:', err),
      });
  }

  refreshInterviews(): void {
    this.refresh$.next();
  }
}
