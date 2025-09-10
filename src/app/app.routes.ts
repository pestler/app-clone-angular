import { Routes } from '@angular/router';
import { Layout } from './layout/layout.component';
import { LoginComponent } from './pages/login.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
  },

  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
