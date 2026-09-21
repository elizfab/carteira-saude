import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  ColunaTabela,
  ConsultaEquipe,
  ESPECIALIDADES,
  EquipeSaude,
  ExameEquipe,
  ICONE_SECAO,
  criarConsultaEquipeVazia,
  criarExameEquipeVazio,
} from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { hojeISO } from '../../../shared/utils/date.util';
import { mascararTelefone } from '../../../shared/utils/mask.util';
import { proximaData as calcularProximaData } from '../../../shared/utils/proxima-data.util';
import {
  AlteracaoLinha,
  EditableTableComponent,
} from '../../../shared/components/editable-table/editable-table.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

export const COLUNAS_CONSULTAS: ColunaTabela<ConsultaEquipe>[] = [
  { chave: 'data', rotulo: 'Data da consulta', tipo: 'data', larguraMin: 150 },
  { chave: 'retorno', rotulo: 'Retorno previsto', tipo: 'data', larguraMin: 150 },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area', larguraMin: 240 },
];

export const COLUNAS_EXAMES: ColunaTabela<ExameEquipe>[] = [
  { chave: 'tipo', rotulo: 'Exame / prevenção', larguraMin: 200 },
  { chave: 'data', rotulo: 'Data', tipo: 'data', larguraMin: 150 },
  { chave: 'resultado', rotulo: 'Resultado', tipo: 'area', larguraMin: 180 },
  { chave: 'proximo', rotulo: 'Próximo exame', tipo: 'data', larguraMin: 150 },
];

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [NzButtonModule, NzCollapseModule, NzInputModule, EditableTableComponent, SectionHeaderComponent],
  templateUrl: './equipe.component.html',
  styleUrl: './equipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipeComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly idService = inject(IdService);
  private readonly modal = inject(NzModalService);

  readonly icone = ICONE_SECAO.equipe;
  readonly especialidadesSugeridas = ESPECIALIDADES;
  readonly colunasConsultas = COLUNAS_CONSULTAS;
  readonly colunasExames = COLUNAS_EXAMES;

  readonly equipe = computed(() => this.facade.perfilAtivo()?.equipe ?? []);
  readonly novaEspecialidade = signal('');
  readonly idsAbertos = signal<ReadonlySet<string>>(new Set());

  rotulo(item: EquipeSaude): string {
    return item.especialidade || 'Sem especialidade';
  }

  proximaData(item: EquipeSaude): string {
    return calcularProximaData(item, hojeISO());
  }

  estaAberto(id: string): boolean {
    return this.idsAbertos().has(id);
  }

  aoAlternarPainel(id: string, aberto: boolean): void {
    const atual = new Set(this.idsAbertos());
    aberto ? atual.add(id) : atual.delete(id);
    this.idsAbertos.set(atual);
  }

  adicionarEspecialista(): void {
    const valor = this.novaEspecialidade().trim();
    if (!valor) return;
    const criado = this.facade.adicionarEspecialista(valor);
    this.novaEspecialidade.set('');
    this.aoAlternarPainel(criado.id, true);
  }

  atualizarCampo(indice: number, campo: keyof EquipeSaude, valor: string): void {
    this.facade.atualizarEspecialista(indice, { [campo]: valor } as Partial<EquipeSaude>);
  }

  aoDigitarTelefone(indice: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const mascarado = mascararTelefone(input.value);
    input.value = mascarado;
    this.atualizarCampo(indice, 'telefone', mascarado);
  }

  removerEspecialista(indice: number, item: EquipeSaude): void {
    this.modal.confirm({
      nzTitle: 'Remover especialista',
      nzContent: `Remover "${this.rotulo(item)}" e todas as consultas e exames dele?`,
      nzOkText: 'Remover',
      nzOkDanger: true,
      nzOnOk: () => this.facade.removerEspecialista(indice),
    });
  }

  adicionarLinhaConsulta(indiceEquipe: number): void {
    this.facade.adicionarLinhaEquipe(indiceEquipe, 'consultas', criarConsultaEquipeVazia(this.idService.gerar()));
  }

  removerLinhaConsulta(indiceEquipe: number, indiceLinha: number): void {
    this.facade.removerLinhaEquipe(indiceEquipe, 'consultas', indiceLinha);
  }

  alterarLinhaConsulta(indiceEquipe: number, evento: AlteracaoLinha<ConsultaEquipe>): void {
    this.facade.atualizarLinhaEquipe(indiceEquipe, 'consultas', evento.indice, evento.patch);
  }

  adicionarLinhaExame(indiceEquipe: number): void {
    this.facade.adicionarLinhaEquipe(indiceEquipe, 'exames', criarExameEquipeVazio(this.idService.gerar()));
  }

  removerLinhaExame(indiceEquipe: number, indiceLinha: number): void {
    this.facade.removerLinhaEquipe(indiceEquipe, 'exames', indiceLinha);
  }

  alterarLinhaExame(indiceEquipe: number, evento: AlteracaoLinha<ExameEquipe>): void {
    this.facade.atualizarLinhaEquipe(indiceEquipe, 'exames', evento.indice, evento.patch);
  }
}
