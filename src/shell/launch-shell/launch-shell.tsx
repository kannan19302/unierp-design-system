"use client";

import { useMemo, useState, type FC, type ReactNode } from "react";
import styles from "./launch-shell.module.css";

/**
 * `<LaunchShell>` — anatomy 1 of the eleven in UI_UX_BRIEF §11.
 *
 * Two variants, and the difference between them is the whole point:
 *
 * - `hero` — the **Global Platform Wizard** (:4000). Owns the viewport, no
 *   chrome at all, the only in-product screen permitted a hero. It lists
 *   PLATFORMS the session is entitled to.
 * - `shelf` — the **Application Wizard** (`/apps` inside tenant-apps). The same
 *   component bounded inside the tenant shell at a smaller scale. It lists
 *   MODULES installed for this tenant.
 *
 * The codebase already forbids interchanging the two — `wizard-grid.tsx` says
 * so in its header, and they were deliberately built as two components so the
 * boundary could not blur. This shell keeps that separation but moves it from
 * "two files" to "one component, two scales", because the thing that actually
 * stops a user confusing them is not the file layout, it is that one fills the
 * screen and the other sits in a page. `launch-shell.test.tsx` asserts the type
 * scale genuinely differs.
 *
 * ── Why no chrome ──
 * The session is fifteen seconds: arrive, choose, leave. A rail, a top bar and
 * a page header help someone who will be here for eight hours and are pure
 * obstruction for someone who will be here for fifteen. Type-to-filter is the
 * primary path for the same reason — ten plates is already past Miller's Law,
 * and a launcher whose fastest route is the mouse has misread its own job.
 */

export interface LaunchPlate {
  key: string;
  name: string;
  description?: string;
  href: string;
  /** Shown bottom-left in mono — the platform code, the module slug. */
  code?: string;
  /** The plate's top edge hue. An edge, never a filled tile. */
  accent?: string;
  disabled?: boolean;
  /** Why it cannot be opened. Shown in place of the description. */
  disabledReason?: string;
}

export interface LaunchShellProps {
  variant?: "hero" | "shelf";
  title: string;
  lede?: string;
  plates: LaunchPlate[];
  /** Adds the type-to-filter field. On by default for `hero`. */
  filterable?: boolean;
  filterLabel?: string;
  footer?: ReactNode;
  emptyMessage?: string;
  className?: string;
}

export const LaunchShell: FC<LaunchShellProps> = ({
  variant = "hero",
  title,
  lede,
  plates,
  filterable,
  filterLabel = "Filter",
  footer,
  emptyMessage = "Nothing here yet.",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const showFilter = filterable ?? variant === "hero";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plates;
    return plates.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [plates, query]);

  return (
    <div
      className={`${styles.root} ${variant === "shelf" ? styles.root_shelf : ""} ${className}`.trim()}
      data-launch-variant={variant}
    >
      <div className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}

        {showFilter && (
          <input
            type="search"
            className={styles.filter}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={filterLabel}
            aria-label={filterLabel}
          />
        )}
      </div>

      {visible.length === 0 ? (
        // A real message, never a bare "No results" — §7's empty-state rule.
        <p className={styles.foot} role="status">
          {query ? `Nothing matches “${query}”.` : emptyMessage}
        </p>
      ) : (
        <ul className={styles.field}>
          {visible.map((p) => {
            const body = (
              <>
                <p className={styles.plate_name}>{p.name}</p>
                {(p.disabled ? p.disabledReason : p.description) && (
                  <p className={styles.plate_desc}>
                    {p.disabled ? p.disabledReason : p.description}
                  </p>
                )}
                {p.code && <span className={styles.plate_code}>{p.code}</span>}
              </>
            );

            const style = p.accent
              ? ({ ["--plate-accent" as string]: p.accent } as Record<string, string>)
              : undefined;

            // Disabled renders as a non-interactive plate that still states its
            // reason — not a hidden one. Same rule as the Meridian bar's verb:
            // a platform you are not entitled to should be visible and
            // explained, or a user cannot tell entitlement from an outage.
            // A real <li> wrapping a real <a>. `role="listitem"` on the anchor
            // itself is not an allowed role for that element (axe:
            // aria-allowed-role) — and reaching for ARIA where semantics
            // already exist is what §8 means by "ARIA only where semantics
            // genuinely fall short".
            return (
              <li key={p.key} className={styles.cell}>
                {p.disabled ? (
                  <div aria-disabled="true" className={styles.plate} style={style}>
                    {body}
                  </div>
                ) : (
                  <a href={p.href} className={styles.plate} style={style}>
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {footer && <div className={styles.foot}>{footer}</div>}
    </div>
  );
};
