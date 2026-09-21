import { criarPerfilVazio } from '../../../models';
import {
  perfilAtivoDefinido,
  perfilAtualizado,
  perfilCriado,
  perfilExcluido,
  perfisCarregados,
  perfisImportados,
} from './perfil.actions';
import { initialPerfilState, perfilReducer } from './perfil.reducer';

describe('perfilReducer', () => {
  it('retorna o estado inicial para uma action desconhecida', () => {
    const state = perfilReducer(undefined, { type: '@@init' });
    expect(state).toEqual(initialPerfilState);
  });

  it('perfisCarregados substitui todos os perfis e define o ativo', () => {
    const p1 = criarPerfilVazio('p1', 'Ana');
    const state = perfilReducer(undefined, perfisCarregados({ perfis: [p1], ativoId: 'p1' }));
    expect(state.ids).toEqual(['p1']);
    expect(state.entities['p1']).toEqual(p1);
    expect(state.ativoId).toBe('p1');
  });

  it('perfilCriado adiciona o perfil e o torna ativo', () => {
    const p1 = criarPerfilVazio('p1');
    const p2 = criarPerfilVazio('p2', 'Bia');
    let state = perfilReducer(undefined, perfisCarregados({ perfis: [p1], ativoId: 'p1' }));
    state = perfilReducer(state, perfilCriado({ perfil: p2 }));

    expect(state.ids).toEqual(['p1', 'p2']);
    expect(state.ativoId).toBe('p2');
  });

  it('perfilAtivoDefinido só troca o ativoId, sem mexer nos perfis', () => {
    const p1 = criarPerfilVazio('p1');
    const p2 = criarPerfilVazio('p2');
    let state = perfilReducer(undefined, perfisCarregados({ perfis: [p1, p2], ativoId: 'p1' }));
    state = perfilReducer(state, perfilAtivoDefinido({ id: 'p2' }));

    expect(state.ativoId).toBe('p2');
    expect(state.ids).toEqual(['p1', 'p2']);
  });

  it('perfilExcluido remove só o perfil informado', () => {
    const p1 = criarPerfilVazio('p1');
    const p2 = criarPerfilVazio('p2');
    let state = perfilReducer(undefined, perfisCarregados({ perfis: [p1, p2], ativoId: 'p1' }));
    state = perfilReducer(state, perfilExcluido({ id: 'p1' }));

    expect(state.ids).toEqual(['p2']);
    expect(state.entities['p1']).toBeUndefined();
  });

  it('perfilAtualizado faz upsert sem duplicar nem afetar outros perfis', () => {
    const p1 = criarPerfilVazio('p1', 'Ana');
    let state = perfilReducer(undefined, perfisCarregados({ perfis: [p1], ativoId: 'p1' }));
    const p1Editado = { ...p1, notas: 'nova nota' };
    state = perfilReducer(state, perfilAtualizado({ perfil: p1Editado }));

    expect(state.ids).toEqual(['p1']);
    expect(state.entities['p1']?.notas).toBe('nova nota');
  });

  it('perfisImportados faz upsertMany e define o ativo', () => {
    const p1 = criarPerfilVazio('p1');
    const p2 = criarPerfilVazio('p2');
    const state = perfilReducer(undefined, perfisImportados({ perfis: [p1, p2], ativoId: 'p2' }));

    expect(state.ids.sort()).toEqual(['p1', 'p2']);
    expect(state.ativoId).toBe('p2');
  });
});
