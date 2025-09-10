import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  User,
  authState,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  readonly user$: Observable<User | null> = authState(this.auth);

  async signInWithGitHub(): Promise<void> {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
