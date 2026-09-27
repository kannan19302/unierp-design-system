"use client";

// @kannan19302/ui-theme — theme management for the UniERP Design System
export {
  ThemeProvider,
  useTheme,
  useOptionalTheme,
  type ThemeProviderProps,
  type ThemeSetting,
  type BrandingTokens,
} from "./theme-provider";
export { ThemeQuickToggle, type ThemeQuickToggleProps } from "./theme-quick-toggle";
export { ThemeScope, type ThemeScopeProps } from "./theme-scope";
export {
  validateTenantBrandContrast,
  getContrastRatio,
  type ContrastValidationResult,
} from "./branding";
export {
  ThemeCustomizer,
  type ThemeCustomizerProps,
  type TenantThemeConfig,
} from "./theme-customizer";

export {
  THEMES,
  DEFAULT_THEME,
  type ThemeName,
  DENSITIES,
  DEFAULT_DENSITY,
  type DensityName,
  // DL 2.0 additions
  DL2_THEMES,
  type DL2ThemeName,
  LEGACY_THEMES,
  type LegacyThemeName,
  V1_DEFAULT_DENSITY,
  PLATFORMS,
  type PlatformName,
  SURFACES,
} from "../tokens";

