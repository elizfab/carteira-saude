import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ColunaTabela, Exame, ICONE_SECAO, criarExameVazio } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS: ColunaTabela<Exame>[] = [
  { chave: 'data', rotulo: 'Data', tipo: 'data', larguraMin: 150 },
  { chave: 'tipo', rotulo: 'Tipo de exame', larguraMin: 180 },
  { chave: 'resultado', rotulo: 'Resultado principal', tipo: 'area', larguraMin: 240 },
  { chave: 'medico', rotulo: 'Médico solicitante', larguraMin: 170 },
  { chave: 'proximo', rotulo: 'Próximo exame', tipo: 'data', larguraMin: 150 },
];

@Component({
  selector: 'app-exames',
  standalone: true,
  imports: [EditableTableComponent, SectionHeaderComponent],
  templateUrl: './exames.component.html',
  styleUrl: './exames.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamesComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);

  readonly icone = ICONE_SECAO.exames;
  readonly colunas = COLUNAS;
  readonly linhas = computed(() => this.facade.perfilAtivo()?.exames ?? []);

  adicionar(): void {
    this.facade.adicionarLinha('exames', criarExameVazio(this.idService.gerar()));
  }

  remover(indice: number): void {
    this.facade.removerLinha('exames', indice);
  }

  alterar(evento: AlteracaoLinha<Exame>): void {
    this.facade.atualizarLinha('exames', evento.indice, evento.patch);
  }
}
