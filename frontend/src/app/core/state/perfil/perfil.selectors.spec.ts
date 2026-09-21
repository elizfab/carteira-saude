import { criarPerfilVazio } from '../../../models';
import { perfisCarregados } from './perfil.actions';
import { perfilReducer } from './perfil.reducer';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from './perfil.selectors';

describe('perfil.selectors', () => {
  const p1 = criarPerfilVazio('p1', 'Ana');
  const p2 = criarPerfilVazio('p2', 'Bia');
  const perfilState = perfilReducer(undefined, perfisCarregados({ perfis: [p1, p2], ativoId: 'p2' }));
  const state = { perfil: perfilState };

  it('selectTodosPerfis retorna todos os perfis', () => {
    expect(selectTodosPerfis(state)).toEqual([p1, p2]);
  });

  it('selectAtivoId retorna o id ativo', () => {
    expect(selectAtivoId(state)).toBe('p2');
  });

  it('selectPerfilAtivo deriva o perfil ativo a partir do ativoId', () => {
    expect(selectPerfilAtivo(state)).toEqual(p2);
  });
});
