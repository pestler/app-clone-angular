export interface Mentor {
  name: string;
  githubId: string;
  email?: string;
  telegram?: string;
}

export interface StudentSummary {
  rank: number;
  totalScore: number;
  isActive: boolean;
  repository?: string;
  mentor?: Mentor;
}

export interface CourseStats {
  activeStudentsCount: number;
}

export enum TaskStatus {
  Checked = 'Checked',
  InProgress = 'InProgress',
  ToDo = 'ToDo',
  Checking = 'Checking',
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
}

export interface Event {
  topic: string;
  date: string; // ISO date string
  time: string;
}

export interface AvailableReview {
  id: string;
  name: string;
  completedChecksCount: number;
  checksCount: number;
}

export interface Course {
  alias: string;
  usePrivateRepositories: boolean;
}

export interface DashboardData {
  studentSummary: StudentSummary;
  courseStats: CourseStats;
  maxCourseScore: number;
  tasksByStatus: Record<TaskStatus, Task[]>;
  nextEvents: Event[];
  availableReviews: AvailableReview[];
  course: Course;
}
