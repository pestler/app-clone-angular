import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, switchMap } from 'rxjs';
import { CrossCheckFeedback, SolutionReview, TaskSolution } from '../../core/models/solution.model';
import { TaskDetails } from '../../core/models/task-details.model';
import { Task, TaskPhase } from '../../core/models/task.model'; // Added TaskPhase
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course';
import { CourseTaskSelectComponent } from '../../shared/components/course-task-select/course-task-select.component';
import { SubmittedStatusComponent } from '../../shared/components/submitted-status/submitted-status.component';

function urlValidator(control: AbstractControl): ValidationErrors | null {
  const url = control.value;
  if (!url) {
    return null;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { invalidUrl: true };
  }
  return null;
}

@Component({
  selector: 'app-cross-check-submit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CourseTaskSelectComponent,
    SubmittedStatusComponent,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './cross-check-submit.component.html',
  styleUrls: ['./cross-check-submit.component.scss'],
})
export class CrossCheckSubmitComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      url: ['', [Validators.required, urlValidator]],
      review: [[] as SolutionReview[]],
    });
  }

  private courseId$ = this.route.queryParamMap.pipe(
    switchMap((params) => of(params.get('course'))),
  );
  private githubId$ = this.authService.githubUsername$;

  courseTasks = toSignal(
    this.courseId$.pipe(
      switchMap((courseId) => {
        if (courseId) {
          return this.courseService.getCourseCrossCheckTasks(courseId);
        }
        return of([]);
      }),
    ),
  );

  selectedTaskId = signal<number | null>(null);

  selectedTask = computed<Task | null>(() => {
    const tasks = this.courseTasks();
    const taskId = this.selectedTaskId();
    if (tasks && taskId) {
      return tasks.find((t) => t.id === taskId) ?? null;
    }
    return null;
  });

  private selectedTaskData$ = combineLatest([
    this.courseId$,
    this.githubId$,
    toObservable(this.selectedTaskId),
  ]).pipe(
    switchMap(([courseId, githubId, taskId]) => {
      if (courseId && githubId && taskId) {
        return combineLatest([
          this.courseService.getCrossCheckTaskDetails(courseId, taskId),
          this.courseService.getCrossCheckTaskSolution(courseId, taskId, githubId),
          this.courseService.getMyCrossCheckFeedbacks(courseId, taskId),
        ]);
      }
      return of([null, null, null]);
    }),
  );

  private selectedTaskData = toSignal(this.selectedTaskData$);

  taskDetails = computed<TaskDetails | null>(
    () => (this.selectedTaskData()?.[0] ?? null) as TaskDetails | null,
  );
  submittedSolution = computed<TaskSolution | null>(
    () => (this.selectedTaskData()?.[1] ?? null) as TaskSolution | null,
  );
  feedback = computed<CrossCheckFeedback[]>(
    () => (this.selectedTaskData()?.[2] ?? []) as CrossCheckFeedback[],
  );

  loading = computed(
    () => this.courseTasks() === undefined || this.selectedTaskData() === undefined,
  );

  submitAllowed = computed(() => {
    const task = this.selectedTask();
    if (!task || !task.phases) {
      return false;
    }

    const submitPhase = task.phases.find((p: TaskPhase) => p.phase === 'submit');
    if (submitPhase) {
      const endDate = new Date(submitPhase.endDate);
      return Date.now() < endDate.getTime();
    }
    return false;
  });

  newCrossCheck = computed(() => {
    const details = this.taskDetails();
    return (details?.publicAttributes?.questions?.length ?? 0) > 0;
  });

  isCrossCheckCompleted = computed(() => {
    const task = this.selectedTask();
    if (task?.phases) {
      const reviewPhase = task.phases.find((p: TaskPhase) => p.phase === 'review');
      return reviewPhase?.status === 'completed';
    }
    return this.taskDetails()?.crossCheckStatus === 'completed';
  });

  isCrossCheckOngoing = computed(() => {
    const task = this.selectedTask();
    if (task?.phases) {
      const reviewPhase = task.phases.find((p: TaskPhase) => p.phase === 'review');
      return reviewPhase?.status === 'available' || reviewPhase?.status === 'in-progress';
    }
    return this.taskDetails()?.crossCheckStatus === 'in-progress';
  });

  hasReviews = computed(() => (this.feedback()?.length ?? 0) > 0);

  ngOnInit(): void {
    const taskId = this.route.snapshot.queryParamMap.get('taskId');
    if (taskId) {
      this.selectedTaskId.set(Number(taskId));
    }
  }

  handleTaskChange(taskId: number): void {
    this.selectedTaskId.set(Number(taskId));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taskId: taskId },
      queryParamsHandling: 'merge',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const courseId = this.route.snapshot.queryParamMap.get('course');
    const taskId = this.selectedTaskId();
    const githubId = this.authService.githubUsername$.value;

    if (courseId && taskId && githubId) {
      const { url, review } = this.form.value;
      this.courseService
        .postTaskSolution(courseId, taskId, githubId, url, review, [])
        .then(() => {
          console.log('Solution submitted successfully');
          this.form.reset();
        })
        .catch((err: Error) => {
          console.error('Error submitting solution:', err);
        });
    }
  }
}
