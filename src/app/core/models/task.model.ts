export interface TaskPhase {
  phase: string;
  startDate: string;
  endDate: string;
  status: string;
  tag: string;
}

export interface Task {
  id: number;
  name: string;
  descriptionUrl: string;
  maxScore: number;
  organizer: {
    githubId: string;
    id: number;
    name: string;
  };
  scoreWeight: number;
  submitText?: string | null;
  phases?: TaskPhase[];
  tags?: string[];
  tag?: string;
}
