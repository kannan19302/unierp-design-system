"use client";

import { useMemo, useState, type FC, type ReactNode } from "react";
import styles from "./settings-shell.module.css";

/**
 * `<SettingsShell>` — anatomy 4 of the eleven in UI_UX_BRIEF §11.
 * Tenant Admin Console: ~70 setting tabs, visited rarely, always a form.
 *
 * ── Deliberately the inverse of anatomy 3 ──
 * The ERP is list → detail → inspector because a clerk lives inside it and
 * compares records all day. An administrator does none of that: they arrive
 * already knowing what to change ("turn on SAML", "extend retention"), change
 * it, and leave. So there is no dashboard, no KPI row, and no card grid — the
 * right pane is always a form, and the left is an index for finding one thing.
 *
 * ── Search is the primary path ──
 * Seventy tabs is an order of magnitude past Miller's Law and no grouping
 * rescues it: the admin knows the *word* and does not know which of nine
 * groups it was filed under. So items carry `keywords`, and the index searches
 * those as well as the label — searching only labels means "SAML" fails to find
 * a tab called "Single sign-on", which is the exact case that matters.
 *
 * ── The dirty footer belongs to the SHELL ──
 * Not to each of seventy pages. Its job is that leaving with unsaved changes
 * cannot happen by accident, and a guarantee implemented seventy times is a
 * guarantee that holds sixty-nine times.
 */

export interface SettingsItem {
  id: string;
  label: string;
  href: string;
  group?: string;
  /**
   * Additional terms this tab should be findable by — the vocabulary a user
   * brings rather than the one we chose. "Single sign-on" needs `saml`, `oidc`,
   * `sso`, or searching for what the admin actually typed returns nothing.
   */
  keywords?: string[];
}

export interface SettingsShellProps {
  items: SettingsItem[];
  activeId?: string;
  /** Rendered in the right pane. Always a form. */
  children?: ReactNode;
  /** Shows the dirty footer in its unsaved state. */
  dirty?: boolean;
  dirtyMessage?: string;
  onSave?: () => void;
  onDiscard?: () => void;
  saving?: boolean;
  /** Replaces the footer entirely when a page needs something else there. */
  footer?: ReactNode;
  searchLabel?: string;
  className?: string;
}

export const SettingsShell: FC<SettingsShellProps> = ({
  items,
  activeId,
  children,
  dirty = false,
  dirtyMessage = "You have unsaved changes.",
  onSave,
  onDiscard,
  saving = false,
  footer,
  searchLabel = "Search settings",
  className = "",
}) => {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.group?.toLowerCase().includes(q) ||
            i.keywords?.some((k) => k.toLowerCase().includes(q)),
        )
      : items;

    const byGroup = new Map<string, SettingsItem[]>();
    for (const item of matched) {
      const key = item.group ?? "";
      const list = byGroup.get(key);
      if (list) list.push(item);
      else byGroup.set(key, [item]);
    }
    return [...byGroup.entries()];
  }, [items, query]);

  const matchCount = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <nav className={styles.index} aria-label="Settings">
        <div className={styles.search_wrap}>
          <input
            type="search"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
          />
        </div>

        {matchCount === 0 ? (
          <p className={styles.empty} role="status">
            {`Nothing matches “${query}”. Try a shorter word.`}
          </p>
        ) : (
          <ul className={styles.groups}>
            {groups.map(([group, list]) => (
              <li key={group || "_"}>
                {group && <p className={styles.group_label}>{group}</p>}
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {list.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={`${styles.item} ${item.id === activeId ? styles.item_active : ""}`.trim()}
                        aria-current={item.id === activeId ? "page" : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className={styles.detail}>
        <div className={styles.pane}>
          <div className={styles.form}>{children}</div>
        </div>

        {footer ?? (
          <div
            className={`${styles.footer} ${dirty ? styles.footer_dirty : ""}`.trim()}
            data-dirty={dirty ? "true" : "false"}
          >
            <span className={styles.footer_msg}>
              {/* aria-live so the state change is announced, not only coloured.
                  Colour is never the sole carrier of meaning (§3.5). */}
              <span aria-live="polite">{dirty ? dirtyMessage : "All changes saved."}</span>
            </span>

            <span className={styles.footer_actions}>
              <button
                type="button"
                className={styles.btn}
                onClick={onDiscard}
                disabled={!dirty || saving}
              >
                Discard
              </button>
              {/* Order is always [Cancel] [Confirm] — §7. */}
              <button
                type="button"
                className={`${styles.btn} ${styles.btn_primary}`}
                onClick={onSave}
                disabled={!dirty || saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
