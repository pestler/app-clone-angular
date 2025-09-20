import { Routes } from '@angular/router';
import { APP_ROUTES as AR } from './constants/app-routes.const';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { Layout } from './layout/layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CourseComponent } from './pages/course/course.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { LoginComponent } from './pages/login/login.component';
import { MentorDashboardComponent } from './pages/mentor-dashboard/mentor-dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { RoleSelectionComponent } from './pages/role-selection/role-selection.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';

export const routes: Routes = [
  {
    path: AR.LOGIN,
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: AR.REGISTER_STUDENT,
    component: RegisterComponent,
    canActivate: [publicGuard],
    data: { formType: 'student' },
  },
  {
    path: AR.REGISTER_MENTOR,
    component: RegisterComponent,
    canActivate: [publicGuard],
    data: { formType: 'mentor' },
  },
  {
    path: AR.SELECT_ROLE,
    component: RoleSelectionComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CourseComponent,
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.DASHBOARD}`,
        component: StudentDashboardComponent,
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
        component: InterviewsComponent,
      },
      {
        path: AR.MENTOR_DASHBOARD,
        component: MentorDashboardComponent,
      },
      {
        path: AR.ADMIN_DASHBOARD,
        component: AdminDashboardComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
