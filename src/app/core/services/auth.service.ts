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
import { ScoreData, scoreDataConverter } from '../models/dashboard.models';
import { FirestoreService } from './firestore.service';
import { User as UserService } from './user';

const GITHUB_USERNAME_KEY = 'githubUsername';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly firestoreService: FirestoreService = inject(FirestoreService);
  private readonly userService: UserService = inject(UserService);

  readonly user$: Observable<User | null> = authState(this.auth);

  readonly githubUsername$ = new BehaviorSubject<string | null>(
    localStorage.getItem(GITHUB_USERNAME_KEY),
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
        localStorage.setItem(GITHUB_USERNAME_KEY, githubUsername);
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
      console.error('Authentication error:', error);
      return '/';
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem(GITHUB_USERNAME_KEY);
      this.githubUsername$.next(null);
      this.router.navigate([APP_ROUTES.LOGIN]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
