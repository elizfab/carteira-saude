import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, ICONE_SECAO, Vacina, criarVacinaVazia } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Vacina>[] = [
  { chave: 'nome', rotulo: 'Nome da vacina', larguraMin: 170 },
  { chave: 'dose', rotulo: 'Dose', larguraMin: 80 },
  { chave: 'data', rotulo: 'Data de aplicação', tipo: 'data', larguraMin: 150 },
  { chave: 'lote', rotulo: 'Lote', larguraMin: 100 },
  { chave: 'local', rotulo: 'Local de aplicação', larguraMin: 150 },
  { chave: 'reforco', rotulo: 'Próximo reforço', tipo: 'data', larguraMin: 150 },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 200 },
];

@Component({
  selector: 'app-vacinas',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './vacinas.component.html',
  styleUrl: './vacinas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacinasComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.vacinas;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.vacinas ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('vacinas', criarVacinaVazia(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('vacinas', indice);
  }

  alterar(evento: AlteracaoLinha<Vacina>): void {
    this.facade.atualizarLinha('vacinas', evento.indice, evento.patch);
  }
}
