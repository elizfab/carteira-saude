import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, ICONE_SECAO, Medicamento, criarMedicamentoVazio } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Medicamento>[] = [
  { chave: 'nome', rotulo: 'Nome do medicamento', larguraMin: 190 },
  { chave: 'dosagem', rotulo: 'Dosagem', larguraMin: 110 },
  { chave: 'inicio', rotulo: 'Início do tratamento', tipo: 'data', larguraMin: 150 },
  { chave: 'termino', rotulo: 'Término', larguraMin: 130, placeholder: 'Data ou “Em uso”' },
  { chave: 'medico', rotulo: 'Médico responsável', larguraMin: 170 },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 200 },
];

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicamentosComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.medicamentos;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.medicamentos ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('medicamentos', criarMedicamentoVazio(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('medicamentos', indice);
  }

  alterar(evento: AlteracaoLinha<Medicamento>): void {
    this.facade.atualizarLinha('medicamentos', evento.indice, evento.patch);
  }
}
