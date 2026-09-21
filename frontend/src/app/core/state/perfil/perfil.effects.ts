import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounceTime, map, tap, withLatestFrom } from 'rxjs/operators';
import { DEBOUNCE_SALVAR_MS, criarPerfilVazio, normalizarPerfil } from '../../../models';
import { IdService } from '../../services/id.service';
import { StorageService } from '../../services/storage.service';
import {
  perfilAtivoDefinido,
  perfilAtualizado,
  perfilCriado,
  perfilExcluido,
  perfisCarregados,
  perfisImportados,
} from './perfil.actions';
import { selectAtivoId, selectTodosPerfis } from './perfil.selectors';

@Injectable()
export class PerfilEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly storageService = inject(StorageService);
  private readonly idService = inject(IdService);

  carregarInicial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const salvo = this.storageService.carregar();
        if (!salvo || !salvo.perfis || !Object.keys(salvo.perfis).length) {
          const perfil = criarPerfilVazio(this.idService.gerar());
          return perfisCarregados({ perfis: [perfil], ativoId: perfil.id });
        }
        const perfis = Object.values(salvo.perfis).map((bruto) =>
          normalizarPerfil(bruto, () => this.idService.gerar())
        );
        const ativoId = perfis.some((p) => p.id === salvo.ativo) ? salvo.ativo : perfis[0].id;
        return perfisCarregados({ perfis, ativoId });
      })
    )
  );

  persistir$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          perfisCarregados,
          perfilCriado,
          perfilAtivoDefinido,
          perfilExcluido,
          perfilAtualizado,
          perfisImportados
        ),
        debounceTime(DEBOUNCE_SALVAR_MS),
        withLatestFrom(this.store.select(selectTodosPerfis), this.store.select(selectAtivoId)),
        tap(([, perfis, ativoId]) => {
          const perfisPorId = Object.fromEntries(perfis.map((perfil) => [perfil.id, perfil]));
          this.storageService.salvar({ ativo: ativoId, perfis: perfisPorId });
        })
      ),
    { dispatch: false }
  );
}
