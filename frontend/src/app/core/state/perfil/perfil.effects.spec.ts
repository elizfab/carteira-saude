import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { criarPerfilVazio } from '../../../models';
import { IdService } from '../../services/id.service';
import { StorageService } from '../../services/storage.service';
import { perfilAtualizado, perfisCarregados } from './perfil.actions';
import { PerfilEffects } from './perfil.effects';
import { selectAtivoId, selectTodosPerfis } from './perfil.selectors';

describe('PerfilEffects', () => {
  let actions$: Subject<unknown>;
  let effects: PerfilEffects;
  let storageService: { carregar: jest.Mock; salvar: jest.Mock };
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Subject();
    storageService = { carregar: jest.fn(), salvar: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        PerfilEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: selectTodosPerfis, value: [] },
            { selector: selectAtivoId, value: '' },
          ],
        }),
        { provide: StorageService, useValue: storageService },
        { provide: IdService, useValue: { gerar: jest.fn(() => 'novo-id') } },
      ],
    });

    effects = TestBed.inject(PerfilEffects);
    store = TestBed.inject(Store) as unknown as MockStore;
  });

  describe('carregarInicial$', () => {
    it('cria um perfil vazio quando não há nada salvo', (done) => {
      storageService.carregar.mockReturnValue(null);

      effects.carregarInicial$.subscribe((action) => {
        expect(action).toEqual(
          perfisCarregados({ perfis: [criarPerfilVazio('novo-id')], ativoId: 'novo-id' })
        );
        done();
      });

      actions$.next({ type: ROOT_EFFECTS_INIT });
    });

    it('normaliza os perfis salvos e mantém o ativo salvo se ele ainda existir', (done) => {
      const p1 = criarPerfilVazio('p1', 'Ana');
      storageService.carregar.mockReturnValue({ ativo: 'p1', perfis: { p1 } });

      effects.carregarInicial$.subscribe((action) => {
        expect(action).toEqual(perfisCarregados({ perfis: [p1], ativoId: 'p1' }));
        done();
      });

      actions$.next({ type: ROOT_EFFECTS_INIT });
    });

    it('cai para o primeiro perfil disponível se o ativo salvo não existir mais', (done) => {
      const p1 = criarPerfilVazio('p1');
      storageService.carregar.mockReturnValue({ ativo: 'id-que-nao-existe-mais', perfis: { p1 } });

      effects.carregarInicial$.subscribe((action) => {
        expect(action).toEqual(perfisCarregados({ perfis: [p1], ativoId: 'p1' }));
        done();
      });

      actions$.next({ type: ROOT_EFFECTS_INIT });
    });
  });

  describe('persistir$', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('salva no storage 250ms depois de uma action relevante (debounced)', () => {
      const p1 = criarPerfilVazio('p1', 'Ana');
      store.overrideSelector(selectTodosPerfis, [p1]);
      store.overrideSelector(selectAtivoId, 'p1');
      store.refreshState();

      effects.persistir$.subscribe();
      actions$.next(perfilAtualizado({ perfil: p1 }));

      jest.advanceTimersByTime(249);
      expect(storageService.salvar).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(storageService.salvar).toHaveBeenCalledWith({ ativo: 'p1', perfis: { p1 } });
    });

    it('reinicia o debounce a cada nova mudança, salvando só uma vez ao final', () => {
      const p1 = criarPerfilVazio('p1');
      store.overrideSelector(selectTodosPerfis, [p1]);
      store.overrideSelector(selectAtivoId, 'p1');
      store.refreshState();

      effects.persistir$.subscribe();
      actions$.next(perfilAtualizado({ perfil: p1 }));
      jest.advanceTimersByTime(200);
      actions$.next(perfilAtualizado({ perfil: p1 }));
      jest.advanceTimersByTime(200);

      expect(storageService.salvar).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(storageService.salvar).toHaveBeenCalledTimes(1);
    });
  });
});
