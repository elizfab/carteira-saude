import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImportExportService } from '../../../core/services/import-export.service';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { selectIsDarkMode, toggleTheme } from '../../../core/state';
import { ProfileSelectorComponent } from '../profile-selector/profile-selector.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, ProfileSelectorComponent],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbarComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly facade = inject(PerfilFacadeService);
  private readonly importExportService = inject(ImportExportService);
  private readonly message = inject(NzMessageService);

  private readonly inputImportar = viewChild<ElementRef<HTMLInputElement>>('inputImportar');

  readonly isDarkMode = toSignal(this.store.select(selectIsDarkMode), { initialValue: true });

  alternarTema(): void {
    this.store.dispatch(toggleTheme());
  }

  abrirSeletorImportar(): void {
    this.inputImportar()?.nativeElement.click();
  }

  async importar(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) return;

    try {
      const json = JSON.parse(await arquivo.text());
      const perfis = this.importExportService.extrairPerfis(json);
      if (!perfis) throw new Error('formato inválido');

      const ultimo = perfis[perfis.length - 1];
      this.facade.importarPerfis(perfis, ultimo.id);
      this.router.navigate(['/carteira', 'dados']);
      this.message.success(
        perfis.length === 1 ? 'Perfil importado.' : `${perfis.length} perfis importados.`
      );
    } catch {
      this.message.error('Esse arquivo não parece ser dados da carteira (.json).');
    }
  }

  exportar(): void {
    const perfil = this.facade.perfilAtivo();
    if (!perfil) return;
    const backup = this.importExportService.construirBackup([perfil]);
    this.importExportService.baixarJSON(this.importExportService.nomeArquivoExportacao(perfil.dados.nome), backup);
    this.message.info('Arquivo baixado. Guarde em um lugar seguro: ele contém dados de saúde.');
  }

  previsualizar(): void {
    this.router.navigate(['/preview']);
  }

  imprimir(): void {
    this.router.navigate(['/preview'], { queryParams: { auto: 'print' } });
  }
}
