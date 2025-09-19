import { Course, CourseRole, Session } from '../auth/auth.models';

export const mockCourse: Course = {
  id: 1,
  alias: 'rs-app-2025-q3',
  completed: false,
};

export const mockSession: Session = {
  id: 999,
  isAdmin: false,
  isHirer: false,
  githubId: 'mock-user',
  appRoles: ['user'],
  roles: {
    [mockCourse.id]: CourseRole.Student,
  },
  courses: {
    [mockCourse.id]: {
      roles: [CourseRole.Student],
      studentId: 99999,
    },
  },
};
