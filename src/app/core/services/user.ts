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
import { firstValueFrom, Observable, take } from 'rxjs';
import { Mentor, ScoreData } from '../models/dashboard.models';
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

  async enrollInCourse(githubId: string, courseAlias: string): Promise<void> {
    const lowerCaseGithubId = githubId.toLowerCase();
    const userDocRef = doc(this.firestore, `users/${lowerCaseGithubId}`).withConverter(
      userProfileConverter,
    );
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      throw new Error('User profile does not exist');
    }

    const existingProfile = userSnapshot.data();

    const updatedRoles = {
      ...existingProfile.roles,
      student: true,
    };
    const updatedCourses = [...(existingProfile.courses || []), courseAlias];
    const uniqueCourses = [...new Set(updatedCourses)];
    const profileUpdate: Partial<UserProfile> = {
      roles: updatedRoles,
      courses: uniqueCourses,
    };
    await this.saveUserProfile(lowerCaseGithubId, profileUpdate);

    const studentDocPath = `courses/${courseAlias}/students/${lowerCaseGithubId}`;
    const studentDocRef = doc(this.firestore, studentDocPath);

    const newStudentData: Omit<ScoreData, 'id'> = {
      name: existingProfile.displayName,
      githubId: lowerCaseGithubId,
      active: true,
      cityName: existingProfile.generalInfo?.location?.cityName || '',
      countryName: existingProfile.generalInfo?.location?.countryName || '',
      rank: 0,
      totalScore: 0,
      totalScoreChangeDate: new Date().toISOString(),
      crossCheckScore: 0,
      repositoryLastActivityDate: null,
    };

    await setDoc(studentDocRef, newStudentData);
  }

  async enrollAsMentor(githubId: string, courseAlias: string): Promise<void> {
    const lowerCaseGithubId = githubId.toLowerCase();
    const userDocRef = doc(this.firestore, `users/${lowerCaseGithubId}`).withConverter(
      userProfileConverter,
    );
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      throw new Error('User profile does not exist');
    }

    const existingProfile = userSnapshot.data();

    const updatedRoles = {
      ...existingProfile.roles,
      mentor: true,
    };
    const updatedCourses = [...(existingProfile.courses || []), courseAlias];
    const uniqueCourses = [...new Set(updatedCourses)];
    const profileUpdate: Partial<UserProfile> = {
      roles: updatedRoles,
      courses: uniqueCourses,
    };
    await this.saveUserProfile(lowerCaseGithubId, profileUpdate);

    const mentorDocPath = `courses/${courseAlias}/mentors/${lowerCaseGithubId}`;
    const mentorDocRef = doc(this.firestore, mentorDocPath);

    const newMentorData: Mentor = {
      id: existingProfile.id ?? 0,
      name: existingProfile.displayName,
      githubId: lowerCaseGithubId,
      isActive: existingProfile.active,
      cityName: existingProfile.generalInfo?.location?.cityName,
      countryName: existingProfile.generalInfo?.location?.countryName,
      contactsEmail: existingProfile.contacts?.email,
      contactsTelegram: existingProfile.contacts?.telegram,
      contactsNotes: existingProfile.contacts?.notes,
      contactsPhone: existingProfile.contacts?.phone,
    };

    await setDoc(mentorDocRef, newMentorData);
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

  async getUserRoleForCourse(
    githubId: string,
    _courseAlias: string,
  ): Promise<'student' | 'mentor' | 'none'> {
    const profile = await firstValueFrom(this.getUserProfile(githubId).pipe(take(1)));

    if (!profile) {
      return 'none';
    }

    if (profile.roles.mentor) {
      return 'mentor';
    }

    if (profile.roles.student) {
      return 'student';
    }

    return 'none';
  }

  async getActiveUserCount(): Promise<number> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('active', '==', true));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
