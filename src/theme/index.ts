"use client";

// @kannan19302/ui-theme — theme management for the UniERP Design System
export {
  ThemeProvider,
  useTheme,
  type ThemeProviderProps,
  type ThemeSetting,
  type BrandingTokens,
} from "./theme-provider";
export {
  validateTenantBrandContrast,
  getContrastRatio,
  type ContrastValidationResult,
} from "./branding";
export {
  THEMES,
  DEFAULT_THEME,
  type ThemeName,
  DENSITIES,
  DEFAULT_DENSITY,
  type DensityName,
} from "../tokens";
