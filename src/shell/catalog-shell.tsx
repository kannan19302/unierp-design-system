"use client";

import { type FC, type ReactNode } from "react";
import styles from "./catalog-shell.module.css";

/**
 * `<CatalogShell>` / `<CatalogListing>` — anatomy 7 of the eleven in §11.
 * Marketplace: browsing, comparing, installing.
 *
 * ── Why a storefront and not a list page ──
 * Every other in-product list exists to let someone *find a record they already
 * know about*. A catalogue exists to let someone *decide about something they
 * have never seen*. Those need opposite densities: the ledger wants forty rows
 * on screen, the catalogue wants enough room for a name, a publisher, a
 * sentence and a picture — because a buyer picks software partly on how it
 * looks, and a dense table of software is a table nobody browses.
 *
 * So this anatomy has the widest gutters and the largest imagery in the
 * product, and its detail view is built like a product page rather than a
 * record page.
 *
 * ── The permissions manifest ──
 * `CatalogListing` takes permissions as {scope, description} pairs and shows
 * the DESCRIPTION first. `connectors.write` tells an admin nothing about what
 * an app will do to their data; "Create and update connector credentials"
 * does. An install prompt that shows only scope strings is asking for consent
 * without giving information, which is the pattern this platform's own
 * OAuth surfaces are held to (§8, and APP_FLOW's consent rules).
 */

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

export interface CatalogShellProps {
  facets?: CatalogFacet[];
  /** e.g. "128 apps". Rendered as-is so the caller controls pluralisation. */
  resultSummary?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const CatalogShell: FC<CatalogShellProps> = ({
  facets,
  resultSummary,
  toolbar,
  className = "",
  children,
}) => (
  <div className={`${styles.root} ${className}`.trim()}>
    {facets && facets.length > 0 && (
      <form className={styles.facets} aria-label="Filters">
        {facets.map((facet) => (
          // A real <fieldset>/<legend>: a group of checkboxes without one is a
          // pile of unrelated controls to a screen reader.
          <fieldset key={facet.id} className={styles.facet_group}>
            <legend className={styles.facet_legend}>{facet.legend}</legend>
            {facet.options.map((opt) => (
              <label key={opt.id} className={styles.facet_option}>
                <input
                  type="checkbox"
                  checked={opt.checked ?? false}
                  onChange={(e) => opt.onChange?.(e.target.checked)}
                />
                <span>{opt.label}</span>
                {opt.count !== undefined && (
                  <span className={styles.facet_count}>{opt.count}</span>
                )}
              </label>
            ))}
          </fieldset>
        ))}
      </form>
    )}

    <div className={styles.results}>
      {(resultSummary || toolbar) && (
        <div className={styles.results_head}>
          <span className={styles.result_count} aria-live="polite">
            {resultSummary}
          </span>
          {toolbar}
        </div>
      )}
      {children}
    </div>
  </div>
);

export interface CatalogTile {
  id: string;
  name: string;
  publisher?: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  /** Status chip — "Installed", "Update available". */
  status?: ReactNode;
}

export const CatalogGallery: FC<{ tiles: CatalogTile[]; className?: string }> = ({
  tiles,
  className = "",
}) => (
  <ul className={`${styles.gallery} ${className}`.trim()}>
    {tiles.map((t) => (
      <li key={t.id} style={{ display: "flex" }}>
        <a href={t.href} className={styles.tile}>
          <span className={styles.tile_head}>
            <span className={styles.tile_icon} aria-hidden="true">
              {t.icon}
            </span>
            <span>
              <span className={styles.tile_name} style={{ display: "block" }}>
                {t.name}
              </span>
              {t.publisher && (
                <span className={styles.tile_publisher} style={{ display: "block" }}>
                  {t.publisher}
                </span>
              )}
            </span>
          </span>
          {t.description && <span className={styles.tile_desc}>{t.description}</span>}
          {t.status && <span className={styles.tile_foot}>{t.status}</span>}
        </a>
      </li>
    ))}
  </ul>
);

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
