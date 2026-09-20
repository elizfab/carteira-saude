import { Injectable, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectIsDarkMode } from '../state/theme.selectors';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.store
      .select(selectIsDarkMode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDarkMode) => {
        if (isDarkMode) {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        } else {
          document.body.classList.add('light');
          document.body.classList.remove('dark');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
