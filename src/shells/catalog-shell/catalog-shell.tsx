"use client";

import {
  forwardRef,
  type FC,
  type ReactNode,
  useState,
  useId,
} from "react";
import { Grid, List, X, Star, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { cva } from "../../foundation/utils/cva";
import styles from "./catalog-shell.module.css";

export interface CatalogFacetOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface CatalogFacet {
  id: string;
  legend: string;
  options: CatalogFacetOption[];
}

export interface ActiveCatalogFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

export interface CatalogShellProps {
  /** Optional hero section at top of storefront */
  hero?: {
    title: ReactNode;
    subtitle?: ReactNode;
    badge?: ReactNode;
  };
  /** Global search slot (e.g. search input with keyboard shortcut) */
  searchSlot?: ReactNode;
  /** Facet filter groups */
  facets?: CatalogFacet[];
  /** Collapsible facet sidebar state */
  facetsCollapsed?: boolean;
  onToggleFacets?: (collapsed: boolean) => void;
  /** e.g. "Showing 128 apps". Rendered in an aria-live region. */
  resultSummary?: ReactNode;
  /** Sort select slot or element */
  sortSlot?: ReactNode;
  /** Active view mode ("grid" | "list") */
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  /** Active filter chips shown above results */
  activeFilters?: ActiveCatalogFilter[];
  onClearAllFilters?: () => void;
  /** Additional custom toolbar slot */
  toolbar?: ReactNode;
  /** Loading state rendering skeleton placeholders */
  loading?: boolean;
  /** Empty state when no applications match */
  emptySlot?: ReactNode;
  /** Bottom pagination slot */
  paginationSlot?: ReactNode;
  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  children?: ReactNode;
}

export const catalogShellVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

/**
 * `<CatalogShell>` — Enterprise marketplace storefront and extension directory floorplan.
 * Catalog filters and result hierarchy follow the Backstage catalog pattern.
 * @maturity stable
 */
export const CatalogShell = forwardRef<HTMLDivElement, CatalogShellProps>(
  (
    {
      hero,
      searchSlot,
      facets,
      facetsCollapsed = false,
      onToggleFacets,
      resultSummary,
      sortSlot,
      viewMode: controlledViewMode,
      onViewModeChange,
      activeFilters,
      onClearAllFilters,
      toolbar,
      loading = false,
      emptySlot,
      paginationSlot,
      density = "standard",
      className = "",
      children,
    },
    ref
  ) => {
    const facetsId = useId();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [uncontrolledViewMode, setUncontrolledViewMode] = useState<
      "grid" | "list"
    >("grid");
    const activeView = controlledViewMode ?? uncontrolledViewMode;

    const setView = (mode: "grid" | "list") => {
      if (controlledViewMode === undefined) setUncontrolledViewMode(mode);
      onViewModeChange?.(mode);
    };

    const toggleMobileFilters = () => {
      const nextOpen = !mobileFiltersOpen;
      setMobileFiltersOpen(nextOpen);
      onToggleFacets?.(!nextOpen);
    };

    return (
      <div
        ref={ref}
        data-slot="catalog-shell"
        data-density={density}
        className={catalogShellVariants({ density, className })}
      >
        {/* Storefront Hero */}
        {hero && (
          <header data-slot="catalog-shell-hero" className={styles.hero}>
            {hero.badge && (
              <span className={styles.hero_badge}>{hero.badge}</span>
            )}
            <h1 className={styles.hero_title}>{hero.title}</h1>
            {hero.subtitle && (
              <p className={styles.hero_subtitle}>{hero.subtitle}</p>
            )}
            {searchSlot && (
              <div className={styles.hero_search}>{searchSlot}</div>
            )}
          </header>
        )}

        {/* Storefront Layout */}
        <div
          className={styles.root}
          data-facets-collapsed={facetsCollapsed}
          data-mobile-filters-open={mobileFiltersOpen}
        >
          {facets && facets.length > 0 && (
            <>
              <button
                type="button"
                className={styles.mobile_filter_toggle}
                onClick={toggleMobileFilters}
                aria-expanded={mobileFiltersOpen}
                aria-controls={facetsId}
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                {mobileFiltersOpen ? "Hide filters" : "Show filters"}
              </button>
              <aside
                id={facetsId}
                data-slot="catalog-shell-sidebar"
                className={styles.facet_region}
                aria-label="Catalog filters"
              >
              <div className={styles.facets}>
                {facets.map((facet) => (
                  <fieldset key={facet.id} className={styles.facet_group}>
                    <legend className={styles.facet_legend}>{facet.legend}</legend>
                    {facet.options.map((opt) => (
                      <label key={opt.id} className={styles.facet_option}>
                        <input
                          type="checkbox"
                          className={styles.facet_checkbox}
                          checked={opt.checked ?? false}
                          onChange={(e) => opt.onChange?.(e.target.checked)}
                        />
                        <span>{opt.label}</span>
                        {opt.count !== undefined && (
                          <span className={styles.facet_count}>
                            {opt.count}
                          </span>
                        )}
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
              </aside>
            </>
          )}

          <section
            data-slot="catalog-shell-results"
            className={styles.results}
            aria-label="Catalog results"
          >
            {(resultSummary ||
              toolbar ||
              sortSlot ||
              onViewModeChange ||
              activeFilters) && (
              <div data-slot="catalog-shell-toolbar" className={styles.results_head}>
                <div className={styles.results_controls}>
                  {resultSummary && (
                    <span className={styles.result_count} aria-live="polite">
                      {resultSummary}
                    </span>
                  )}

                  <div className={styles.toolbar_actions}>
                    {sortSlot}
                    {toolbar}

                    {/* View Mode Toggle Buttons */}
                    {onViewModeChange && <div
                      className={styles.view_toggle_group}
                      role="group"
                      aria-label="View layout mode"
                    >
                      <button
                        type="button"
                        className={styles.view_toggle_button}
                        data-active={activeView === "grid"}
                        onClick={() => setView("grid")}
                        aria-label="Grid view"
                        aria-pressed={activeView === "grid"}
                      >
                        <Grid size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className={styles.view_toggle_button}
                        data-active={activeView === "list"}
                        onClick={() => setView("list")}
                        aria-label="List view"
                        aria-pressed={activeView === "list"}
                      >
                        <List size={16} aria-hidden="true" />
                      </button>
                    </div>}
                  </div>
                </div>

                {/* Active Filter Chips */}
                {activeFilters && activeFilters.length > 0 && (
                  <div className={styles.active_filters} aria-label="Active filters">
                    {activeFilters.map((filter) => (
                      <span key={filter.id} className={styles.filter_chip}>
                        <span>{filter.label}</span>
                        <button
                          type="button"
                          className={styles.chip_dismiss}
                          onClick={filter.onRemove}
                          aria-label={`Remove filter ${filter.label}`}
                        >
                          <X size={12} aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                    {onClearAllFilters && (
                      <button
                        type="button"
                        className={styles.clear_all_button}
                        onClick={onClearAllFilters}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Results Content or States */}
            {loading ? (
              <div
                className={styles.gallery}
                data-view={activeView}
                aria-busy="true"
                aria-label="Loading catalog items"
              >
                <span role="status" aria-label="Loading catalog items" className={styles.visually_hidden}>Loading catalog items</span>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.skeleton_tile} aria-hidden="true" />
                ))}
              </div>
            ) : emptySlot ? (
              emptySlot
            ) : (
              children
            )}

            {paginationSlot && (
              <nav data-slot="catalog-shell-pagination" aria-label="Catalog pagination" className={styles.pagination}>
                {paginationSlot}
              </nav>
            )}
          </section>
        </div>
      </div>
    );
  }
);

CatalogShell.displayName = "CatalogShell";

export interface CatalogTile {
  id: string;
  name: string;
  publisher?: string;
  publisherVerified?: boolean;
  description?: string;
  href: string;
  icon?: ReactNode;
  /** Status chip — "Installed", "Update available". */
  status?: ReactNode;
  /** Badge chip — "Featured", "New", "Verified". */
  badge?: ReactNode;
  /** Semantic color variant for badge */
  badgeVariant?: "featured" | "popular" | "verified" | "enterprise" | "default";
  /** Star rating score and review count */
  rating?: {
    score: number;
    reviewsCount?: number;
  };
  /** Category or feature tags */
  tags?: string[];
  /** Pricing label, e.g. "Free", "From $29/mo" */
  pricing?: string;
  /** Highlight card if already installed */
  installed?: boolean;
  /** Action slot button (e.g. direct Install or Configure) */
  actionSlot?: ReactNode;
  onClick?: () => void;
}

export interface CatalogGalleryProps {
  tiles: CatalogTile[];
  viewMode?: "grid" | "list";
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export const CatalogGallery: FC<CatalogGalleryProps> = ({
  tiles,
  viewMode = "grid",
  loading = false,
  skeletonCount = 6,
  className = "",
}) => {
  if (loading) {
    return (
      <div role="status" aria-label="Loading catalog items">
        <ul className={`${styles.gallery} ${className}`.trim()} data-view={viewMode} aria-busy="true">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <li key={i} className={styles.skeleton_tile} aria-hidden="true" />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul
      className={`${styles.gallery} ${className}`.trim()}
      data-view={viewMode}
    >
      {tiles.map((t) => (
        <li key={t.id} className={styles.gallery_item}>
          <div className={styles.tile} data-installed={t.installed}>
            <a href={t.href} className={styles.tile_link} onClick={t.onClick}>
            {/* Top row with clean separation between brand head and optional badge */}
            <div className={styles.tile_top_row}>
              <span className={styles.tile_head}>
                <span className={styles.tile_icon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.tile_title_group}>
                  <span className={styles.tile_name}>{t.name}</span>
                  {t.publisher && (
                    <span className={styles.tile_publisher}>
                      <span>{t.publisher}</span>
                      {t.publisherVerified && (
                        <CheckCircle2
                          size={13}
                          className={styles.verified_icon}
                          aria-label="Verified publisher"
                        />
                      )}
                    </span>
                  )}
                </span>
              </span>

              {t.badge && (
                <span className={styles.tile_badge} data-variant={t.badgeVariant}>
                  {t.badge}
                </span>
              )}
            </div>

            {t.description && (
              <span className={styles.tile_desc}>{t.description}</span>
            )}

            {(t.rating || t.tags || t.pricing) && (
              <span className={styles.tile_meta}>
                {t.rating && (
                  <span className={styles.tile_rating}>
                    <Star size={13} fill="currentColor" aria-hidden="true" />
                    <span>{t.rating.score.toFixed(1)}</span>
                    {t.rating.reviewsCount !== undefined && (
                      <span className={styles.review_count}>
                        ({t.rating.reviewsCount})
                      </span>
                    )}
                  </span>
                )}
                {t.pricing && (
                  <span className={styles.tile_pricing}>{t.pricing}</span>
                )}
                {t.tags && t.tags.length > 0 && (
                  <span className={styles.tile_tags}>
                    {t.tags.map((tag) => (
                      <span key={tag} className={styles.tile_tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            )}

            </a>
            {(t.status || t.actionSlot) && (
              <div className={styles.tile_foot}>
                {typeof t.status === "string" ? (
                  <span className={styles.tile_status}>
                    <span>{t.status}</span>
                  </span>
                ) : (
                  <span>{t.status}</span>
                )}
                {t.actionSlot && (
                  <div className={styles.action_slot}>
                    {t.actionSlot}
                  </div>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export interface CatalogPermission {
  /** The machine scope — shown, but second. */
  scope: string;
  /** What it lets the app actually do, in the admin's words. */
  description: string;
}

export interface CatalogListingProps {
  /** Screenshots, long description, whatever the listing leads with. */
  children?: ReactNode;
  permissions?: CatalogPermission[];
  changelog?: ReactNode;
  /** The install CTA and its surrounding facts. */
  aside?: ReactNode;
  className?: string;
}

export const CatalogListing: FC<CatalogListingProps> = ({
  children,
  permissions,
  changelog,
  aside,
  className = "",
}) => (
  <div className={`${styles.listing} ${className}`.trim()}>
    <div>
      {children}

      {permissions && permissions.length > 0 && (
        <>
          <h2 className={styles.section_title}>What this app can access</h2>
          <ul className={styles.permissions}>
            {permissions.map((p) => (
              <li key={p.scope} className={styles.permission}>
                {/* Description FIRST. A scope string is not informed consent. */}
                <span>{p.description}</span>
                <code className={styles.permission_scope}>{p.scope}</code>
              </li>
            ))}
          </ul>
        </>
      )}

      {changelog && (
        <>
          <h2 className={styles.section_title}>Changelog</h2>
          {changelog}
        </>
      )}
    </div>

    {aside && <aside className={styles.listing_aside}>{aside}</aside>}
  </div>
);
