/**
 * ══════════════════════════════════════════════════════════════
 * @kannan19302/ui/foundation — Core Foundation Architecture
 * ══════════════════════════════════════════════════════════════
 *
 * Consolidates all low-level design system infrastructure:
 * - Tokens (Strata design tokens, 4-tier density scale, type scale)
 * - Brand (Logo component & brand assets)
 * - Icons (Lucide-react icon system & sizing)
 * - Hooks (Responsive, debounced, persistent UI hooks)
 * - Utils (Class merger, SixStatesMatrix, currency & date formatters)
 * - Theme (ThemeProvider, ThemeScope, ThemeCustomizer, branding)
 */

export * from "./tokens";
export * from "./brand";
export * as Icons from "./icons";
export {
  ICON_DENSITY_SIZES,
  ICON_SIZE_SCALE,
  type IconScaleVariant,
  getIconSize,
  DEFAULT_ICON_STROKE_WIDTH,
  COMPACT_ICON_STROKE_WIDTH,
  getIconStrokeWidth,
  PLATFORM_ICON_NAMES,
  type LucideIcon,
  type LucideProps,
} from "./icons";
export * from "./hooks";
export * from "./utils";
export * from "./theme";

