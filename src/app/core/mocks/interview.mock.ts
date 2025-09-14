import { MentorInfo } from './student-stats.mock';

export interface InterviewInfo {
  title: string;
  interviewer: MentorInfo;
  status: 'Not Completed' | 'Completed' | 'No Interview';
  result: number | null;
  period: {
    start: string;
    end: string;
  };
}

export const mockInterviewInfo: InterviewInfo = {
  title: 'Angular interview',
  interviewer: {
    name: 'Jone Smith',
    github: 'github-smith',
    url: 'https://github.com/rolling-scopes-school',
    email: 'smith@example.com',
    telegram: '@smith-mentor',
    src: '../assets/svg/im-fine.svg',
  },
  status: 'Not Completed',
  result: null,
  period: {
    start: '2025-09-08',
    end: '2025-09-29',
  },
};
