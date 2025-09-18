import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { ScoreData, scoreDataConverter } from '../models/dashboard.models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);
  private readonly firestoreService: FirestoreService = inject(FirestoreService);

  readonly user$: Observable<User | null> = authState(this.auth);

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
        );
      } else {
        return of(null);
      }
    }),
    map((scoreData) => scoreData ?? null),
  );

  async signInWithGitHub(): Promise<void> {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate([APP_ROUTES.LOGIN]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
