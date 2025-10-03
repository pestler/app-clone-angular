import { CourseRole, Session } from './auth.models';

function hasRole(session: Session, courseId: number, role: CourseRole) {
  return session.courses[courseId]?.roles.includes(role) ?? false;
}

export function isExpelledStudent(session: Session, courseId: number) {
  return session.courses[courseId]?.isExpelled === true;
}

export function isAdmin(session: Session) {
  return Boolean(session.isAdmin);
}

export function isMentor(session: Session, courseId: number) {
  return !!courseId && hasRole(session, courseId, CourseRole.Mentor);
}

export function isStudent(session: Session, courseId: number) {
  return !!courseId && hasRole(session, courseId, CourseRole.Student);
}

export function isActiveStudent(session: Session, courseId: number) {
  return isStudent(session, courseId) && !isExpelledStudent(session, courseId);
}

export function isCourseManager(session: Session, courseId: number) {
  return isAdmin(session) || hasRole(session, courseId, CourseRole.Manager);
}

export function isDementor(session: Session, courseId: number) {
  return isAdmin(session) || hasRole(session, courseId, CourseRole.Dementor);
}
