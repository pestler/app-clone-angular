import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { User as FirebaseUser } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, filter, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

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
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly courseService: CourseService = inject(CourseService);

  private readonly destroy$ = new Subject<void>();
  private readonly storageKey = 'registrationFormDraft';

  firstNameInput = viewChild<ElementRef<HTMLInputElement>>('firstNameInput');

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

  constructor() {
    effect(() => {
      const input = this.firstNameInput();
      if (input) {
        input.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.formType = this.route.snapshot.data['formType'] || 'student';
    this.isStudentForm = this.formType === 'student';
    this.authService.isNavigatingToRegister = false;
    this.initForm();
    this.prefillForm();
    this.restoreDraft();
    this.autoSaveDraft();
    this.courses$ = this.courseService
      .getCourses()
      .pipe(tap((courses: Course[]) => console.log('DEBUG: Loaded courses:', courses)));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        takeUntil(this.destroy$),
      )
      .subscribe((profile: UserProfile | undefined) => {
        if (profile) {
          const [firstName, ...lastNameParts] = profile.displayName.split(' ');
          this.form.patchValue({
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || '',
            location: profile.generalInfo?.location?.cityName || '',
            primaryEmail: profile.contacts?.email || '',
            epamEmail: profile.contacts?.epamEmail || '',
            telegram: profile.contacts?.telegram || '',
            whatsApp: profile.contacts?.whatsapp || '',
            phone: profile.contacts?.phone || '',
            notes: profile.contacts?.notes || '',
            aboutYourself: profile.about || '',
            languages: profile.languages || [],
            courses: profile.courses || [],
          });
        }
      });

    this.authService.user$
      .pipe(
        take(1),
        filter((user): user is FirebaseUser => !!user),
        takeUntil(this.destroy$),
      )
      .subscribe((user: FirebaseUser) => {
        const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
        this.form.patchValue({
          primaryEmail: this.form.value.primaryEmail || user.email,
          firstName: this.form.value.firstName || firstName,
          lastName: this.form.value.lastName || lastNameParts.join(' '),
        });
      });
  }

  private autoSaveDraft(): void {
    this.form.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((value) => {
      localStorage.setItem(this.storageKey, JSON.stringify(value));
    });
  }

  private restoreDraft(): void {
    const draft = localStorage.getItem(this.storageKey);
    if (draft) {
      this.form.patchValue(JSON.parse(draft));
    }
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

    const formVal = this.form.value;

    const profileData: Partial<UserProfile> = {
      displayName: `${formVal.firstName} ${formVal.lastName}`.trim(),
      active: true,
      githubId: this.currentUserGithubId,
      about: formVal.aboutYourself,
      languages: formVal.languages,
      courses: formVal.courses,
      generalInfo: {
        englishLevel: '',
        location: {
          countryName: '',
          cityName: formVal.location,
        },
      },
      contacts: {
        phone: formVal.phone,
        email: formVal.primaryEmail,
        epamEmail: formVal.epamEmail,
        telegram: formVal.telegram,
        whatsapp: formVal.whatsApp,
        notes: formVal.notes,
      },
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
        localStorage.removeItem(this.storageKey);
        this.router.navigate(['/']);
      })
      .catch((error: unknown) => {
        console.error('Error saving profile:', error);
        this.notificationService.showError('There was an error saving your profile.');
      });
  }
}
