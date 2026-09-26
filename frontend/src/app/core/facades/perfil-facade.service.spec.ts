import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Perfil, criarEquipeVazia, criarPerfilVazio } from '../../models';
import { IdService } from '../services/id.service';
import {
  perfilAtivoDefinido,
  perfilAtualizado,
  perfilCriado,
  perfilExcluido,
  selectAtivoId,
  selectPerfilAtivo,
  selectTodosPerfis,
} from '../state/perfil';
import { PerfilFacadeService } from './perfil-facade.service';

describe('PerfilFacadeService', () => {
  let service: PerfilFacadeService;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let perfilAtivo: Perfil;

  beforeEach(() => {
    perfilAtivo = criarPerfilVazio('p1', 'Ana');

    TestBed.configureTestingModule({
      providers: [
        PerfilFacadeService,
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfilAtivo },
            { selector: selectTodosPerfis, value: [perfilAtivo] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: IdService, useValue: { gerar: jest.fn(() => 'id-gerado') } },
      ],
    });

    service = TestBed.inject(PerfilFacadeService);
    store = TestBed.inject(Store) as unknown as MockStore;
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('criarPerfil despacha perfilCriado com um perfil novo vazio', () => {
    const perfil = service.criarPerfil('Bia');
    expect(perfil.dados.nome).toBe('Bia');
    expect(dispatchSpy).toHaveBeenCalledWith(perfilCriado({ perfil }));
  });

  it('definirAtivo despacha perfilAtivoDefinido', () => {
    service.definirAtivo('p2');
    expect(dispatchSpy).toHaveBeenCalledWith(perfilAtivoDefinido({ id: 'p2' }));
  });

  describe('excluirPerfil', () => {
    it('cria um novo perfil vazio quando exclui o último perfil restante', () => {
      service.excluirPerfil('p1');
      expect(dispatchSpy).toHaveBeenCalledWith(perfilExcluido({ id: 'p1' }));
      const chamadaCriarPerfil = dispatchSpy.mock.calls.find(([acao]) => acao.type === perfilCriado.type);
      expect(chamadaCriarPerfil).toBeDefined();
    });

    it('define o primeiro perfil restante como ativo quando o excluído era o ativo', () => {
      const p2 = criarPerfilVazio('p2');
      store.overrideSelector(selectTodosPerfis, [perfilAtivo, p2]);
      store.refreshState();

      service.excluirPerfil('p1');

      expect(dispatchSpy).toHaveBeenCalledWith(perfilExcluido({ id: 'p1' }));
      expect(dispatchSpy).toHaveBeenCalledWith(perfilAtivoDefinido({ id: 'p2' }));
    });
  });

  it('atualizarDados mescla o parcial nos dados do perfil ativo e despacha perfilAtualizado', () => {
    service.atualizarDados({ nome: 'Ana Paula' });
    expect(dispatchSpy).toHaveBeenCalledWith(
      perfilAtualizado({ perfil: { ...perfilAtivo, dados: { ...perfilAtivo.dados, nome: 'Ana Paula' } } })
    );
  });

  it('atualizarFamiliarItem só altera a categoria informada', () => {
    service.atualizarFamiliarItem('diabetes', { r: 'sim', t: 'avó, 60 anos' });
    const acao = dispatchSpy.mock.calls[0][0];
    expect(acao.perfil.familiar.diabetes).toEqual({ r: 'sim', t: 'avó, 60 anos' });
    expect(acao.perfil.familiar.hipertensao).toEqual({ r: '', t: '' });
  });

  describe('tabelas simples (adicionar/atualizar/remover linha)', () => {
    it('adicionarLinha inclui a linha ao final do array da seção', () => {
      const linha = { id: 'v1', nome: 'BCG', dose: '', data: '', lote: '', local: '', reforco: '', obs: '' };
      service.adicionarLinha('vacinas', linha);
      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.vacinas).toEqual([linha]);
    });

    it('atualizarLinha faz merge só na linha do índice informado', () => {
      const perfilComVacina: Perfil = {
        ...perfilAtivo,
        vacinas: [{ id: 'v1', nome: 'BCG', dose: '', data: '', lote: '', local: '', reforco: '', obs: '' }],
      };
      store.overrideSelector(selectPerfilAtivo, perfilComVacina);
      store.refreshState();

      service.atualizarLinha('vacinas', 0, { dose: '1ª dose' });

      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.vacinas[0].dose).toBe('1ª dose');
      expect(acao.perfil.vacinas[0].nome).toBe('BCG');
    });

    it('removerLinha remove só o índice informado', () => {
      const perfilComVacinas: Perfil = {
        ...perfilAtivo,
        vacinas: [
          { id: 'v1', nome: 'BCG', dose: '', data: '', lote: '', local: '', reforco: '', obs: '' },
          { id: 'v2', nome: 'Hepatite B', dose: '', data: '', lote: '', local: '', reforco: '', obs: '' },
        ],
      };
      store.overrideSelector(selectPerfilAtivo, perfilComVacinas);
      store.refreshState();

      service.removerLinha('vacinas', 0);

      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.vacinas).toEqual([perfilComVacinas.vacinas[1]]);
    });
  });

  describe('equipe', () => {
    it('adicionarEspecialista adiciona um novo card de equipe', () => {
      service.adicionarEspecialista('Pediatria');
      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.equipe).toEqual([criarEquipeVazia('id-gerado', 'Pediatria')]);
    });

    it('removerEspecialista remove o especialista e suas sub-tabelas', () => {
      const perfilComEquipe: Perfil = { ...perfilAtivo, equipe: [criarEquipeVazia('eq1', 'Pediatria')] };
      store.overrideSelector(selectPerfilAtivo, perfilComEquipe);
      store.refreshState();

      service.removerEspecialista(0);

      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.equipe).toEqual([]);
    });

    it('adicionarLinhaEquipe insere na sub-tabela correta do especialista', () => {
      const perfilComEquipe: Perfil = { ...perfilAtivo, equipe: [criarEquipeVazia('eq1', 'Pediatria')] };
      store.overrideSelector(selectPerfilAtivo, perfilComEquipe);
      store.refreshState();

      const consulta = { id: 'c1', data: '', retorno: '', obs: '' };
      service.adicionarLinhaEquipe(0, 'consultas', consulta);

      const acao = dispatchSpy.mock.calls[0][0];
      expect(acao.perfil.equipe[0].consultas).toEqual([consulta]);
      expect(acao.perfil.equipe[0].exames).toEqual([]);
    });
  });
});
