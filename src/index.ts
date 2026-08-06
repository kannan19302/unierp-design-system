// NOT marked "use client".
//
// Marking this barrel a client module fixed the star-export problem but broke
// Next's client-reference registration for a CommonJS package —
// `TypeError: Cannot read properties of undefined (reading
// 'registerClientReference')` on every route. It appeared to work only while a
// warm .next cache survived; a clean build failed immediately.
//
// The individual component files carry "use client" themselves, which is where
// the directive belongs. Consumers that need a specific provider should import
// its subpath (@unerp/ui/theme, @unerp/ui/notifications) — a star re-export does
// not carry names across the RSC boundary, and the subpaths exist for exactly
// that reason.

export * from "./components";
export * from "./layout";
export * from "./charts";
export * from "./data-grid";
export * from "./dashboard";
export * from "./notifications";
export {
  ThemeProvider,
  useTheme,
  THEMES,
  DEFAULT_THEME,
  type ThemeName,
  type ThemeSetting,
  type ThemeProviderProps,
  type BrandingTokens,
  DENSITIES,
  DEFAULT_DENSITY,
  type DensityName,
} from "./theme";

// Website Builder Blocks (stay in the facade pre-v1)
export * from "./blocks";
