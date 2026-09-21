import { Routes } from '@angular/router';

export const CARTEIRA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dados' },
  {
    path: 'dados',
    loadComponent: () =>
      import('./dados-pessoais/dados-pessoais.component').then((m) => m.DadosPessoaisComponent),
  },
  {
    path: 'condicoes',
    loadComponent: () => import('./condicoes/condicoes.component').then((m) => m.CondicoesComponent),
  },
  {
    path: 'equipe',
    loadComponent: () => import('./equipe/equipe.component').then((m) => m.EquipeComponent),
  },
  {
    path: 'vacinas',
    loadComponent: () => import('./vacinas/vacinas.component').then((m) => m.VacinasComponent),
  },
  {
    path: 'medicamentos',
    loadComponent: () =>
      import('./medicamentos/medicamentos.component').then((m) => m.MedicamentosComponent),
  },
  {
    path: 'exames',
    loadComponent: () => import('./exames/exames.component').then((m) => m.ExamesComponent),
  },
  {
    path: 'consultas',
    loadComponent: () => import('./consultas/consultas.component').then((m) => m.ConsultasComponent),
  },
  {
    path: 'alergias',
    loadComponent: () => import('./alergias/alergias.component').then((m) => m.AlergiasComponent),
  },
  {
    path: 'cirurgias',
    loadComponent: () => import('./cirurgias/cirurgias.component').then((m) => m.CirurgiasComponent),
  },
  {
    path: 'familiar',
    loadComponent: () => import('./familiar/familiar.component').then((m) => m.FamiliarComponent),
  },
  {
    path: 'controle',
    loadComponent: () => import('./controle/controle.component').then((m) => m.ControleComponent),
  },
  {
    path: 'notas',
    loadComponent: () => import('./notas/notas.component').then((m) => m.NotasComponent),
  },
  {
    path: 'opcoes',
    loadComponent: () => import('./opcoes/opcoes.component').then((m) => m.OpcoesComponent),
  },
];
