import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  Alergias,
  ConsultaEquipe,
  DadosPessoais,
  EquipeSaude,
  ExameEquipe,
  FamiliarItem,
  HistoricoFamiliar,
  OpcoesImpressao,
  Perfil,
  criarEquipeVazia,
  criarPerfilVazio,
} from '../../models';
import { IdService } from '../services/id.service';
import {
  perfilAtivoDefinido,
  perfilAtualizado,
  perfilCriado,
  perfilExcluido,
  perfisImportados,
  selectAtivoId,
  selectPerfilAtivo,
  selectTodosPerfis,
} from '../state/perfil';

export type SecaoTabelaSimples =
  | 'condicoes'
  | 'vacinas'
  | 'medicamentos'
  | 'exames'
  | 'consultas'
  | 'cirurgias'
  | 'controle';

export type SubSecaoEquipe = 'consultas' | 'exames';

function clonarPerfil(perfil: Perfil): Perfil {
  return JSON.parse(JSON.stringify(perfil)) as Perfil;
}

@Injectable({ providedIn: 'root' })
export class PerfilFacadeService {
  private readonly store = inject(Store);
  private readonly idService = inject(IdService);

  /**
   * Observable "cru" do perfil ativo (sem passar por `toSignal`/`toObservable`), para uso em
   * páginas que precisam sincronizar um FormGroup de forma síncrona ao assinar (ex.: repopular o
   * formulário ao trocar de perfil). `toObservable(signal)` não serve para isso: ele usa um
   * `effect()` internamente, cujo agendamento é assíncrono/em lote, então o valor não chega antes
   * do primeiro `detectChanges()` em testes (e chega com um tick de atraso em produção).
   */
  readonly perfilAtivo$ = this.store.select(selectPerfilAtivo);

  readonly perfilAtivo = toSignal(this.perfilAtivo$, { initialValue: undefined });
  readonly todosPerfis = toSignal(this.store.select(selectTodosPerfis), { initialValue: [] as Perfil[] });
  readonly ativoId = toSignal(this.store.select(selectAtivoId), { initialValue: '' });

  criarPerfil(nome: string): Perfil {
    const perfil = criarPerfilVazio(this.idService.gerar(), nome);
    this.store.dispatch(perfilCriado({ perfil }));
    return perfil;
  }

  definirAtivo(id: string): void {
    this.store.dispatch(perfilAtivoDefinido({ id }));
  }

  excluirPerfil(id: string): void {
    const restantes = this.todosPerfis().filter((perfil) => perfil.id !== id);
    this.store.dispatch(perfilExcluido({ id }));
    if (!restantes.length) {
      this.criarPerfil('');
    } else if (this.ativoId() === id) {
      this.definirAtivo(restantes[0].id);
    }
  }

  importarPerfis(perfis: Perfil[], ativoId: string): void {
    this.store.dispatch(perfisImportados({ perfis, ativoId }));
  }

  private atualizarPerfilAtivo(mutador: (perfil: Perfil) => Perfil): void {
    const atual = this.perfilAtivo();
    if (!atual) return;
    const atualizado = mutador(clonarPerfil(atual));
    this.store.dispatch(perfilAtualizado({ perfil: atualizado }));
  }

  atualizarDados(parcial: Partial<DadosPessoais>): void {
    this.atualizarPerfilAtivo((perfil) => ({ ...perfil, dados: { ...perfil.dados, ...parcial } }));
  }

  atualizarAlergias(parcial: Partial<Alergias>): void {
    this.atualizarPerfilAtivo((perfil) => ({ ...perfil, alergias: { ...perfil.alergias, ...parcial } }));
  }

