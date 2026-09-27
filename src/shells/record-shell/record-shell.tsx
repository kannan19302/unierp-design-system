"use client";

import { forwardRef, useState, type ReactNode } from "react";
import styles from "./record-shell.module.css";

/**
 * `<RecordShell>` — Three-column flexible layout (List → Detail → Inspector) with independent scrolling columns.
 * @maturity stable
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
  /** Visible pane at narrow widths; defaults to detail when present. */
  activePane?: "list" | "detail" | "inspector";
  onPaneChange?: (pane: "list" | "detail" | "inspector") => void;
  /** Density scale */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  children?: ReactNode;
}

export const RecordShell = forwardRef<HTMLDivElement, RecordShellProps>(({
  rail,
  railCollapsed = false,
  bar,
  list,
  detail,
  inspector,
  activePane,
  onPaneChange,
  density,
  className = "",
  children,
}, ref) => {
  const [localPane, setLocalPane] = useState<"list" | "detail" | "inspector">(
    detail || children ? "detail" : list ? "list" : "inspector",
  );
  const paneOptions = [
    list && "list",
    (detail ?? children) && "detail",
    inspector && "inspector",
  ].filter(Boolean) as Array<"list" | "detail" | "inspector">;
  const selectedPane = paneOptions.includes(activePane ?? localPane)
    ? (activePane ?? localPane)
    : paneOptions[0];
  // The column count is DERIVED from what was passed, not configured. A
  // `columns={3}` prop with only two slots filled renders an empty column, and
  // an empty column looks like a loading failure.
  const count = [list, detail ?? children, inspector].filter(Boolean).length;
  const colsClass =
    count >= 3 ? styles.cols_3 : count === 2 ? styles.cols_2 : styles.cols_1;

  return (
    <div
      ref={ref}
      className={`${styles.root} ${className}`.trim()}
      data-floorplan="record-shell"
      data-density={density}
    >
      {rail && (
        <nav
          className={`${styles.rail} ${railCollapsed ? styles.rail_collapsed : ""}`.trim()}
          aria-label="Modules"
        >
          {rail}
        </nav>
      )}

      <div className={styles.content_pane}>
        {bar}
        {paneOptions.length > 1 && (
          <div className={styles.paneSwitcher} role="group" aria-label="Record panes">
            {paneOptions.map((pane) => (
              <button key={pane} type="button" className={styles.paneButton} aria-pressed={selectedPane === pane} onClick={() => {
                if (activePane === undefined) setLocalPane(pane);
                onPaneChange?.(pane);
              }}>{pane === "list" ? "List" : pane === "detail" ? "Record" : "Inspector"}</button>
            ))}
          </div>
        )}
        <div className={`${styles.columns} ${colsClass}`} data-columns={count} data-active-pane={selectedPane}>
          {list && <section className={styles.column} data-pane="list">{list}</section>}
          {(detail ?? children) && (
            <section className={styles.column} data-pane="detail">{detail ?? children}</section>
          )}
          {inspector && (
            <aside
              className={`${styles.column} ${styles.column_inspector}`}
              data-pane="inspector"
              aria-label="Inspector"
            >
              {inspector}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
});

RecordShell.displayName = "RecordShell";

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
 * `<ObjectPage>` — Anchored multi-section detail page with accessible in-page navigation.
 * @maturity stable
 */
export const ObjectPage = forwardRef<HTMLDivElement, ObjectPageProps>(({
  sections,
  activeId,
  className = "",
}, ref) => (
  <div ref={ref} className={`${styles.object} ${styles.object_anchored} ${className}`.trim()}>
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
));

ObjectPage.displayName = "ObjectPage";
