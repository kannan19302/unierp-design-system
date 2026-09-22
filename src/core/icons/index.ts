/**
 * @kannan19302/ui-icons — the single icon API for the UniERP platform.
 * Re-exports the lucide icon set today; the indirection lets us swap or
 * extend the underlying set without touching consumers.
 */
export * from "lucide-react";
export type { LucideIcon, LucideProps } from "lucide-react";

export {
  ICON_DENSITY_SIZES,
  ICON_SIZE_SCALE,
  type IconScaleVariant,
  getIconSize,
  DEFAULT_ICON_STROKE_WIDTH,
  COMPACT_ICON_STROKE_WIDTH,
  getIconStrokeWidth,
  PLATFORM_ICON_NAMES,
} from "./icon-system";

