import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [NzIconModule, NzTypographyModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  readonly icone = input.required<string>();
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>('');
}
