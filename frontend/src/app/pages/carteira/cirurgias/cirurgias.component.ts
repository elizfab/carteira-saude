import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Cirurgia, ColunaTabela, ICONE_SECAO, criarCirurgiaVazia } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Cirurgia>[] = [
  { chave: 'data', rotulo: 'Data', tipo: 'data', larguraMin: 150 },
  { chave: 'procedimento', rotulo: 'Procedimento', larguraMin: 200 },
  { chave: 'hospital', rotulo: 'Hospital', larguraMin: 180 },
  { chave: 'medico', rotulo: 'Médico responsável', larguraMin: 170 },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 200 },
];

@Component({
  selector: 'app-cirurgias',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './cirurgias.component.html',
  styleUrl: './cirurgias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirurgiasComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.cirurgias;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.cirurgias ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('cirurgias', criarCirurgiaVazia(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('cirurgias', indice);
  }

  alterar(evento: AlteracaoLinha<Cirurgia>): void {
    this.facade.atualizarLinha('cirurgias', evento.indice, evento.patch);
  }
}
