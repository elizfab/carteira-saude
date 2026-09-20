import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Store } from '@ngrx/store';
import { selectIsDarkMode } from '../../core/state/theme.selectors';
import { toggleTheme } from '../../core/state/theme.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzTypographyModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly store = inject(Store);
  readonly isDarkMode$ = this.store.select(selectIsDarkMode);

  toggle(): void {
    this.store.dispatch(toggleTheme());
  }
}
