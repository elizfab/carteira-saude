import { createReducer, on } from '@ngrx/store';
import { toggleTheme } from './theme.actions';

export interface ThemeState {
  isDarkMode: boolean;
}

export const initialThemeState: ThemeState = {
  isDarkMode: false,
};

export const themeReducer = createReducer(
  initialThemeState,
  on(toggleTheme, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  }))
);
