import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  getAdditionalUserInfo,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { ScoreData, scoreDataConverter } from '../models/dashboard.models';
import { FirestoreService } from './firestore.service';
import { NotificationService } from './notification.service';
import { User as UserService } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly firestoreService: FirestoreService = inject(FirestoreService);
  private readonly userService: UserService = inject(UserService);
  private readonly notification: NotificationService = inject(NotificationService);

  readonly user$: Observable<User | null> = authState(this.auth);
  readonly githubUsername$ = new BehaviorSubject<string | null>(null);
  isNavigatingToRegister = false;

  readonly scoreData$: Observable<ScoreData | null> = this.user$.pipe(
    switchMap((user) => {
      if (user && user.displayName) {
        return from(
          this.firestoreService.findDoc<ScoreData>(
            'scores',
            'name',
            user.displayName,
            scoreDataConverter,
          ),
        ).pipe(
          catchError((error) => {
            this.notification.showError(
              error.message || 'Couldn’t load score data. Please try again later.',
            );
            return of(null);
          }),
        );
      } else {
        return of(null);
      }
    }),
    map((scoreData) => scoreData ?? null),
  );

  async signInWithGitHub(): Promise<string> {
    const provider = new GithubAuthProvider();
    try {
      const credential = await signInWithPopup(this.auth, provider);
      const additionalInfo = getAdditionalUserInfo(credential);
      const githubUsername = additionalInfo?.username;
      this.githubUsername$.next(githubUsername || null);

      if (githubUsername) {
        const profileExists = await this.userService.doesUserProfileExist(githubUsername);
        if (profileExists) {
          const userProfile = await firstValueFrom(this.userService.getUserProfile(githubUsername));

          if (userProfile) {
            const activeRoles = Object.values(userProfile.roles).filter(
              (role) => role === true,
            ).length;
            if (activeRoles > 1) {
              return APP_ROUTES.SELECT_ROLE;
            } else {
              return '/';
            }
          } else {
            return '/';
          }
        } else {
          this.isNavigatingToRegister = true;
          return APP_ROUTES.REGISTER_STUDENT;
        }
      } else {
        return '/';
      }
    } catch (error) {
      const errorMessage = 'Authentication error';
      console.error(`${errorMessage}: `, error);

      this.notification.showError(errorMessage);
      return '/';
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.githubUsername$.next(null);
      this.router.navigate([APP_ROUTES.LOGIN]);
    } catch (error) {
      const errorMessage = 'Sign out error';
      console.error(`${errorMessage}: `, error);

      this.notification.showError(errorMessage);
    }
  }
}
