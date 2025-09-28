import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { combineLatest, of, startWith, switchMap } from 'rxjs';
import { CrossCheckFeedback, SolutionReview, TaskSolution } from '../../core/models/solution.model';
import { Question } from '../../core/models/task-details.model';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cross-check-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatIconModule,
    MarkdownModule,
  ],
  templateUrl: './cross-check-review.component.html',
  styleUrls: ['./cross-check-review.component.scss'],
})
export class CrossCheckReviewComponent {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  reviewForm: FormGroup;
  isPreviewing = signal(false);

  private courseId$ = this.route.queryParamMap.pipe(
    switchMap((params) => of(params.get('course'))),
  );

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
  selectedStudentId = signal<string | null>(null);

  submittedStudents: Signal<TaskSolution[]> = toSignal(
    combineLatest([this.courseId$, toObservable(this.selectedTaskId)]).pipe(
      switchMap(([courseId, taskId]) => {
        if (courseId && taskId) {
          return this.courseService.getAllSolutionsForTask(courseId, taskId);
        }
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  private reviewData$ = combineLatest([
    this.courseId$,
    toObservable(this.selectedTaskId),
    toObservable(this.selectedStudentId),
  ]).pipe(
    switchMap(([courseId, taskId, studentId]) => {
      if (courseId && taskId && studentId) {
        return combineLatest([
          this.courseService.getCrossCheckTaskSolution(courseId, taskId, studentId),
          this.courseService.getCrossCheckTaskDetails(courseId, taskId),
        ]);
      }
      return of([null, null]);
    }),
  );

  private reviewData = toSignal(this.reviewData$);

  studentSolution = computed(() => this.reviewData()?.[0] ?? null);
  taskCriteria = computed(() => this.reviewData()?.[1]?.publicAttributes?.questions ?? null);

  formValue: Signal<SolutionReview | undefined>;

  totalScore = computed(() => {
    const criteria = this.formValue()?.criteria;
    if (!criteria) {
      return 0;
    }
    return criteria.reduce((acc: number, criterion) => acc + (Number(criterion.score) || 0), 0);
  });

  maxScore = computed(() => {
    const criteria = this.taskCriteria();
    if (!criteria) {
      return 0;
    }
    return criteria.reduce((acc: number, criterion: Question) => acc + (criterion.max || 0), 0);
  });

  constructor() {
    this.reviewForm = this.fb.group({
      criteria: this.fb.array([]),
      mainComment: [''],
      isAnonymous: [true],
    });

    this.formValue = toSignal(
      this.reviewForm.valueChanges.pipe(startWith(this.reviewForm.value as SolutionReview)),
    );

    const taskId = this.route.snapshot.queryParamMap.get('taskId');
    if (taskId) {
      this.selectedTaskId.set(Number(taskId));
    }

    effect(() => {
      const criteria = this.taskCriteria();
      if (criteria) {
        this.buildCriteriaForm(criteria);
      }
    });
  }

  get criteriaFormArray(): FormArray {
    return this.reviewForm.get('criteria') as FormArray;
  }

  private buildCriteriaForm(criteria: Question[]): void {
    this.criteriaFormArray.clear();
    criteria.forEach((criterion) => {
      this.criteriaFormArray.push(
        this.fb.group({
          score: [0],
          comment: [''],
          ...criterion,
        }),
      );
    });
  }

  togglePreview(): void {
    this.isPreviewing.set(!this.isPreviewing());
  }

  onTaskChange(taskId: number): void {
    this.selectedTaskId.set(taskId);
    this.selectedStudentId.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taskId: taskId },
      queryParamsHandling: 'merge',
    });
  }

  onStudentChange(studentId: string): void {
    this.selectedStudentId.set(studentId);
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.notificationService.showError('Please fill in all required fields.');
      return;
    }

    if (this.totalScore() > this.maxScore()) {
      this.notificationService.showError(
        `The total score (${this.totalScore()}) cannot exceed the maximum score (${this.maxScore()}).`,
      );
      return;
    }

    const courseId = this.route.snapshot.queryParamMap.get('course');
    const taskId = this.selectedTaskId();
    const studentId = this.selectedStudentId();
    const reviewerId = this.authService.githubUsername$.value;

    if (courseId && taskId && studentId && reviewerId) {
      const reviewPayload: CrossCheckFeedback = {
        studentId: studentId,
        reviewerId: reviewerId,
        review: this.reviewForm.value as SolutionReview,
        totalScore: this.totalScore(),
        createdAt: new Date().toISOString(),
      };

      this.courseService
        .postCrossCheckReview(courseId, taskId, reviewPayload)
        .then(() => {
          this.notificationService.showSuccess('Review submitted successfully!');
          this.reviewForm.reset();
          this.selectedStudentId.set(null);
        })
        .catch((err: Error) => {
          this.notificationService.showError('Error submitting review.');
          console.error('Error submitting review:', err);
        });
    }
  }
}
