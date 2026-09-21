import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'carteira/dados' },
  {
    path: 'carteira',
    loadComponent: () =>
      import('./pages/carteira/carteira-shell/carteira-shell.component').then(
        (m) => m.CarteiraShellComponent
      ),
    loadChildren: () => import('./pages/carteira/carteira.routes').then((m) => m.CARTEIRA_ROUTES),
  },
  {
    path: 'preview',
    loadComponent: () => import('./pages/preview/preview.component').then((m) => m.PreviewComponent),
  },
  { path: '**', redirectTo: '' },
];
