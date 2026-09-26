import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, ControleMedicao, ICONE_SECAO, criarControleVazio } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<ControleMedicao>[] = [
  { chave: 'data', rotulo: 'Data', tipo: 'data', larguraMin: 150 },
  { chave: 'peso', rotulo: 'Peso (kg)', larguraMin: 90, centralizado: true },
  { chave: 'pressao', rotulo: 'Pressão arterial (mmHg)', larguraMin: 130, centralizado: true, placeholder: '120/80' },
  { chave: 'glicemia', rotulo: 'Glicemia (mg/dL)', larguraMin: 110, centralizado: true },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 220 },
];

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControleComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.controle;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.controle ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('controle', criarControleVazio(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('controle', indice);
  }

  alterar(evento: AlteracaoLinha<ControleMedicao>): void {
    this.facade.atualizarLinha('controle', evento.indice, evento.patch);
  }
}
