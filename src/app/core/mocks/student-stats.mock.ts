export interface StudentStats {
  scorePoints: number;
  completedTasks: {
    done: number;
    total: number;
  };
  status: 'Active' | 'Inactive' | 'Archived';
}

export interface MentorInfo {
  name: string;
  github: string;
  url: string;
  email: string;
  telegram: string;
  src: string;
}

export const mockStudentStats: StudentStats = {
  scorePoints: 159.8,
  completedTasks: {
    done: 14,
    total: 17,
  },
  status: 'Active',
};

export const mockMentorInfo: MentorInfo = {
  name: 'Ivan Ivanov',
  github: 'rolling-scopes-school',
  url: 'https://github.com/rolling-scopes-school',
  email: 'ivanov@gmail.com',
  telegram: '@ivanov',
  src: '../assets/svg/im-fine.svg',
};
