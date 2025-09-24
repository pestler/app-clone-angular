import { APP_ROUTES as AR } from '../../../constants/app-routes.const';
import { Course } from '../../../core/models/dashboard.models';

export interface LinkData {
  name: string;
  icon?: string;
  getUrl: (course: Course) => { path: string; query?: Record<string, string> };
  color: string;
}

const studentCourseLinks: LinkData[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    color: 'var(--icon-black)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.DASHBOARD}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Score',
    icon: 'local_fire_department',
    color: 'var(--icon-orange)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.SCORE}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Schedule',
    icon: 'calendar_today',
    color: 'var(--icon-pink)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.SCHEDULE}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Cross-Check: Submit',
    icon: 'code',
    color: 'var(--icon-black)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCSUBMIT}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Cross-Check: Review',
    icon: 'check_circle',
    color: 'var(--icon-red)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCREVIEW}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Interviews',
    icon: 'mic',
    color: 'var(--icon-black)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Auto-Test',
    icon: 'play_circle_outline',
    color: 'var(--icon-violet)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.AUTOTEST}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Team Distributions',
    icon: 'group_add',
    color: 'var(--icon-violet)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.TDISTRIBUTIONS}`,
      query: { course: course.alias },
    }),
  },
  {
    name: 'Course Statistics',
    icon: 'apps',
    color: 'var(--icon-black)',
    getUrl: (course: Course) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.STATS}`,
      query: { course: course.alias },
    }),
  },
];

export function getCourseLinks(activeCourse: Course | null): LinkData[] {
  if (!activeCourse) {
    return [];
  }
  return studentCourseLinks;
}
