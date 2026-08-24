"use client";

import { useId, type CSSProperties, type FC, type ReactNode } from "react";
import { ChevronRight, Star } from "lucide-react";
import { LoadingState, ErrorState, EmptyState, ForbiddenState } from "../components/six-states";
import styles from "./wizard-grid.module.css";

/**
 * `<PlatformWizardGrid>` and `<AppWizardGrid>` — deliberately two different
 * components, not one reused with a prop.
 *
 * The brief is explicit that the Global Platform Wizard and a tenant's
 * Application Wizard must stay "strictly separated": the platform wizard
 * lists P1–P10 and lives at the SSO landing page (:4000); the application
 * wizard lists a tenant's installed modules and lives inside tenant-apps
 * (/apps). Sharing one generic "grid of tiles" component would make it easy
 * for a future edit to blur that boundary by accident — passing the wrong
 * data source into a shared prop is a much smaller mistake than routing a
 * user to the wrong wizard. Distinct types make the two impossible to
 * accidentally interchange at a call site.
 */

export interface WizardTile {
  key: string;
  name: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  /** e.g. a "Locked — upgrade to Business" badge for an unentitled tile. */
  badge?: ReactNode;
  disabled?: boolean;
  /**
   * Accent for this tile, surfaced to CSS as the `--tile-accent` custom
   * property. A stylesheet cannot know a per-tile colour, so it arrives on the
   * element and wizard-grid.module.css reads it. Optional — a tile without one
   * falls back to `--color-primary` rather than looking broken.
   */
  accent?: string;
  /** Dark-theme counterpart (`--tile-accent-dark`); defaults to `accent`. A
   *  hue that clears 4.5:1 on a white card typically drops to ~2:1 on the dark
   *  theme's #1a1b2e surface, so the two cannot be the same value. */
  accentDark?: string;
  /** Personal launch preference only. It never changes entitlement or the
   * disabled state supplied by the caller's policy response. */
  favorite?: boolean;
  onFavoriteChange?: (favorite: boolean) => void;
  /** Called immediately before an enabled tile follows its href. Useful for
   * recording recency with a keepalive request; it must not gate navigation. */
  onLaunch?: () => void;
}

interface WizardGridBaseProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  tiles: WizardTile[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** True when the caller is authenticated but plainly holds nothing —
   * distinct from a transient empty result, so this renders ForbiddenState
   * instead of an empty-search-style EmptyState. */
  forbidden?: boolean;
  /**
   * How to render the loading state. `"skeleton"` lays out placeholder tiles so
   * the grid does not jump when data lands; `"spinner"` is the original
   * centred `LoadingState`. Either way a `role="status"` node is present, so
   * assistive technology hears the same thing.
   */
  loadingVariant?: "spinner" | "skeleton";
}

