import { Course, CourseRole, Session } from '../auth/auth.models';

export const mockCourse: Course = {
  id: 1,
  alias: 'rs-app-2025-q3',
  completed: false,
};

export const mockSession: Session = {
  isAdmin: false,
  courses: {
    [mockCourse.id]: {
      roles: [CourseRole.Student],
    },
  },
};
