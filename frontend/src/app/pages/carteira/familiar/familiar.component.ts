import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CATEGORIAS_FAMILIAR, FamiliarItem, HistoricoFamiliar } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

type ChaveFamiliar = keyof HistoricoFamiliar;

@Component({
  selector: 'app-familiar',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzInputModule, NzRadioModule, SectionHeaderComponent],
  templateUrl: './familiar.component.html',
  styleUrl: './familiar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamiliarComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly categorias = CATEGORIAS_FAMILIAR;

  readonly form = this.formBuilder.group({
    diabetes: this.formBuilder.group({ r: [''], t: [''] }),
    hipertensao: this.formBuilder.group({ r: [''], t: [''] }),
    cardiacas: this.formBuilder.group({ r: [''], t: [''] }),
    cancer: this.formBuilder.group({ r: [''], t: [''] }),
    outras: this.formBuilder.group({ r: [''], t: [''] }),
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.facade.perfilAtivo$.pipe(takeUntilDestroyed(destroyRef)).subscribe((perfil) => {
      if (perfil) {
        this.form.patchValue(perfil.familiar, { emitEvent: false });
      }
    });

    for (const categoria of this.categorias) {
      const chave = categoria.chave as ChaveFamiliar;
      this.form
        .get(chave)!
        .valueChanges.pipe(takeUntilDestroyed(destroyRef))
        .subscribe((valor) => this.facade.atualizarFamiliarItem(chave, valor as Partial<FamiliarItem>));
    }
  }

  limpar(chave: string): void {
    this.form.get(chave)?.get('r')?.setValue('');
  }
}
