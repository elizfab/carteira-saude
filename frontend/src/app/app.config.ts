import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { pt_BR } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { themeReducer } from './core/state/theme.reducer';
import { PerfilEffects, perfilReducer } from './core/state/perfil';
import { ICONES_APP } from './core/config/nz-icons.config';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNzI18n(pt_BR),
    provideNzIcons(ICONES_APP),
    provideStore({ theme: themeReducer, perfil: perfilReducer }),
    provideEffects([PerfilEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
