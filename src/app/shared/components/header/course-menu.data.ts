import { APP_ROUTES as AR } from '../../../constants/app-routes.const';
import { Course } from '../../../core/models/dashboard.models';

export interface LinkData {
  name: string;
  icon?: string;
  getUrl: (course: Course | undefined) => { path: string; query?: Record<string, string> };
  color: string;
}

const studentCourseLinks: LinkData[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.DASHBOARD}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
  {
    name: 'Score',
    icon: 'grade',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.SCORE}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
  {
    name: 'Cross-Check: Submit',
    icon: 'code',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCSUBMIT}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
  {
    name: 'Cross-Check: Review',
    icon: 'check_circle',
    color: 'var(--icon-red)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCREVIEW}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
  {
    name: 'Interviews',
    icon: 'mic',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
];

const mentorCourseLinks: LinkData[] = [
  {
    name: 'Mentor Dashboard',
    icon: 'supervisor_account',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: AR.MENTOR_DASHBOARD,
      query: course ? { course: course.alias } : undefined,
    }),
  },
  {
    name: 'Score',
    icon: 'grade',
    color: 'var(--icon-black)',
    getUrl: (course: Course | undefined) => ({
      path: `${AR.COURSE}/${AR.SCORE}`,
      query: course ? { course: course.alias } : undefined,
    }),
  },
];

const adminLinks: LinkData[] = [
  {
    name: 'Course List',
    icon: 'list_alt',
    color: 'var(--icon-blue)',
    getUrl: (course: Course | undefined) => ({
      path: 'admin/courses',
      query: course ? { course: course.alias } : undefined,
    }),
  },
];

export function getCourseLinks(
  activeCourse: Course | null,
  isAdmin: boolean,
  isStudent: boolean,
  isMentor: boolean,
): LinkData[] {
  if (!activeCourse) {
    return [];
  }

  const links: LinkData[] = [];
  if (isStudent) {
    links.push(...studentCourseLinks);
  }

  if (isMentor) {
    const mentorLinksToAdd = mentorCourseLinks.filter(
      (ml) => !links.some((l) => l.name === ml.name),
    );
    links.push(...mentorLinksToAdd);
  }

  if (isAdmin) {
    links.push(...adminLinks);
  }

  return links;
}
