import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [ReactiveFormsModule, NzInputModule, SectionHeaderComponent],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotasComponent {
  private readonly facade = inject(PerfilFacadeService);
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly form = this.formBuilder.group({ notas: [''] });

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.facade.perfilAtivo$.pipe(takeUntilDestroyed(destroyRef)).subscribe((perfil) => {
      if (perfil) {
        this.form.patchValue({ notas: perfil.notas }, { emitEvent: false });
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((valor) => {
      this.facade.atualizarNotas(valor.notas ?? '');
    });
  }
}
