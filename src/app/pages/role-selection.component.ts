import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../core/services/auth.service';
import { User as UserService } from '../core/services/user';
import { UserRole as UserRoleService } from '../core/services/user-role';

import { UserProfile } from '../core/models/user.model';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { filter, switchMap, take, tap } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.const';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss',
})
export class RoleSelectionComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly userRoleService = inject(UserRoleService);

  availableRoles: string[] = [];
  private currentUserGithubId: string | null = null;

  ngOnInit(): void {
    this.authService.githubUsername$
      .pipe(
        take(1),
        filter((githubId): githubId is string => !!githubId),
        tap((githubId) => {
          this.currentUserGithubId = githubId;
        }),
        switchMap((githubId) => this.userService.getUserProfile(githubId)),
      )
      .subscribe((profile) => {
        if (profile && profile.roles) {
          this.availableRoles = Object.keys(profile.roles).filter(
            (key) => profile.roles[key as keyof UserProfile['roles']] === true,
          );
        }
      });
  }

  selectRole(role: string): void {
    this.userRoleService.setActiveRole(role);
    // TODO: Implement navigation based on role
    if (role === 'student') {
      this.router.navigate([`${APP_ROUTES.COURSE}/${APP_ROUTES.STUDENT}/${APP_ROUTES.DASHBOARD}`]);
    } else if (role === 'mentor') {
      this.router.navigate([APP_ROUTES.MENTOR_DASHBOARD]);
    } else if (role === 'admin') {
      this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
