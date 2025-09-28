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
import { BehaviorSubject, firstValueFrom, from, map, Observable, of, switchMap } from 'rxjs';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { GITHUB_USERNAME_KEY } from '../../token';
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
  private readonly githubUsernameKey = inject(GITHUB_USERNAME_KEY);
  private readonly firestoreService: FirestoreService = inject(FirestoreService);
  private readonly userService: UserService = inject(UserService);
  private readonly notification: NotificationService = inject(NotificationService);

  readonly user$: Observable<User | null> = authState(this.auth);

  readonly githubUsername$ = new BehaviorSubject<string | null>(
    localStorage.getItem(this.githubUsernameKey),
  );
  isNavigatingToRegister = false;

  getScoreData(courseAlias: string): Observable<ScoreData | null> {
    return this.githubUsername$.pipe(
      switchMap((githubId) => {
        if (githubId) {
          const studentDocPath = `courses/${courseAlias}/students`;
          return from(
            this.firestoreService.getDoc<ScoreData>(studentDocPath, githubId, scoreDataConverter),
          );
        } else {
          return of(null);
        }
      }),
      map((scoreData) => scoreData ?? null),
    );
  }

  async signInWithGitHub(): Promise<string> {
    const provider = new GithubAuthProvider();
    try {
      const credential = await signInWithPopup(this.auth, provider);
      const additionalInfo = getAdditionalUserInfo(credential);
      const githubUsername = additionalInfo?.username;

      if (githubUsername) {
        localStorage.setItem(this.githubUsernameKey, githubUsername);
        this.githubUsername$.next(githubUsername);

        const profileExists = await this.userService.doesUserProfileExist(githubUsername);
        if (profileExists) {
          const userProfile = await firstValueFrom(this.userService.getUserProfile(githubUsername));
          if (
            userProfile?.roles &&
            Object.values(userProfile.roles).filter((role) => role).length > 1
          ) {
            return APP_ROUTES.SELECT_ROLE;
          }
          return '/';
        } else {
          this.isNavigatingToRegister = true;
          return APP_ROUTES.REGISTER_STUDENT;
        }
      }
      return '/';
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
      localStorage.removeItem(this.githubUsernameKey);
      this.githubUsername$.next(null);
      this.router.navigate([APP_ROUTES.LOGIN]);
    } catch (error) {
      const errorMessage = 'Sign out error';
      console.error(`${errorMessage}: `, error);

      this.notification.showError(errorMessage);
    }
  }
}
