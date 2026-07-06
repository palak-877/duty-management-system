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
    component: Projects
  },

  {
  path: 'designations',
  component: Designations
},

  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'masters',
        component: Masters
      },
      {
        path: 'employees',
        component: Employees
      },
      {
        path: 'transactions',
        component: AssignDuty
      },
      {
        path: 'reports',
        component: Reports
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];