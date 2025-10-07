import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getCountFromServer,
  getDoc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile, userProfileConverter } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly firestore: Firestore = inject(Firestore);

  getUserProfile(githubId: string): Observable<UserProfile | undefined> {
    const lowerCaseGithubId = githubId.toLowerCase();
    const userDocRef = doc(this.firestore, `users/${lowerCaseGithubId}`).withConverter(
      userProfileConverter,
    );
    return docData(userDocRef);
  }

  async saveUserProfile(githubId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const lowerCaseGithubId = githubId.toLowerCase();
    const profileData = { ...data, githubId: lowerCaseGithubId };
    const userDocRef = doc(this.firestore, `users/${lowerCaseGithubId}`);
    await setDoc(userDocRef, profileData, { merge: true });
    const updatedSnapshot = await getDoc(userDocRef);
    return updatedSnapshot.data() as UserProfile;
  }

  async doesUserProfileExist(githubId: string): Promise<boolean> {
    const lowerCaseGithubId = githubId.toLowerCase();
    const userDocRef = doc(this.firestore, `users/${lowerCaseGithubId}`);
    const snapshot = await getDoc(userDocRef);
    return snapshot.exists();
  }

  async getTotalUserCount(): Promise<number> {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
  }

  async getActiveUserCount(): Promise<number> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('active', '==', true));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
