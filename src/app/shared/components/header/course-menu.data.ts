import { Course, Session } from '../../../core/auth/auth.models';
import {
  isActiveStudent,
  isAdmin,
  isCourseManager,
  isDementor,
  isMentor,
  isStudent,
} from '../../../core/auth/user-roles';

export interface LinkData {
  name: string;
  icon?: string;
  getUrl: (course: Course) => string;
  access: (session: Session, courseId: number) => boolean;
  courseAccess?: (session: Session, course: Course) => boolean;
  color: string;
}

const anyAccess = () => true;
const isCourseNotCompleted = (_: Session, course: Course) => !course.completed;

const links: LinkData[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    getUrl: (course: Course) => `/course/student/dashboard?course=${course.alias}`,
    access: isStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Dashboard',
    icon: 'apps',
    getUrl: (course: Course) => `/course/mentor/dashboard?course=${course.alias}`,
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Score',
    icon: 'local_fire_department',
    getUrl: (course: Course) => `/course/score?course=${course.alias}`,
    access: anyAccess,
    color: 'var(--icon-orange)',
  },
  {
    name: 'Schedule',
    icon: 'calendar_today',
    getUrl: (course: Course) => `/course/schedule?course=${course.alias}`,
    access: anyAccess,
    color: 'var(--icon-pink)',
  },
  {
    name: 'My Students',
    icon: 'emoji_events',
    getUrl: (course: Course) => `/course/mentor/students?course=${course.alias}`,
    access: isMentor,
    color: '',
  },
  {
    name: 'Cross-Check: Submit',
    icon: 'code',
    getUrl: (course: Course) => `/course/student/cross-check-submit?course=${course.alias}`,
    access: isActiveStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Cross-Check: Review',
    icon: 'check_circle',
    getUrl: (course: Course) => `/course/student/cross-check-review?course=${course.alias}`,
    access: isActiveStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-red)',
  },
  {
    name: 'Interviews',
    icon: 'mic',
    getUrl: (course: Course) => `/course/student/interviews?course=${course.alias}`,
    access: isStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Interviews',
    icon: 'mic',
    getUrl: (course: Course) => `/course/mentor/interviews?course=${course.alias}`,
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Auto-Test',
    icon: 'play_circle_outline',
    getUrl: (course: Course) => `/course/auto-test?course=${course.alias}`,
    access: (session, courseId) =>
      isCourseManager(session, courseId) || isActiveStudent(session, courseId),
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-violet)',
  },
  {
    name: 'Expel/Unassign Student',
    icon: 'stop_circle',
    getUrl: (course: Course) => `/course/mentor/expel-student?course=${course.alias}`,
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: '',
  },
  {
    name: 'Team Distributions',
    icon: 'group_add',
    getUrl: (course: Course) => `/course/team-distributions?course=${course.alias}`,
    access: (session, courseId) =>
      isCourseManager(session, courseId) ||
      isActiveStudent(session, courseId) ||
      isDementor(session, courseId),
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-violet)',
  },
  {
    name: 'Course Statistics',
    icon: 'apps',
    getUrl: (course: Course) => `/course/stats?course=${course.alias}`,
    access: anyAccess,
    color: 'var(--icon-black)',
  },
];

export function getCourseLinks(session: Session, activeCourse: Course | null): LinkData[] {
  if (!activeCourse) {
    return [];
  }
  return links.filter(
    (route) =>
      isAdmin(session) ||
      (route.access(session, activeCourse.id) &&
        (route.courseAccess?.(session, activeCourse) ?? true)),
  );
}
