"use client";

// The barrel is a client module, deliberately.
//
// Almost everything it re-exports is a client component, and `export *` does not
// survive the React Server Components boundary: a star re-export of a client
// module loses its names, so the import arrives as `undefined` and React reports
// "Element type is invalid ... but got: undefined" — naming neither the module
// nor the symbol. ThemeProvider was fine only because the barrel re-exports it
// explicitly by name; ToastProvider, star-exported, was not.
//
// Marking the barrel itself a client module makes the star re-exports resolve.
// Consumers that want a server component should import the subpath directly
// (@unerp/ui/tokens, @unerp/ui/utils), which is what the § 7.2 subpath exports
// are for.

// ─────────────────────────────────────────────────
// @unerp/ui — the UniERP Design System, one package.
// The root barrel is the convenience surface; prefer a subpath so the
// consumer only pays for what it uses:
//   @unerp/ui/components, @unerp/ui/layout, @unerp/ui/charts,
//   @unerp/ui/data-grid, @unerp/ui/dashboard, @unerp/ui/notifications,
//   @unerp/ui/theme, @unerp/ui/tokens, @unerp/ui/hooks, @unerp/ui/utils,
//   @unerp/ui/icons, @unerp/ui/form-engine, @unerp/ui/workflow
// PLATFORM_ARCHITECTURE.md § 7.2 — the 13 @unerp/ui-* packages were merged
// here so the extraction in Phase 3 publishes one artifact, not fourteen.
// ─────────────────────────────────────────────────

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
