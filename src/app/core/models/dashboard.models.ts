import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';

interface WithOptionalId {
  id?: string | number;
}

const createConverter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T): DocumentData => {
    const { id: _id, ...rest } = data as WithOptionalId;
    return rest;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T => {
    return { id: snapshot.id, ...snapshot.data(options) } as T;
  },
});

export const courseStatisticsConverter: FirestoreDataConverter<CourseStatistics> = {
  toFirestore: (data: CourseStatistics): DocumentData => {
    return data;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CourseStatistics => {
    return snapshot.data(options) as CourseStatistics;
  },
};

export interface Mentor {
  id: number;
  name: string;
  githubId: string;
  isActive?: boolean;
  students?: unknown[];
  cityName?: string;
  countryName?: string;
  contactsEmail?: string;
  contactsSkype?: string;
  contactsWhatsApp?: string;
  contactsTelegram?: string;
  contactsNotes?: string;
  contactsPhone?: string | null;
  email?: string;
  telegram?: string;
}

export interface TaskResult {
  courseTaskId: number;
  score: number;
}

export interface ScoreData {
  id: string;
  name: string;
  githubId: string;
  active: boolean;
  cityName: string;
  countryName: string;
  rank: number;
  totalScore: number;
  mentor?: Mentor;
  totalScoreChangeDate: string;
  crossCheckScore: number;
  repositoryLastActivityDate: string | null;
  taskResults: TaskResult[];
  repository?: string;
}
export const scoreDataConverter = createConverter<ScoreData>();

export interface StudentSummary {
  rank: number;
  totalScore: number;
  isActive: boolean;
  repository?: string;
  mentor?: Mentor;
}

export interface CourseStatistics {
  studentsCountries: { countries: { countryName: string; count: number }[] };
  studentsStats: {
    totalStudents: number;
    activeStudentsCount: number;
    studentsWithMentorCount: number;
    certifiedStudentsCount: number;
    eligibleForCertificationCount: number;
  };
  mentorsCountries: { countries: { countryName: string; count: number }[] };
  mentorsStats: {
    mentorsTotalCount: number;
    mentorsActiveCount: number;
    epamMentorsCount: number;
  };
  courseTasks: Task[];
  studentsCertificatesCountries: { countries: unknown[] };
}

export enum TaskStatus {
  Checked = 'Checked',
  InProgress = 'InProgress',
  ToDo = 'ToDo',
  Checking = 'Checking',
}

export interface Task {
  id: string | number;
  name: string;
  status: TaskStatus;
  taskId?: number;
  type?: string;
  studentStartDate?: string;
  studentEndDate?: string;
  maxScore?: number;
  scoreWeight?: number;
  descriptionUrl?: string;
  checker?: string;
  crossCheckStatus?: string;
  taskOwner?: {
    id: number;
    name: string;
    githubId: string;
  };
}
export const taskConverter = createConverter<Task>();

export interface ScheduleEvent {
  id: number | string;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  tag: string;
  maxScore: number | null;
  scoreWeight: number | null;
  organizer: { id: number; name: string; githubId: string } | null;
  status: string;
  score: number | null;
  descriptionUrl: string;
}
export const scheduleEventConverter = createConverter<ScheduleEvent>();

export interface Event {
  topic: string;
  date: string;
  time: string;
}

export interface AvailableReview {
  id: string;
  name: string;
  completedChecksCount: number;
  checksCount: number;
}

export interface Course {
  id: number;
  name: string;
  startDate: string;
  logo: string;
  alias: string;
  usePrivateRepositories: boolean;
  maxCourseScore?: number;
  completed: boolean;
}

export const courseConverter = createConverter<Course>();

export interface DashboardData {
  studentSummary: StudentSummary;
  courseStats: CourseStatistics;
  maxCourseScore: number;
  tasksByStatus: Record<TaskStatus, Task[]>;
  nextEvents: Event[];
  availableReviews: AvailableReview[];
  course: Course;
}
