import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ColunaTabela } from '../../../models';

export interface AlteracaoLinha<T> {
  indice: number;
  patch: Partial<T>;
}

/**
 * Tabela genérica config-driven: reusada por todas as seções de "várias linhas" (condições,
 * vacinas, medicamentos, exames, consultas, cirurgias, controle e as sub-tabelas de equipe).
 * Ver sdd/00-arquitetura.md.
 */
@Component({
  selector: 'app-editable-table',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzInputModule],
  templateUrl: './editable-table.component.html',
  styleUrl: './editable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTableComponent<T extends { id: string }> {
  readonly colunas = input.required<ColunaTabela<T>[]>();
  readonly linhas = input.required<T[]>();
  readonly rotuloAdicionar = input<string>('Adicionar linha');

  readonly adicionar = output<void>();
  readonly remover = output<number>();
  readonly alterar = output<AlteracaoLinha<T>>();

  valor(linha: T, coluna: ColunaTabela<T>): string {
    const bruto = linha[coluna.chave];
    return bruto === undefined || bruto === null ? '' : String(bruto);
  }

  aoAlterar(indice: number, coluna: ColunaTabela<T>, valor: string): void {
    this.alterar.emit({ indice, patch: { [coluna.chave]: valor } as Partial<T> });
  }
}
