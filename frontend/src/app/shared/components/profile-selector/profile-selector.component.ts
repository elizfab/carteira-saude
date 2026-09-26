import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Perfil } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';

@Component({
  selector: 'app-profile-selector',
  standalone: true,
  imports: [FormsModule, NzButtonModule, NzInputModule, NzModalModule, NzSelectModule],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSelectorComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly modal = inject(NzModalService);

  readonly perfis = this.facade.todosPerfis;
  readonly ativoId = this.facade.ativoId;

  readonly modalNovoVisivel = signal(false);
  readonly nomeNovoPerfil = signal('');

  rotuloPerfil(perfil: Perfil): string {
    return perfil.dados.nome || 'Perfil sem nome';
  }

  trocarPerfil(id: string): void {
    this.facade.definirAtivo(id);
  }

  abrirNovoPerfil(): void {
    this.nomeNovoPerfil.set('');
    this.modalNovoVisivel.set(true);
  }

  cancelarNovoPerfil(): void {
    this.modalNovoVisivel.set(false);
  }

  confirmarNovoPerfil(): void {
    const nome = this.nomeNovoPerfil().trim();
    if (!nome) return;
    this.facade.criarPerfil(nome);
    this.modalNovoVisivel.set(false);
  }

  excluirPerfilAtivo(): void {
    const atual = this.facade.perfilAtivo();
    if (!atual) return;
    const nomeExibicao = this.rotuloPerfil(atual);
    this.modal.confirm({
      nzTitle: 'Excluir perfil',
      nzContent: `Excluir o perfil "${nomeExibicao}"? Isso não pode ser desfeito. Exporte os dados antes se quiser guardar uma cópia.`,
      nzOkText: 'Excluir',
      nzOkDanger: true,
      nzOnOk: () => this.facade.excluirPerfil(atual.id),
    });
  }
}
