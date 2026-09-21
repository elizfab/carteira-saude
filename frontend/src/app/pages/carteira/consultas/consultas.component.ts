import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, Consulta, ICONE_SECAO, criarConsultaVazia } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Consulta>[] = [
  { chave: 'data', rotulo: 'Data', tipo: 'data', larguraMin: 150 },
  { chave: 'especialidade', rotulo: 'Especialidade', larguraMin: 150 },
  { chave: 'medico', rotulo: 'Médico', larguraMin: 160 },
  { chave: 'diagnostico', rotulo: 'Diagnóstico', tipo: 'area', larguraMin: 190 },
  { chave: 'recomendacoes', rotulo: 'Recomendações', tipo: 'area', larguraMin: 210 },
  { chave: 'retorno', rotulo: 'Retorno', tipo: 'data', larguraMin: 150 },
];

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultasComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.consultas;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.consultas ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('consultas', criarConsultaVazia(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('consultas', indice);
  }

  alterar(evento: AlteracaoLinha<Consulta>): void {
    this.facade.atualizarLinha('consultas', evento.indice, evento.patch);
  }
}
