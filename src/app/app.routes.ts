import { Routes } from '@angular/router';
import { APP_ROUTES as AR } from './constants/app-routes.const';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { Layout } from './layout/layout.component';
import { CourseComponent } from './pages/course/course.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: AR.LOGIN,
    component: LoginComponent,
    canActivate: [publicGuard],
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
        component: DashboardComponent,
      },
      {
        path: `${AR.COURSE}/${AR.STUDENT}/${AR.INTERVIEWS}`,
        component: InterviewsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
