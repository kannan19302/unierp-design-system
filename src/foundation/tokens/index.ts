/**
 * @kannan19302/ui/tokens — Canonical Strata Design Tokens metadata.
 * The tokens themselves ship as CSS (import '@kannan19302/ui/tokens/index.css').
 */

/**
 * Strata Workbench themes — the authoritative theme set for UniERP.
 */
export const STRATA_THEMES = [
  "strata",
  "strata-dark",
  "strata-high-contrast",
] as const;
export type StrataThemeName = (typeof STRATA_THEMES)[number];

/**
 * Active themes, including canonical Strata themes and backward-compatible alias names.
 */
export const THEMES = [
  "strata",
  "strata-dark",
  "strata-high-contrast",
  // Backward-compatible alias identifiers:
  "light",
  "dark",
  "high-contrast",
] as const;
export type ThemeName = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeName = "strata";

/** @deprecated Use STRATA_THEMES. */
export const DL2_THEMES = STRATA_THEMES;
export type DL2ThemeName = StrataThemeName;

/** @deprecated Use STRATA_THEMES. Legacy theme names emit runtime deprecation warnings. */
export const LEGACY_THEMES = [
  "light",
  "dark",
  "high-contrast",
  "enterprise",
  "modern",
  "minimal",
  "classic",
  "meridian",
  "meridian-dark",
] as const;
export type LegacyThemeName = (typeof LEGACY_THEMES)[number];

/**
 * Density is orthogonal to color theme — applies to any theme via [data-density].
 *
 * Strata establishes a 4-tier density scale:
 * - ultra-compact: 24px row for general ledger, financial journals, stock balances
 * - compact:       28px row for operational queues, triage, expert users
 * - standard:      32px row for balanced UniERP default experience
 * - comfortable:   40px row for onboarding, POS, touch, dashboards (44px touch target)
 */
export const DENSITIES = [
  "ultra-compact",
  "compact",
  "standard",
  "comfortable",
] as const;
export type DensityName = (typeof DENSITIES)[number];
export const DEFAULT_DENSITY: DensityName = "standard";

/** @deprecated Use DEFAULT_DENSITY. V1 density default for legacy callers. */
export const V1_DEFAULT_DENSITY: DensityName = "comfortable";

/**
 * UniERP platform identity system — each platform gets a semantic accent
 * applied via [data-platform] or [data-scope] on <html>.
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
  commandPalette: 450,
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
 * Strata surface depth model.
 */
export const SURFACES = {
  0: "var(--surface-0-bg)",
  1: "var(--surface-1-bg)",
  2: "var(--surface-2-bg)",
  3: "var(--surface-3-bg)",
  4: "var(--surface-4-bg)",
  sunken: "var(--surface-sunken-bg)",
} as const;
