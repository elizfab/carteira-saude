import { createAction, props } from '@ngrx/store';
import { Perfil } from '../../../models';

export const perfisCarregados = createAction(
  '[Perfil] Perfis carregados',
  props<{ perfis: Perfil[]; ativoId: string }>()
);

export const perfilCriado = createAction('[Perfil] Perfil criado', props<{ perfil: Perfil }>());

export const perfilAtivoDefinido = createAction(
  '[Perfil] Perfil ativo definido',
  props<{ id: string }>()
);

export const perfilExcluido = createAction('[Perfil] Perfil excluído', props<{ id: string }>());

export const perfilAtualizado = createAction(
  '[Perfil] Perfil atualizado',
  props<{ perfil: Perfil }>()
);

export const perfisImportados = createAction(
  '[Perfil] Perfis importados',
  props<{ perfis: Perfil[]; ativoId: string }>()
);
