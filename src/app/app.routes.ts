import { Routes } from '@angular/router';
import { APP_ROUTES as AR } from './constants/app-routes.const';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { Layout } from './layout/layout.component';
import { CrossCheckSubmitComponent } from './pages/cross-check-submit/cross-check-submit.component';

export const routes: Routes = [
  {
    path: AR.LOGIN,
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: AR.REGISTER_STUDENT,
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [publicGuard],
    data: { formType: 'student' },
  },
  {
    path: AR.REGISTER_MENTOR,
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [publicGuard],
    data: { formType: 'mentor' },
  },
  {
    path: AR.SELECT_ROLE,
    loadComponent: () =>
      import('./pages/role-selection/role-selection.component').then(
        (m) => m.RoleSelectionComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/course/course.component').then((m) => m.CourseComponent),
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.DASHBOARD}`,
        loadComponent: () =>
          import('./pages/student-dashboard/student-dashboard.component').then(
            (m) => m.StudentDashboardComponent,
          ),
        data: { title: 'Student Dashboard' },
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
        loadComponent: () =>
          import('./pages/interviews/interviews.component').then((m) => m.InterviewsComponent),
        data: { title: 'Interview' },
      },
      {
        path: AR.MENTOR_DASHBOARD,
        loadComponent: () =>
          import('./pages/student-dashboard/student-dashboard.component').then(
            (m) => m.StudentDashboardComponent,
          ),
        data: { title: 'Mentor Dashboard' },
      },
      {
        path: AR.ADMIN_DASHBOARD,
        loadComponent: () =>
          import('./pages/student-dashboard/student-dashboard.component').then(
            (m) => m.StudentDashboardComponent,
          ),
        data: { title: 'Admin Dashboard' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
        data: { title: 'Profile' },
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
        data: { title: 'Notifications' },
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCSUBMIT}`,
        component: CrossCheckSubmitComponent,
        data: { title: 'Cross-Check Submit' },
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.CCREVIEW}`,
        loadComponent: () =>
          import('./pages/cross-check-review/cross-check-review.component').then(
            (m) => m.CrossCheckReviewComponent,
          ),
        data: { title: 'Cross-Check Review' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
