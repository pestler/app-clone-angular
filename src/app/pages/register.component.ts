import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, switchMap, take, tap } from 'rxjs';

import { Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { User as UserService } from '../core/services/user';

import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  form!: FormGroup;
  private currentUserGithubId: string | null = null;

  ngOnInit(): void {
    this.authService.isNavigatingToRegister = false;
    this.initForm();
    this.prefillForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      location: ['', [Validators.required]],
      primaryEmail: ['', [Validators.required, Validators.email]],
      epamEmail: ['', [Validators.email]],
      githubId: [''],
    });
  }

  private prefillForm(): void {
    this.authService.githubUsername$
      .pipe(
        take(1),
        filter((githubId): githubId is string => !!githubId),
        tap((githubId) => {
          this.currentUserGithubId = githubId;
          this.form.patchValue({ githubId: githubId });
        }),
        switchMap((githubId) => this.userService.getUserProfile(githubId)),
      )
      .subscribe((profile) => {
        if (profile) {
          this.form.patchValue(profile);
        }
      });

    this.authService.user$
      .pipe(
        take(1),
        filter((user) => !!user),
      )
      .subscribe((user) => {
        const [firstName, ...lastNameParts] = user!.displayName?.split(' ') || ['', ''];
        this.form.patchValue({
          primaryEmail: user!.email,
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
      roles: { student: true, admin: false, mentor: false },
    };

    this.userService
      .saveUserProfile(this.currentUserGithubId, profileData)
      .then(() => {
        this.notificationService.showSuccess('Your profile has been saved successfully!');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        this.notificationService.showError('There was an error saving your profile.');
      });
  }
}
