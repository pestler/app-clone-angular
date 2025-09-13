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
  avatarUrl: string;
  email: string;
  telegram: string;
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
  avatarUrl: '',
  email: 'ivanov@gmail.com',
  telegram: '@ivanov',
};
