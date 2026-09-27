import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./live-region.module.css";

export type LiveRegionVariant = "hidden" | "badge" | "banner" | "hud";

/**
 * Class variance authority definitions for LiveRegion.
 * Standardized across W3C APG / Carbon UI live announcer benchmark.
 */
export const liveRegionVariants = cva(styles.region, {
  variants: {
    variant: {
      hidden: styles.srOnly,
      badge: styles.badge,
      banner: styles.banner,
      hud: styles.hud,
    },
    politeness: {
      polite: styles.polite,
      assertive: styles.assertive,
      off: "",
    },
  },
  defaultVariants: {
    variant: "hidden",
    politeness: "polite",
  },
});

export interface LiveRegionProps
  extends VariantProps<typeof liveRegionVariants> {
  children?: ReactNode;
  politeness?: "polite" | "assertive" | "off";
  role?: "status" | "alert" | "log";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all" | "additions text";
  visuallyHidden?: boolean;
  variant?: LiveRegionVariant;
  className?: string;
}

/**
 * `<LiveRegion>` — ARIA live region for announcing dynamic screen changes to assistive technologies.
 * Standardized with cva, data-slot, and W3C APG live region specifications.
 * @maturity stable
 */
export const LiveRegion = forwardRef<HTMLDivElement, LiveRegionProps>(
  (
    {
      children,
      politeness = "polite",
      role = politeness === "assertive" ? "alert" : "status",
      atomic = true,
      relevant = "additions text",
      visuallyHidden,
      variant,
      className = "",
    },
    ref,
  ) => {
    // Resolve active variant
    const effectiveVariant: LiveRegionVariant =
      variant ?? (visuallyHidden === false ? "banner" : "hidden");
    const isHidden = effectiveVariant === "hidden";

    const containerClasses = liveRegionVariants({
      variant: effectiveVariant,
      politeness,
      className,
    });

    return (
      <div
        ref={ref}
        role={role}
        aria-live={politeness}
        aria-atomic={atomic}
        aria-relevant={relevant}
        data-slot="live-region"
        data-variant={effectiveVariant}
        data-politeness={politeness}
        className={containerClasses}
      >
        {!isHidden && (
          <div data-slot="live-region-beacon" className={styles.beaconHeader}>
            <span className={styles.beacon}>
              <span className={styles.beaconPing} aria-hidden />
              <span className={styles.beaconDot} aria-hidden />
            </span>
            <span data-slot="live-region-politeness" className={styles.politenessTag}>
              {politeness.toUpperCase()}
            </span>
          </div>
        )}
        <div data-slot="live-region-content" className={styles.content}>
          {children}
        </div>
      </div>
    );
  },
);

LiveRegion.displayName = "LiveRegion";
