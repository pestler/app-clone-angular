import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User as FirebaseUser } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, switchMap, take, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course';
import { NotificationService } from '../../core/services/notification.service';
import { User as UserService } from '../../core/services/user';

import { Course } from '../../core/models/dashboard.models';
import { UserProfile } from '../../core/models/user.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly courseService: CourseService = inject(CourseService);

  form!: FormGroup;
  formType: 'student' | 'mentor' = 'student';
  isStudentForm = true;
  disciplinesList: string[] = [
    'NodeJS',
    'iOS',
    'Android',
    'AWS',
    'Go',
    'React',
    'Angular',
    'JavaScript',
    'DevOps',
    'Gen AI',
  ];
  languagesList: string[] = [
    'English',
    'Spanish',
    'German',
    'French',
    'Polish',
    'Ukrainian',
    'Russian',
    'Chinese',
    'Hindi',
    'Portuguese',
  ];
  courses$: Observable<Course[]> | undefined;
  private currentUserGithubId: string | null = null;

  ngOnInit(): void {
    this.formType = this.route.snapshot.data['formType'] || 'student';
    this.isStudentForm = this.formType === 'student';
    this.authService.isNavigatingToRegister = false;
    this.initForm();
    this.prefillForm();
    this.courses$ = this.courseService
      .getCourses()
      .pipe(tap((courses: Course[]) => console.log('DEBUG: Loaded courses:', courses)));
  }

  private initForm(): void {
    const baseForm = {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      primaryEmail: ['', [Validators.required, Validators.email]],
      epamEmail: ['', [Validators.email]],
      githubId: [''],
      telegram: [''],
      skype: [''],
      whatsApp: [''],
      phone: [''],
      notes: [''],
      aboutYourself: [''],
      languages: [[]],
      courses: [[]],
    };

    if (!this.isStudentForm) {
      const mentorForm = {
        ...baseForm,
        disciplines: [[], [Validators.required]],
        studentsCount: ['', [Validators.required]],
        studentsLocation: ['Anywhere'],
      };
      this.form = this.fb.group(mentorForm);
    } else {
      this.form = this.fb.group(baseForm);
    }
  }

  private prefillForm(): void {
    this.authService.githubUsername$
      .pipe(
        take(1),
        filter((githubId): githubId is string => !!githubId),
        tap((githubId: string) => {
          this.currentUserGithubId = githubId;
          this.form.patchValue({ githubId: githubId });
        }),
        switchMap((githubId: string) => this.userService.getUserProfile(githubId)),
      )
      .subscribe((profile: UserProfile | undefined) => {
        if (profile) {
          this.form.patchValue(profile);
        }
      });

    this.authService.user$
      .pipe(
        take(1),
        filter((user): user is FirebaseUser => !!user),
      )
      .subscribe((user: FirebaseUser) => {
        const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
        this.form.patchValue({
          primaryEmail: user.email,
          firstName: this.form.value.firstName || firstName,
          lastName: this.form.value.lastName || lastNameParts.join(' '),
        });
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.showError('Please fill in all required fields correctly.');
      return;
    }
    if (!this.currentUserGithubId) {
      this.notificationService.showError('GitHub user ID not found. Please sign in again.');
      return;
    }

    const profileData = {
      ...this.form.value,
      roles: {
        student: this.isStudentForm,
        mentor: !this.isStudentForm,
        admin: false,
      },
    };

    this.userService
      .saveUserProfile(this.currentUserGithubId, profileData)
      .then(() => {
        this.notificationService.showSuccess('Your profile has been saved successfully!');
        this.router.navigate(['/']);
      })
      .catch((error: unknown) => {
        console.error('Error saving profile:', error);
        this.notificationService.showError('There was an error saving your profile.');
      });
  }
}
