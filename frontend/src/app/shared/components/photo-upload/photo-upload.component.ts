import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PhotoService } from '../../../core/services/photo.service';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './photo-upload.component.html',
  styleUrl: './photo-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadComponent {
  private readonly photoService = inject(PhotoService);
  private readonly message = inject(NzMessageService);

  private readonly inputArquivo = viewChild<ElementRef<HTMLInputElement>>('inputArquivo');

  readonly fotoUrl = input<string>('');

  readonly fotoAlterada = output<string>();
  readonly fotoRemovida = output<void>();

  abrirSeletor(): void {
    this.inputArquivo()?.nativeElement.click();
  }

  async aoEscolherArquivo(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) return;

    try {
      const dataUrl = await this.photoService.processarArquivo(arquivo);
      this.fotoAlterada.emit(dataUrl);
    } catch {
      this.message.error('Não foi possível ler essa imagem.');
    }
  }

  remover(): void {
    this.fotoRemovida.emit();
  }
}
