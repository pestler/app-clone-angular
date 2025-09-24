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
