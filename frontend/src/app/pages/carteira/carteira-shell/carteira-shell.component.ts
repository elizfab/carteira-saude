import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidenavComponent } from '../../../shared/components/app-sidenav/app-sidenav.component';
import { AppTopbarComponent } from '../../../shared/components/app-topbar/app-topbar.component';

@Component({
  selector: 'app-carteira-shell',
  standalone: true,
  imports: [RouterOutlet, AppSidenavComponent, AppTopbarComponent],
  templateUrl: './carteira-shell.component.html',
  styleUrl: './carteira-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarteiraShellComponent {}
