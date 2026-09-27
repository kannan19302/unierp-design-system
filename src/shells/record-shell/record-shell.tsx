"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./record-shell.module.css";

/**
 * `<RecordShell>` — Three-column flexible layout (List → Detail → Inspector) with independent scrolling columns.
 * @maturity stable
 */
type ShellDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const recordShellVariants = cva(styles.root, {
  variants: {
    density: {
      "ultra-compact": styles.density_ultra_compact,
      compact: styles.density_compact,
      standard: styles.density_standard,
      comfortable: styles.density_comfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface RecordShellProps extends VariantProps<typeof recordShellVariants> {
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
  density?: ShellDensity;
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
  density = "standard",
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
      data-slot="record-shell"
      data-floorplan="record-shell"
      data-density={density}
      className={`${recordShellVariants({ density })} ${className}`.trim()}
    >
      {rail && (
        <nav
          data-slot="record-shell-rail"
          className={`${styles.rail} ${railCollapsed ? styles.rail_collapsed : ""}`.trim()}
          aria-label="Modules"
        >
          {rail}
        </nav>
      )}

      <div data-slot="record-shell-content-pane" className={styles.content_pane}>
        {bar}
        {paneOptions.length > 1 && (
          <div data-slot="record-shell-pane-switcher" className={styles.paneSwitcher} role="group" aria-label="Record panes">
            {paneOptions.map((pane) => (
              <button
                key={pane}
                type="button"
                data-slot="record-shell-pane-button"
                className={styles.paneButton}
                aria-pressed={selectedPane === pane}
                onClick={() => {
                  if (activePane === undefined) setLocalPane(pane);
                  onPaneChange?.(pane);
                }}
              >
                {pane === "list" ? "List" : pane === "detail" ? "Record" : "Inspector"}
              </button>
            ))}
          </div>
        )}
        <div data-slot="record-shell-columns" className={`${styles.columns} ${colsClass}`} data-columns={count} data-active-pane={selectedPane}>
          {list && <section data-slot="record-shell-column" className={styles.column} data-pane="list">{list}</section>}
          {(detail ?? children) && (
            <section data-slot="record-shell-column" className={styles.column} data-pane="detail">{detail ?? children}</section>
          )}
          {inspector && (
            <aside
              data-slot="record-shell-inspector"
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

export const objectPageVariants = cva(styles.object, {
  variants: {
    density: {
      "ultra-compact": styles.density_ultra_compact,
      compact: styles.density_compact,
      standard: styles.density_standard,
      comfortable: styles.density_comfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface ObjectPageProps extends VariantProps<typeof objectPageVariants> {
  sections: ObjectSection[];
  /** The section currently in view — the app owns scroll-spy. */
  activeId?: string;
  density?: ShellDensity;
  className?: string;
}

/**
 * `<ObjectPage>` — Anchored multi-section detail page with accessible in-page navigation.
 * @maturity stable
 */
export const ObjectPage = forwardRef<HTMLDivElement, ObjectPageProps>(({
  sections,
  activeId,
  density = "standard",
  className = "",
}, ref) => (
  <div
    ref={ref}
    data-slot="record-shell-object-page"
    data-density={density}
    className={`${objectPageVariants({ density })} ${styles.object_anchored} ${className}`.trim()}
  >
    <nav data-slot="record-shell-object-nav" aria-label="Sections">
      <ul data-slot="record-shell-object-anchors" className={styles.anchors}>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              data-slot="record-shell-object-anchor"
              className={`${styles.anchor} ${s.id === activeId ? styles.anchor_active : ""}`.trim()}
              aria-current={s.id === activeId ? "true" : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <div data-slot="record-shell-object-sections" className={styles.sections}>
      {sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          data-slot="record-shell-object-section"
          className={styles.section}
          aria-labelledby={`${s.id}-h`}
        >
          <h2 id={`${s.id}-h`} data-slot="record-shell-section-title" className={styles.section_title}>
            {s.label}
          </h2>
          {s.children}
        </section>
      ))}
    </div>
  </div>
));

ObjectPage.displayName = "ObjectPage";

