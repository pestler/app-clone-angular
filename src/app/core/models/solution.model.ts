import { Question } from './task-details.model';

export interface SolutionReview {
  criteria: (Question & { score: number; comment: string })[];
  mainComment: string;
  isAnonymous: boolean;
}

export interface SolutionComment {
  author: string;
  text: string;
  timestamp: string;
}

export interface TaskSolution {
  studentId: string;
  courseId: string;
  taskId: number;
  url: string;
  review: SolutionReview[];
  comments: SolutionComment[];
}

export interface CrossCheckFeedback {
  studentId: string;
  reviewerId: string;
  review: SolutionReview;
  totalScore: number;
  createdAt: string;
}

export interface CrossCheckAssignment {
  studentId: string;
}
