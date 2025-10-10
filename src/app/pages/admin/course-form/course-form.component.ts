import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { Course } from '../../../core/models/dashboard.models';
import { CourseService } from '../../../core/services/course';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseForm: FormGroup;
  courseId: string | null = null;

  constructor() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-]+$/)]],
      fullName: ['', Validators.required],
      logo: ['', Validators.required],
      description: [''],
      descriptionUrl: ['', Validators.pattern(/^https?:\/\/.+/)],
      startDate: ['', Validators.required],
      endDate: [''],
      registrationEndDate: [''],
      personalMentoringStartDate: [''],
      personalMentoringEndDate: [''],
      maxCourseScore: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      certificateThreshold: [0, [Validators.min(0), Validators.max(100)]],
      certificateIssuer: [''],
      certificateDisciplines: [null],
      discordServerId: [null],
      locationName: [null],
      minStudentsPerMentor: [0, [Validators.min(0)]],
      wearecommunityUrl: ['', Validators.pattern(/^https?:\/\/.+/)],
      usePrivateRepositories: [false],
      completed: [false],
      inviteOnly: [false],
      personalMentoring: [false],
      planned: [false],
      createdDate: [''],
      updatedDate: [''],
      discipline: this.fb.group({
        id: [null, [Validators.required, Validators.min(0)]],
        name: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params) => params.has('id')),
        switchMap((params) => {
          const aliasFromRoute = params.get('id');
          console.log('Alias from route paramMap:', aliasFromRoute);
          this.courseId = aliasFromRoute;
          console.log('Component courseId (alias) set to:', this.courseId);
          return this.courseService.getCourseByAlias(this.courseId as string);
        }),
      )
      .subscribe({
        next: (course) => {
          console.log('Course data received from getCourseByAlias:', course);
          if (course) {
            this.courseForm.patchValue(course);
            console.log('Form patched with course data. Form validity:', this.courseForm.valid);
            console.log('Form errors:', this.courseForm.errors);
            Object.keys(this.courseForm.controls).forEach((key) => {
              const control = this.courseForm.get(key);
              if (control && control.invalid) {
                console.log(`Control ${key} is invalid. Errors:`, control.errors);
              }
            });
          } else {
            this.notificationService.showError('Course not found.');
            this.router.navigate(['/admin/courses']);
          }
        },
        error: (err) => {
          this.notificationService.showError('Error loading course for editing.');
          console.error('Error loading course:', err);
          this.router.navigate(['/admin/courses']);
        },
      });
  }

  private fillMissingRequiredFields(courseData: Course): Course {
    const filledData = { ...courseData };

    if (!filledData.name) filledData.name = '';
    if (!filledData.fullName) filledData.fullName = '';
    if (!filledData.logo) filledData.logo = '';
    if (!filledData.startDate) filledData.startDate = '';

    if (filledData.maxCourseScore === undefined || filledData.maxCourseScore === null)
      filledData.maxCourseScore = 0;
    if (
      filledData.discipline &&
      (filledData.discipline.id === undefined || filledData.discipline.id === null)
    ) {
      filledData.discipline.id = 0;
    }
    if (filledData.discipline && !filledData.discipline.name) {
      filledData.discipline.name = '';
    }

    if (
      filledData.usePrivateRepositories === undefined ||
      filledData.usePrivateRepositories === null
    )
      filledData.usePrivateRepositories = false;
    if (filledData.completed === undefined || filledData.completed === null)
      filledData.completed = false;
    if (filledData.inviteOnly === undefined || filledData.inviteOnly === null)
      filledData.inviteOnly = false;
    if (filledData.personalMentoring === undefined || filledData.personalMentoring === null)
      filledData.personalMentoring = false;
    if (filledData.planned === undefined || filledData.planned === null) filledData.planned = false;

    return filledData;
  }

  onSkipValidationSubmit(): void {
    const aliasControl = this.courseForm.get('alias');

    if (aliasControl && aliasControl.valid) {
      const courseData: Course = this.fillMissingRequiredFields(this.courseForm.value);

      if (this.courseId) {
        this.courseService.updateCourse(this.courseId, courseData).subscribe({
          next: (course) => {
            this.notificationService.showSuccess(
              `Course '${course.name}' updated successfully (validation skipped)!`,
            );
            this.router.navigate(['/admin/courses']);
          },
          error: (err) => {
            this.notificationService.showError('Error updating course (validation skipped).');
            console.error('Error updating course:', err);
          },
        });
      } else {
        this.courseService.createCourse(courseData).subscribe({
          next: (course) => {
            this.notificationService.showSuccess(
              `Course '${course.name}' created successfully (validation skipped)!`,
            );
            this.courseForm.reset();
            this.router.navigate(['/admin/courses']);
          },
          error: (err) => {
            this.notificationService.showError('Error creating course (validation skipped).');
            console.error('Error creating course:', err);
          },
        });
      }
    } else {
      this.notificationService.showError('Alias is required and must be valid to skip validation.');
      aliasControl?.markAsTouched();
    }
  }

  onSubmit(): void {
    console.log('Attempting to submit form. Form validity:', this.courseForm.valid);
    console.log('Form errors on submit:', this.courseForm.errors);
    Object.keys(this.courseForm.controls).forEach((key) => {
      const control = this.courseForm.get(key);
      if (control && control.invalid) {
        console.log(`Control ${key} is invalid. Errors:`, control.errors);
      }
    });

    if (this.courseForm.valid) {
      const courseData: Course = this.courseForm.value;

      if (this.courseId) {
        this.courseService.updateCourse(this.courseId, courseData).subscribe({
          next: (course) => {
            this.notificationService.showSuccess(`Course '${course.name}' updated successfully!`);
            this.router.navigate(['/admin/courses']);
          },
          error: (err) => {
            this.notificationService.showError('Error updating course.');
            console.error('Error updating course:', err);
          },
        });
      } else {
        this.courseService.createCourse(courseData).subscribe({
          next: (course) => {
            this.notificationService.showSuccess(`Course '${course.name}' created successfully!`);
            this.courseForm.reset();
            this.router.navigate(['/admin/courses']);
          },
          error: (err) => {
            this.notificationService.showError('Error creating course.');
            console.error('Error creating course:', err);
          },
        });
      }
    } else {
      this.notificationService.showError('Please fill in all required fields correctly.');
      console.log('Form is invalid');
    }
  }
}
