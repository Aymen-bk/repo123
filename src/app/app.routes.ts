import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('./features/import/import.component').then(m => m.ImportComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(m => m.SearchComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'company/:id',
    loadComponent: () =>
      import('./features/company-profile/company-profile.component').then(m => m.CompanyProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./features/compare/compare.component').then(m => m.CompareComponent),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'auth' },
];
