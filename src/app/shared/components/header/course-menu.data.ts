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
];

export function getCourseLinks(activeCourse: Course | null): LinkData[] {
  if (!activeCourse) {
    return [];
  }
  return studentCourseLinks;
}
