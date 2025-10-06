import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile, userProfileConverter } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly firestore: Firestore = inject(Firestore);

  getUserProfile(githubId: string): Observable<UserProfile | undefined> {
    const userDocRef = doc(this.firestore, `users/${githubId}`).withConverter(userProfileConverter);
    return docData(userDocRef);
  }

  async saveUserProfile(githubId: string, data: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${githubId}`);
    return setDoc(userDocRef, data, { merge: true });
  }

  async doesUserProfileExist(githubId: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, `users/${githubId}`);
    const snapshot = await getDoc(userDocRef);
    return snapshot.exists();
  }
}