function WizardGridBase({
  loading,
  error,
  onRetry,
  tiles,
  emptyTitle = "Nothing available",
  emptyDescription = "There is nothing to show here yet.",
  forbidden,
  loadingVariant = "spinner",
  renderTile,
}: WizardGridBaseProps & { renderTile: (tile: WizardTile) => ReactNode }) {
  if (loading) {
    if (loadingVariant !== "skeleton") return <LoadingState message="Loading…" />;
    return (
      <div className={styles.grid} aria-busy="true">
        {/* The placeholders are decorative, so they are aria-hidden and the live
            status lives in a visually-hidden node instead. Screen-reader output
            is identical to the spinner variant; sighted users get a layout that
            does not reflow when the data arrives. */}
        <span role="status" aria-label="Loading" className="sr-only">
          Loading…
        </span>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }
  if (error) return <ErrorState description={error} onRetry={onRetry} />;
  if (forbidden) return <ForbiddenState />;
  if (tiles.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div role="list" className={styles.grid}>
      {tiles.map((tile) => (
        <div role="listitem" key={tile.key}>
          {renderTile(tile)}
        </div>
      ))}
    </div>
  );
}

function TileCard({ tile }: { tile: WizardTile }) {
  const descId = useId();

  // A stylesheet cannot know a per-tile colour, so the accent is handed to CSS
  // as a custom property on the element itself and read by the module.
  const accentStyle = tile.accent
    ? ({
        "--tile-accent": tile.accent,
        "--tile-accent-dark": tile.accentDark ?? tile.accent,
      } as CSSProperties)
    : undefined;

  const body = (
    <>
      <div className={styles.top}>
        {/* Rendered only when there IS an icon. The old markup emitted this well
            unconditionally, and because the wizard never passed an icon, every
            tile showed an empty grey square. */}
        {tile.icon && (
          <span className={styles.icon_well} aria-hidden="true">
            {tile.icon}
          </span>
        )}
        {tile.badge}
      </div>
      <div className={styles.text}>
        <span className={styles.name}>{tile.name}</span>
        {tile.description && (
          <span id={descId} className={styles.desc}>
            {tile.description}
          </span>
        )}
      </div>
      {!tile.disabled && <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />}
    </>
  );

  if (tile.disabled) {
    return (
      <div
        className={`${styles.tile} ${styles.disabled}`}
        style={accentStyle}
        aria-disabled="true"
        aria-label={`${tile.name} (not available)`}
      >
        {body}
      </div>
    );
  }

  return (
    <div className={styles.tile_frame} style={accentStyle}>
      <a
        href={tile.href}
        className={`${styles.tile} ${tile.onFavoriteChange ? styles.with_favorite : ""}`}
        onClick={tile.onLaunch}
        // The accessible name stays EXACTLY the platform name. Left to compute
        // itself, the link would be named by all its text — "Marketplace Discover
        // and install modules Locked" — which buries the destination and breaks
        // exact-name queries. The description is still announced, as a
        // description rather than as part of the name.
        aria-label={tile.name}
        aria-describedby={tile.description ? descId : undefined}
      >
        {body}
      </a>
      {tile.onFavoriteChange && (
        <button
          type="button"
          className={styles.favorite}
          aria-label={`${tile.favorite ? "Remove" : "Add"} ${tile.name} ${tile.favorite ? "from" : "to"} favorites`}
          aria-pressed={tile.favorite === true}
          onClick={() => tile.onFavoriteChange?.(!tile.favorite)}
        >
          <Star size={17} fill={tile.favorite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * The Global Platform Wizard's grid — one tile per platform the current
 * session is entitled to, sourced from `GET /auth/platforms`
 * (idp/src/modules/oidc/controllers/platforms.controller.ts). Never shows
 * tenant applications.
 */
export const PlatformWizardGrid: FC<WizardGridBaseProps> = (props) => (
  <WizardGridBase
    {...props}
    // The wizard is the first screen of a session and its tile count is known
    // in advance, so a skeleton grid reads better than a lone spinner.
    // AppWizardGrid keeps the spinner — its install count is not predictable.
    loadingVariant={props.loadingVariant ?? "skeleton"}
    emptyTitle={props.emptyTitle ?? "No platforms available"}
    emptyDescription={
      props.emptyDescription ??
      "Your account is not currently entitled to any UniERP platform."
    }
    renderTile={(tile) => <TileCard tile={tile} />}
  />
);

/**
 * The tenant Application Wizard's grid — one tile per module installed for
 * this tenant AND permitted for this user, sourced from `GET
 * /api/v1/saas/installed-apps`. Lives inside tenant-apps at /apps, never
 * shows other platforms.
 */
export const AppWizardGrid: FC<WizardGridBaseProps> = (props) => (
  <WizardGridBase
    {...props}
    emptyTitle={props.emptyTitle ?? "No applications installed"}
    emptyDescription={
      props.emptyDescription ??
      "Install applications from the Marketplace to get started."
    }
    renderTile={(tile) => <TileCard tile={tile} />}
  />
);
