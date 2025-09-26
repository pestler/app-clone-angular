export interface TaskDetails {
  id: number;
  taskId: number;
  type: string;
  name: string;
  studentStartDate: string;
  studentEndDate: string;
  maxScore: number;
  scoreWeight: number;
  descriptionUrl: string;
  checker: string;
  crossCheckStatus: string;
  crossCheckEndDate: string | null;
  pairsCount: number | null;
  submitText: string | null;
  taskOwner: {
    id: number;
    name: string;
    githubId: string;
  };
  validations: unknown; // Changed from any
  taskSolutions: unknown; // Changed from any
  studentRegistrationStartDate: string | null;
  publicAttributes: {
    maxAttemptsNumber?: number;
    numberOfQuestions?: number;
    strictAttemptsMode?: boolean;
    tresholdPercentage?: number;
    questions?: Question[]; // Changed from any[]
  };
  githubRepoName: string;
  sourceGithubRepoUrl: string;
  resultsCount: number;
}

export type Question = Record<string, unknown>;
