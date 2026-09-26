import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, Condicao, ICONE_SECAO, criarCondicaoVazia } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Condicao>[] = [
  { chave: 'condicao', rotulo: 'Condição / diagnóstico', larguraMin: 180 },
  { chave: 'descoberta', rotulo: 'Data da descoberta', tipo: 'data', larguraMin: 150 },
  { chave: 'acomp', rotulo: 'Acompanhamento', larguraMin: 160 },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 240 },
];

@Component({
  selector: 'app-condicoes',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './condicoes.component.html',
  styleUrl: './condicoes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CondicoesComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.condicoes;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.condicoes ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('condicoes', criarCondicaoVazia(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('condicoes', indice);
  }

  alterar(evento: AlteracaoLinha<Condicao>): void {
    this.facade.atualizarLinha('condicoes', evento.indice, evento.patch);
  }
}
