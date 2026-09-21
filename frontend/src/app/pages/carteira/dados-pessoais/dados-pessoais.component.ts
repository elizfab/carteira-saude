import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { DadosPessoais, TipoSanguineo } from '../../../models';
import { CpfMaskDirective } from '../../../shared/directives/cpf-mask.directive';
import { PhoneMaskDirective } from '../../../shared/directives/phone-mask.directive';
import { PhotoUploadComponent } from '../../../shared/components/photo-upload/photo-upload.component';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

const TIPOS_SANGUINEOS: TipoSanguineo[] = ['A', 'B', 'AB', 'O'];

@Component({
  selector: 'app-dados-pessoais',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzRadioModule,
    CpfMaskDirective,
    PhoneMaskDirective,
    PhotoUploadComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './dados-pessoais.component.html',
  styleUrl: './dados-pessoais.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DadosPessoaisComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly tiposSanguineos = TIPOS_SANGUINEOS;

  readonly form = this.formBuilder.group({
    nome: [''],
    nascimento: [''],
    cpf: [''],
    abo: [''],
    rh: [''],
    telefone: [''],
    email: [''],
    endereco: [''],
    emerg_nome: [''],
    emerg_parentesco: [''],
    emerg_telefone: [''],
    convenio: [''],
    carteirinha: [''],
    obs: [''],
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.facade.perfilAtivo$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((perfil) => {
        if (perfil) {
          this.form.patchValue(perfil.dados, { emitEvent: false });
        }
      });

    this.form.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((valor) => {
      this.facade.atualizarDados(valor as Partial<DadosPessoais>);
    });
  }

  get fotoUrl(): string {
    return this.facade.perfilAtivo()?.dados.foto ?? '';
  }

  limparTipoSanguineo(): void {
    this.form.patchValue({ abo: '', rh: '' });
  }

  aoAlterarFoto(dataUrl: string): void {
    this.facade.atualizarDados({ foto: dataUrl });
  }

  removerFoto(): void {
    this.facade.atualizarDados({ foto: '' });
  }
}
