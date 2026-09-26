import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CATEGORIAS_ALERGIA } from '../../../models';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-alergias',
  standalone: true,
  imports: [ReactiveFormsModule, NzInputModule, SectionHeaderComponent],
  templateUrl: './alergias.component.html',
  styleUrl: './alergias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlergiasComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly categorias = CATEGORIAS_ALERGIA;

  readonly form = this.formBuilder.group({
    medicamentos: [''],
    alimentos: [''],
    materiais: [''],
    outras: [''],
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.facade.perfilAtivo$.pipe(takeUntilDestroyed(destroyRef)).subscribe((perfil) => {
      if (perfil) {
        this.form.patchValue(perfil.alergias, { emitEvent: false });
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((valor) => {
      this.facade.atualizarAlergias(valor);
    });
  }
}
