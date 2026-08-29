"use client";

import { type FC, type ReactNode } from "react";
import styles from "./record-shell.module.css";

/**
 * `<RecordShell>` — anatomy 3 of the eleven in UI_UX_BRIEF §11.
 * Tenant Applications: the ERP itself, the surface a clerk is inside for eight
 * hours a day.
 *
 * ── The flexible column layout ──
 * list → detail → inspector, sliding, never losing context. Taken from Fiori
 * (§13.3), which is still the best answer in enterprise software to "show me
 * this thing without throwing away where I was". The alternative every ERP
 * eventually regrets is a full-page navigation per record, which makes
 * comparing two invoices a back-button exercise.
 *
 * Three details that are load-bearing rather than cosmetic:
 *
 * 1. **Each column scrolls independently.** One page scrollbar for three
 *    columns means scrolling a long record also scrolls the list you chose it
 *    from — the exact lost context this layout exists to prevent.
 *
 * 2. **Three columns are not split into thirds.** The naive split makes the
 *    record — the thing being worked on — the narrowest of the three. The list
 *    compresses instead and the detail holds its measure.
 *
 * 3. **The rail collapses to an icon rail, never to zero.** A rail that
 *    collapses to nothing takes the module switcher with it. That is the shape
 *    the provider console had (`width: sidebarOpen ? 264 : 0`) and it is why
 *    the only way back was the browser's back button.
 */

export interface RecordShellProps {
  /** The module rail — nav for the 45 modules. Rendered by the app. */
  rail?: ReactNode;
  railCollapsed?: boolean;
  /**
   * The bar. Pinned above the columns so it does not scroll away with any one
   * of them — its position guarantee (§13.2) only holds if it sits outside the
   * scrolling regions.
   */
  bar?: ReactNode;
  /** Column 1 — the list. */
  list?: ReactNode;
  /** Column 2 — the record. */
  detail?: ReactNode;
  /** Column 3 — the inspector. Sheds first at narrow widths. */
  inspector?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const RecordShell: FC<RecordShellProps> = ({
  rail,
  railCollapsed = false,
  bar,
  list,
  detail,
  inspector,
  className = "",
  children,
}) => {
  // The column count is DERIVED from what was passed, not configured. A
  // `columns={3}` prop with only two slots filled renders an empty column, and
  // an empty column looks like a loading failure.
  const count = [list, detail ?? children, inspector].filter(Boolean).length;
  const colsClass =
    count >= 3 ? styles.cols_3 : count === 2 ? styles.cols_2 : styles.cols_1;

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {rail && (
        <nav
          className={`${styles.rail} ${railCollapsed ? styles.rail_collapsed : ""}`.trim()}
          aria-label="Modules"
        >
          {rail}
        </nav>
      )}

      <div style={{ display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", minWidth: 0 }}>
        {bar}
        <div className={`${styles.columns} ${colsClass}`} data-columns={count}>
          {list && <section className={styles.column}>{list}</section>}
          {(detail ?? children) && (
            <section className={styles.column}>{detail ?? children}</section>
          )}
          {inspector && (
            <aside
              className={`${styles.column} ${styles.column_inspector}`}
              aria-label="Inspector"
            >
              {inspector}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Object page ──────────────────────────────────────────────────────────── */

export interface ObjectSection {
  id: string;
  label: string;
  children?: ReactNode;
}

export interface ObjectPageProps {
  sections: ObjectSection[];
  /** The section currently in view — the app owns scroll-spy. */
  activeId?: string;
  className?: string;
}

/**
 * The record surface: anchor nav beside stacked sections.
 *
 * The anchors are real in-page links, not buttons with scroll handlers, so they
 * work with the keyboard, with middle-click, and with JavaScript disabled — and
 * so the section a user is reading is in the URL and therefore shareable. A
 * scroll handler on a `<button>` gives up all four for nothing.
 */
export const ObjectPage: FC<ObjectPageProps> = ({
  sections,
  activeId,
  className = "",
}) => (
  <div className={`${styles.object} ${styles.object_anchored} ${className}`.trim()}>
    <nav aria-label="Sections">
      <ul className={styles.anchors}>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`${styles.anchor} ${s.id === activeId ? styles.anchor_active : ""}`.trim()}
              aria-current={s.id === activeId ? "true" : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <div className={styles.sections}>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className={styles.section} aria-labelledby={`${s.id}-h`}>
          <h2 id={`${s.id}-h`} className={styles.section_title}>
            {s.label}
          </h2>
          {s.children}
        </section>
      ))}
    </div>
  </div>
);
