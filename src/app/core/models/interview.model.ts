export type InterviewStatus = 'Not Completed' | 'Completed' | 'No Interview';

export interface InterviewInfo {
  id?: string;
  title: string;
  interviewer: {
    name: string;
    github: string;
    url: string;
    email: string;
    telegram: string;
    src: string;
  };
  status: InterviewStatus;
  result: number | null;
  period: {
    start: string;
    end: string;
  };
  courseAlias?: string;
  studentId?: string;
}

export interface InterviewStateMentor {
  status: InterviewStatus;
  rating: number | null;
}
