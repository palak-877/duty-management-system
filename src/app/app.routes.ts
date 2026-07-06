import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
    path: 'masters',
    loadComponent: () =>
      import('./features/masters/masters').then(m => m.Masters)
  },

  {
    path: 'employees',
    loadComponent: () =>
      import('./features/masters/employees/employees').then(m => m.Employees)
  },

  {
    path: 'assign-duty',
    loadComponent: () =>
      import('./features/transactions/assign-duty/assign-duty')
        .then(m => m.AssignDuty)
  }

];