import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ITENS_NAVEGACAO } from '../../../models';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [NzIconModule, NzMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './app-sidenav.component.html',
  styleUrl: './app-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidenavComponent {
  readonly itens = ITENS_NAVEGACAO;
}
