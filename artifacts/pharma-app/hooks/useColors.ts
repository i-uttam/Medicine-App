import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import colors from '@/constants/colors';

type Palette = typeof colors.light;
type ColorSchemes = { light: Palette; dark?: Palette; radius: number };

/**
 * Returns design tokens for the active theme.
 * Reads isDark from ThemeContext (manual override + system fallback).
 * Falls back to light palette if ThemeProvider isn't mounted yet.
 */
export function useColors() {
  const ctx = useContext(ThemeContext);
  const isDark = ctx?.isDark ?? false;
  const themes = colors as ColorSchemes;
  const palette = isDark && themes.dark ? themes.dark : themes.light;
  return { ...palette, radius: colors.radius };
}
