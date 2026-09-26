import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PerfilFacadeService } from '../../core/facades/perfil-facade.service';
import { PrintLayoutService } from '../../core/services/print-layout.service';
import { formatarDataBr } from '../../shared/utils/date.util';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly printLayoutService = inject(PrintLayoutService);

  readonly facade = inject(PerfilFacadeService);
  readonly perfil = this.facade.perfilAtivo;

  readonly paginas = computed(() => {
    const perfil = this.perfil();
    return perfil ? this.printLayoutService.construirPaginas(perfil) : [];
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params.get('auto') === 'print') {
        setTimeout(() => window.print(), 80);
      }
    });
  }

  formatarData(valor: string | undefined): string {
    return valor ? formatarDataBr(valor) : '';
  }

  valorCelula(linha: Record<string, string>, chave: string, tipo?: string): string {
    const bruto = linha[chave] ?? '';
    return tipo === 'data' ? this.formatarData(bruto) : bruto;
  }

  voltar(): void {
    this.router.navigate(['/carteira', 'dados']);
  }

  imprimir(): void {
    window.print();
  }
}
