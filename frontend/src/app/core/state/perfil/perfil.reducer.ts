import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Perfil } from '../../../models';
import {
  perfilAtivoDefinido,
  perfilAtualizado,
  perfilCriado,
  perfilExcluido,
  perfisCarregados,
  perfisImportados,
} from './perfil.actions';

export interface PerfilState extends EntityState<Perfil> {
  ativoId: string;
}

export const perfilAdapter: EntityAdapter<Perfil> = createEntityAdapter<Perfil>();

export const initialPerfilState: PerfilState = perfilAdapter.getInitialState({ ativoId: '' });

export const perfilReducer = createReducer(
  initialPerfilState,
  on(perfisCarregados, (state, { perfis, ativoId }) =>
    perfilAdapter.setAll(perfis, { ...state, ativoId })
  ),
  on(perfilCriado, (state, { perfil }) =>
    perfilAdapter.addOne(perfil, { ...state, ativoId: perfil.id })
  ),
  on(perfilAtivoDefinido, (state, { id }) => ({ ...state, ativoId: id })),
  on(perfilExcluido, (state, { id }) => perfilAdapter.removeOne(id, state)),
  on(perfilAtualizado, (state, { perfil }) => perfilAdapter.upsertOne(perfil, state)),
  on(perfisImportados, (state, { perfis, ativoId }) =>
    perfilAdapter.upsertMany(perfis, { ...state, ativoId })
  )
);
