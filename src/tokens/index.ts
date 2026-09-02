/**
 * @kannan19302/ui-tokens — design-token metadata.
 * The tokens themselves ship as CSS (import '@kannan19302/ui-tokens/css').
 *
 * Design Language 2.0 additions:
 * - `DENSITIES` now includes "standard" as the middle tier
 * - `PLATFORMS` defines the UniERP platform identity system
 * - `DL2_THEMES` is the recommended theme subset for DL 2.0
 * - Legacy themes are deprecated and will be removed in the next major
 */
export const THEMES = [
  "strata",
  "strata-dark",
  "strata-high-contrast",
  "meridian",
  "meridian-dark",
  "high-contrast",
  "enterprise",
  "modern",
  "minimal",
  "classic",
  "dark",
  "light",
] as const;
export type ThemeName = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeName = "strata";

/**
 * Strata Workbench themes — the primary authoritative theme set for UniERP.
 */
export const STRATA_THEMES = [
  "strata",
  "strata-dark",
  "strata-high-contrast",
] as const;
export type StrataThemeName = (typeof STRATA_THEMES)[number];

/**
 * DL 2.0 recommended themes — including Strata and backward-compatible Meridian.
 */
export const DL2_THEMES = [
  "strata",
  "strata-dark",
  "strata-high-contrast",
  "meridian",
  "meridian-dark",
  "high-contrast",
] as const;
export type DL2ThemeName = (typeof DL2_THEMES)[number];

/** @deprecated Use STRATA_THEMES or DL2_THEMES. */
export const LEGACY_THEMES = [
  "enterprise",
  "modern",
  "minimal",
  "classic",
  "dark",
  "light",
] as const;
export type LegacyThemeName = (typeof LEGACY_THEMES)[number];

/**
 * Density is orthogonal to color theme — applies to any theme via [data-density].
 *
 * Strata establishes a 4-tier density scale:
 * - ultra-compact: 24px row for general ledger, financial journals, stock balances
 * - compact:       28px row for operational queues, triage, expert users
 * - standard:      32px row for balanced UniERP default experience
 * - comfortable:   40px row for onboarding, POS, touch, dashboards
 */
export const DENSITIES = ["comfortable", "standard", "compact", "ultra-compact"] as const;
export type DensityName = (typeof DENSITIES)[number];
export const DEFAULT_DENSITY: DensityName = "standard";

/**
 * V1 density default, for consumers that have not yet migrated to DL 2.0.
 * Set `defaultDensity="comfortable"` in ThemeProvider to preserve V1 behavior.
 */
export const V1_DEFAULT_DENSITY: DensityName = "comfortable";

/**
 * UniERP platform identity system — each platform gets a semantic accent
 * applied via [data-platform] on <html>. Platform accents communicate
 * "where you are" (identity), not "what you can do" (interactive affordance).
 */
export const PLATFORMS = [
  "developer",
  "apps",
  "tenant-admin",
  "platform-admin",
  "ops",
  "marketing",
  "marketplace",
  "website",
] as const;
export type PlatformName = (typeof PLATFORMS)[number];

export const CHART_TOKENS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--chart-6",
  "--chart-7",
  "--chart-8",
  "--chart-9",
  "--chart-10",
] as const;

export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  /** DL 2.0: Command palette sits above popovers. */
  commandPalette: 450,
  /** DL 2.0: Context rail is a panel, not an overlay. */
  contextRail: 75,
} as const;

export const ELEVATIONS = {
  1: "var(--elevation-1)",
  2: "var(--elevation-2)",
  3: "var(--elevation-3)",
  4: "var(--elevation-4)",
  5: "var(--elevation-5)",
  hover: "var(--elevation-hover)",
} as const;

/**
 * DL 2.0 surface depth model.
 * Components should use these instead of raw --color-bg-* tokens.
 */
export const SURFACES = {
  0: "var(--surface-0-bg)",
  1: "var(--surface-1-bg)",
  2: "var(--surface-2-bg)",
  3: "var(--surface-3-bg)",
  4: "var(--surface-4-bg)",
  sunken: "var(--surface-sunken-bg)",
} as const;
