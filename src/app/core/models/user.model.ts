export interface UserProfile {
  githubId: string;
  id: number;
  displayName: string;
  active: boolean;
  courses?: string[];
  roles: {
    student: boolean;
    mentor: boolean;
    admin: boolean;
  };
  about: string;
  languages: string[];
  generalInfo: {
    englishLevel: string;
    location: {
      countryName: string;
      cityName: string;
    };
  };
  contacts: {
    phone: string;
    email: string;
    epamEmail?: string;
    telegram: string;
    whatsapp: string;
    notes: string;
  };
  discord: {
    username: string;
    id: string;
  };
  publicFeedback: string[];
}

// export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
//   toFirestore: (profile: UserProfile): DocumentData => {
//     return profile;
//   },
//   fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserProfile => {
//     const data = snapshot.data(options);
//     return {
//       githubId: data['githubId'],
//       id: data['id'],
//       displayName: data['displayName'],
//       primaryEmail: data['primaryEmail'],
//       firstName: data['firstName'],
//       lastName: data['lastName'],
//       location: data['location'],
//       active: data['active'],
//       cityName: data['cityName'],
//       countryName: data['countryName'],
//       epamEmail: data['epamEmail'],
//       courses: data['courses'],
//       roles: data['roles'],
//     } as UserProfile;
//   },
// };
