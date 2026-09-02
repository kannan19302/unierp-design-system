import type { DensityName } from "../tokens";

/**
 * ══════════════════════════════════════════════════════════════
 * UniERP Design Language 2.0 — Icon Language System
 * ══════════════════════════════════════════════════════════════
 *
 * Density-aware icon sizing and taxonomy for the UniERP ecosystem.
 * All icons render at consistent stroke weights (1.5px to 2px)
 * and adapt proportionally to the active workspace density.
 * ══════════════════════════════════════════════════════════════
 */

export const ICON_DENSITY_SIZES: Record<DensityName, number> = {
  comfortable: 20,
  standard: 18,
  compact: 16,
  "ultra-compact": 14,
};

export const ICON_SIZE_SCALE = {
  micro: 12,
  sm: 14,
  base: 18,
  lg: 20,
  xl: 24,
  hero: 32,
} as const;

export type IconScaleVariant = keyof typeof ICON_SIZE_SCALE;

/**
 * Returns the recommended icon pixel size for a given workspace density
 * and optional scale variant override.
 */
export function getIconSize(
  density: DensityName = "standard",
  variant?: IconScaleVariant,
): number {
  if (variant) {
    return ICON_SIZE_SCALE[variant];
  }
  return ICON_DENSITY_SIZES[density] ?? 18;
}

/**
 * Standard stroke width for all UI icons across the UniERP platform.
 * 1.75px provides the ideal optical clarity in dense data environments.
 */
export const DEFAULT_ICON_STROKE_WIDTH = 1.75;
export const COMPACT_ICON_STROKE_WIDTH = 1.5;

/**
 * Recommended stroke width based on density and size.
 */
export function getIconStrokeWidth(density: DensityName = "standard"): number {
  return density === "compact" ? COMPACT_ICON_STROKE_WIDTH : DEFAULT_ICON_STROKE_WIDTH;
}

/**
 * Platform Icon Semantic Identifiers.
 */
export const PLATFORM_ICON_NAMES = {
  developer: "Code2",
  apps: "AppWindow",
  "tenant-admin": "Building2",
  "platform-admin": "Sliders",
  ops: "Activity",
  marketing: "Megaphone",
  marketplace: "Store",
  website: "Globe",
} as const;
