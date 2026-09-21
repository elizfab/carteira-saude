import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  MIN_PAGINAS_SECOES,
  NOMES_SECAO,
  ORDEM_SECOES,
  SecaoKey,
  SecaoPaginavelKey,
} from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { ImportExportService } from '../../../core/services/import-export.service';
import { hojeISO } from '../../../shared/utils/date.util';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-opcoes',
  standalone: true,
  imports: [FormsModule, NzButtonModule, NzCheckboxModule, NzInputNumberModule, SectionHeaderComponent],
  templateUrl: './opcoes.component.html',
  styleUrl: './opcoes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpcoesComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly importExportService = inject(ImportExportService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly secoes = ORDEM_SECOES;
  readonly nomesSecao = NOMES_SECAO;
  readonly secoesPaginaveis = MIN_PAGINAS_SECOES;

  readonly perfilAtivo = this.facade.perfilAtivo;

  incluida(chave: SecaoKey): boolean {
    return this.perfilAtivo()?.opcoes.incluir[chave] !== false;
  }

  aoAlterarInclusao(chave: SecaoKey, marcado: boolean): void {
    this.facade.atualizarInclusaoSecao(chave, marcado);
  }

  paginasMinimas(chave: SecaoPaginavelKey): number {
    return this.perfilAtivo()?.opcoes.min[chave] ?? 1;
  }

  aoAlterarPaginasMinimas(chave: SecaoPaginavelKey, valor: number): void {
    this.facade.atualizarPaginasMinimas(chave, valor);
  }

  baixarBackup(): void {
    const backup = this.importExportService.construirBackup(this.facade.todosPerfis());
    this.importExportService.baixarJSON(this.importExportService.nomeArquivoBackup(hojeISO()), backup);
    this.message.info('Backup baixado.');
  }

  previsualizarEImprimir(): void {
    this.router.navigate(['/preview']);
  }
}
