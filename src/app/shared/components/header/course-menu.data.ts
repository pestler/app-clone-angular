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
  getUrl: (course: Course) => { path: string; query?: Record<string, string> };
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
    getUrl: (course: Course) => ({
      path: '/course/student/dashboard',
      query: { course: course.alias },
    }),
    access: isStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Dashboard',
    icon: 'apps',
    getUrl: (course: Course) => ({
      path: '/course/mentor/dashboard',
      query: { course: course.alias },
    }),
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Score',
    icon: 'local_fire_department',
    getUrl: (course: Course) => ({
      path: '/course/score',
      query: { course: course.alias },
    }),
    access: anyAccess,
    color: 'var(--icon-orange)',
  },
  {
    name: 'Schedule',
    icon: 'calendar_today',
    getUrl: (course: Course) => ({
      path: '/course/schedule',
      query: { course: course.alias },
    }),
    access: anyAccess,
    color: 'var(--icon-pink)',
  },
  {
    name: 'My Students',
    icon: 'emoji_events',
    getUrl: (course: Course) => ({
      path: '/course/mentor/students',
      query: { course: course.alias },
    }),
    access: isMentor,
    color: '',
  },
  {
    name: 'Cross-Check: Submit',
    icon: 'code',
    getUrl: (course: Course) => ({
      path: '/course/student/cross-check-submit',
      query: { course: course.alias },
    }),
    access: isActiveStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Cross-Check: Review',
    icon: 'check_circle',
    getUrl: (course: Course) => ({
      path: '/course/student/cross-check-review',
      query: { course: course.alias },
    }),
    access: isActiveStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-red)',
  },
  {
    name: 'Interviews',
    icon: 'mic',
    getUrl: (course: Course) => ({
      path: '/course/student/interviews',
      query: { course: course.alias },
    }),
    access: isStudent,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Interviews',
    icon: 'mic',
    getUrl: (course: Course) => ({
      path: '/course/mentor/interviews',
      query: { course: course.alias },
    }),
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-black)',
  },
  {
    name: 'Auto-Test',
    icon: 'play_circle_outline',
    getUrl: (course: Course) => ({
      path: '/course/auto-test',
      query: { course: course.alias },
    }),
    access: (session, courseId) =>
      isCourseManager(session, courseId) || isActiveStudent(session, courseId),
    courseAccess: isCourseNotCompleted,
    color: 'var(--icon-violet)',
  },
  {
    name: 'Expel/Unassign Student',
    icon: 'stop_circle',
    getUrl: (course: Course) => ({
      path: '/course/mentor/expel-student',
      query: { course: course.alias },
    }),
    access: isMentor,
    courseAccess: isCourseNotCompleted,
    color: '',
  },
  {
    name: 'Team Distributions',
    icon: 'group_add',
    getUrl: (course: Course) => ({
      path: '/course/team-distributions',
      query: { course: course.alias },
    }),
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
    getUrl: (course: Course) => ({
      path: '/course/stats',
      query: { course: course.alias },
    }),
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
