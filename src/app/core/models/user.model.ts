import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';

export interface UserProfile {
  githubId: string;
  id: number;
  displayName: string;
  primaryEmail: string;
  firstName: string;
  lastName: string;
  location: string;
  active: boolean;
  cityName: string;
  countryName: string;
  epamEmail?: string;
  mentor?: {
    id: number;
    githubId: string;
    name: string;
  };
  roles: {
    student: boolean;
    mentor: boolean;
    admin: boolean;
  };
}

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore: (profile: UserProfile): DocumentData => {
    return profile;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserProfile => {
    const data = snapshot.data(options);

    return {
      githubId: data['githubId'],
      id: data['id'],
      displayName: data['displayName'],
      primaryEmail: data['primaryEmail'],
      firstName: data['firstName'],
      lastName: data['lastName'],
      location: data['location'],
      active: data['active'],
      cityName: data['cityName'],
      countryName: data['countryName'],
      epamEmail: data['epamEmail'],
      mentor: data['mentor'],
      roles: data['roles'],
    } as UserProfile;
  },
};
