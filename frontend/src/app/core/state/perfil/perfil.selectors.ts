import { createFeatureSelector, createSelector } from '@ngrx/store';
import { perfilAdapter, PerfilState } from './perfil.reducer';

export const selectPerfilState = createFeatureSelector<PerfilState>('perfil');

const { selectAll, selectEntities, selectTotal } = perfilAdapter.getSelectors(selectPerfilState);

export const selectTodosPerfis = selectAll;
export const selectPerfisPorId = selectEntities;
export const selectTotalPerfis = selectTotal;

export const selectAtivoId = createSelector(selectPerfilState, (state) => state.ativoId);

export const selectPerfilAtivo = createSelector(
  selectPerfisPorId,
  selectAtivoId,
  (perfis, ativoId) => perfis[ativoId]
);
