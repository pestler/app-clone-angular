/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface SolutionReview {
  // TODO: Define specific properties for a review object
  // Example: score: number; comment: string;
}

export interface SolutionComment {
  // TODO: Define specific properties for a comment object
  // Example: author: string; text: string; timestamp: string;
}

export interface TaskSolution {
  url: string;
  review: SolutionReview[];
  comments: SolutionComment[];
}

export interface CrossCheckFeedback {
  id: string;
  // TODO: Define specific properties for a feedback object
  // Example: feedbackDate: string; badgeId: string; comment: string; fromUser: { name: string; githubId: string; };
}
