import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  User,
  authState,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APP_ROUTES } from '../../constants/app-routes.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  readonly user$: Observable<User | null> = authState(this.auth);

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
