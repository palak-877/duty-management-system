import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Masters } from './features/masters/masters';
import { Employees } from './features/masters/employees/employees';
import { AssignDuty } from './features/transactions/assign-duty/assign-duty';
import { Reports } from './features/reports/reports';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Projects } from './features/masters/projects/projects';
import { Designations } from './features/masters/designations/designations';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'projects',
    component: Projects,
    canActivate: [authGuard]
  },

  {
    path: 'designations',
    component: Designations,
    canActivate: [authGuard]
  },

  {
    path: 'officers',
    loadComponent: () =>
      import('./features/masters/officers/officers')
        .then(m => m.Officers),
    canActivate: [authGuard]
  },

  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
      },

      {
        path: 'masters',
        component: Masters,
        canActivate: [authGuard]
      },

      {
        path: 'employees',
        component: Employees,
        canActivate: [authGuard]
      },

      {
        path: 'transactions',
        component: AssignDuty,
        canActivate: [authGuard]
      },

      {
        path: 'reports',
        component: Reports,
        canActivate: [authGuard]
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];