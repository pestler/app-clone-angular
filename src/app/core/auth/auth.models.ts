import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';

export enum CourseRole {
  Student = 'student',
  Mentor = 'mentor',
  Manager = 'course-manager',
  Supervisor = 'course-supervisor',
  TaskOwner = 'task-owner',
  Dementor = 'dementor',
}

export interface Course {
  id: number;
  alias: string;
  completed: boolean;
}

export interface Session {
  id: number;
  isAdmin: boolean;
  isHirer: boolean;
  githubId: string;
  appRoles: string[];
  roles: Record<string, CourseRole>;
  courses: Record<
    string,
    {
      roles: CourseRole[];
      studentId?: number;
      mentorId?: number;
      isExpelled?: boolean;
    }
  >;
}

export const sessionConverter: FirestoreDataConverter<Session> = {
  toFirestore: (data: Session): DocumentData => {
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Session => {
    return snapshot.data(options) as Session;
  },
};