  atualizarFamiliarItem(chave: keyof HistoricoFamiliar, patch: Partial<FamiliarItem>): void {
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      familiar: { ...perfil.familiar, [chave]: { ...perfil.familiar[chave], ...patch } },
    }));
  }

  atualizarNotas(notas: string): void {
    this.atualizarPerfilAtivo((perfil) => ({ ...perfil, notas }));
  }

  atualizarOpcoes(parcial: Partial<OpcoesImpressao>): void {
    this.atualizarPerfilAtivo((perfil) => ({ ...perfil, opcoes: { ...perfil.opcoes, ...parcial } }));
  }

  atualizarInclusaoSecao(secao: string, incluida: boolean): void {
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      opcoes: { ...perfil.opcoes, incluir: { ...perfil.opcoes.incluir, [secao]: incluida } },
    }));
  }

  atualizarPaginasMinimas(secao: keyof OpcoesImpressao['min'], valor: number): void {
    const clamp = Math.max(1, Math.min(8, Math.trunc(valor) || 1));
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      opcoes: { ...perfil.opcoes, min: { ...perfil.opcoes.min, [secao]: clamp } },
    }));
  }

  adicionarLinha<K extends SecaoTabelaSimples>(secao: K, linhaVazia: Perfil[K][number]): void {
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      [secao]: [...(perfil[secao] as unknown[]), linhaVazia],
    }));
  }

  removerLinha<K extends SecaoTabelaSimples>(secao: K, indice: number): void {
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      [secao]: (perfil[secao] as unknown[]).filter((_, i) => i !== indice),
    }));
  }

  atualizarLinha<K extends SecaoTabelaSimples>(
    secao: K,
    indice: number,
    patch: Partial<Perfil[K][number]>
  ): void {
    this.atualizarPerfilAtivo((perfil) => {
      const lista = [...(perfil[secao] as unknown as Array<Record<string, unknown>>)];
      lista[indice] = { ...lista[indice], ...patch };
      return { ...perfil, [secao]: lista };
    });
  }

  adicionarEspecialista(especialidade: string): EquipeSaude {
    const especialista = criarEquipeVazia(this.idService.gerar(), especialidade);
    this.atualizarPerfilAtivo((perfil) => ({ ...perfil, equipe: [...perfil.equipe, especialista] }));
    return especialista;
  }

  removerEspecialista(indice: number): void {
    this.atualizarPerfilAtivo((perfil) => ({
      ...perfil,
      equipe: perfil.equipe.filter((_, i) => i !== indice),
    }));
  }

  atualizarEspecialista(indice: number, patch: Partial<EquipeSaude>): void {
    this.atualizarPerfilAtivo((perfil) => {
      const equipe = [...perfil.equipe];
      equipe[indice] = { ...equipe[indice], ...patch };
      return { ...perfil, equipe };
    });
  }

  adicionarLinhaEquipe(
    indiceEquipe: number,
    subSecao: SubSecaoEquipe,
    linhaVazia: ConsultaEquipe | ExameEquipe
  ): void {
    this.atualizarPerfilAtivo((perfil) => {
      const equipe = [...perfil.equipe];
      const alvo = equipe[indiceEquipe];
      equipe[indiceEquipe] = { ...alvo, [subSecao]: [...alvo[subSecao], linhaVazia] } as EquipeSaude;
      return { ...perfil, equipe };
    });
  }

  removerLinhaEquipe(indiceEquipe: number, subSecao: SubSecaoEquipe, indiceLinha: number): void {
    this.atualizarPerfilAtivo((perfil) => {
      const equipe = [...perfil.equipe];
      const alvo = equipe[indiceEquipe];
      equipe[indiceEquipe] = {
        ...alvo,
        [subSecao]: alvo[subSecao].filter((_, i) => i !== indiceLinha),
      } as EquipeSaude;
      return { ...perfil, equipe };
    });
  }

  atualizarLinhaEquipe(
    indiceEquipe: number,
    subSecao: SubSecaoEquipe,
    indiceLinha: number,
    patch: Partial<ConsultaEquipe & ExameEquipe>
  ): void {
    this.atualizarPerfilAtivo((perfil) => {
      const equipe = [...perfil.equipe];
      const alvo = equipe[indiceEquipe];
      const lista = [...alvo[subSecao]] as unknown as Array<Record<string, unknown>>;
      lista[indiceLinha] = { ...lista[indiceLinha], ...patch };
      equipe[indiceEquipe] = { ...alvo, [subSecao]: lista } as EquipeSaude;
      return { ...perfil, equipe };
    });
  }
}
