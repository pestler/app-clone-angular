export enum CourseRole {
  Student = 'student',
  Mentor = 'mentor',
  Manager = 'course-manager',
  Supervisor = 'course-supervisor',
  TaskOwner = 'task-owner',
  Dementor = 'dementor',
}

export interface Course {
  id: number;
  alias: string;
  completed: boolean;
}

export interface Session {
  isAdmin: boolean;
  courses: Record<
    number,
    {
      roles: CourseRole[];
      isExpelled?: boolean;
      mentorId?: string;
    }
  >;
}
