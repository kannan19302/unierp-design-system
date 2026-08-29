"use client";

import { useState, type FC, type ReactNode } from "react";
import styles from "./ops-shell.module.css";

/**
 * `<OpsShell>` — anatomy 6 of the eleven in UI_UX_BRIEF §11.
 * Provider Admin OS: internal staff, watching every tenant at once.
 *
 * ── Why this is not the ERP frame with different nav ──
 * Control-plane work is *watching* work. An operator is not completing a task
 * and leaving; they are holding a picture of the platform's condition in their
 * head and drilling into whatever contradicts it. So:
 *
 * - The **status strip is first and always present**. Platform health is not a
 *   page you navigate to, it is the condition you read everything else in. A
 *   console where "are we healthy?" costs a click has already failed.
 * - The rail is a **fixed icon rail** — never expanded, never zero. A 260px rail
 *   spends a fifth of the viewport on twelve words memorised in week one; a rail
 *   that collapses to zero takes the domain switcher with it, which is the shape
 *   `console-shell.tsx` shipped with (`width: sidebarOpen ? 264 : 0`).
 * - Content is **full-bleed** and compact by default. §5.2 measures forms and
 *   reading; a control plane is almost entirely tables.
 * - The **console drawer carries its counts on the collapsed bar**, so
 *   collapsing it can never hide a failure — §12.4's rule for the Studio
 *   console, applied to the operational one.
 */

export type OpsHealth = "ok" | "degraded" | "down";

export interface OpsMetric {
  label: string;
  value: ReactNode;
}

export interface OpsDomain {
  id: string;
  label: string;
  href: string;
}

export interface OpsRailItem {
  id: string;
  /** Icon node. The label is what makes it reachable, so it is required. */
  icon: ReactNode;
  label: string;
  href: string;
}

export interface OpsShellProps {
  rail?: OpsRailItem[];
  activeRailId?: string;
  /** Always rendered. Health recolours the whole strip, not one chip in it. */
  metrics?: OpsMetric[];
  health?: OpsHealth;
  domains?: OpsDomain[];
  activeDomainId?: string;
  /** Bottom drawer contents. Collapsed by default. */
  console?: ReactNode;
  consoleErrors?: number;
  consoleWarnings?: number;
  consoleLabel?: string;
  className?: string;
  children?: ReactNode;
}

const HEALTH_CLASS: Record<OpsHealth, string | undefined> = {
  ok: undefined,
  degraded: styles.strip_degraded,
  down: styles.strip_down,
};

export const OpsShell: FC<OpsShellProps> = ({
  rail,
  activeRailId,
  metrics,
  health = "ok",
  domains,
  activeDomainId,
  console: consoleContent,
  consoleErrors = 0,
  consoleWarnings = 0,
  consoleLabel = "Console",
  className = "",
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {rail && (
        <nav className={styles.rail} aria-label="Domains">
          {rail.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.rail_item} ${item.id === activeRailId ? styles.rail_item_active : ""}`.trim()}
              // An icon rail with no accessible name is a row of mystery meat —
              // §1's first law. The title also gives sighted users the tooltip.
              aria-label={item.label}
              title={item.label}
              aria-current={item.id === activeRailId ? "page" : undefined}
            >
              {item.icon}
            </a>
          ))}
        </nav>
      )}

      <div className={styles.body}>
        {metrics && metrics.length > 0 && (
          <div
            className={`${styles.strip} ${HEALTH_CLASS[health] ?? ""}`.trim()}
            data-health={health}
            // Degradation is announced, not only recoloured — colour is never
            // the sole carrier of meaning (§3.5).
            role="status"
            aria-live="polite"
          >
            {metrics.map((m) => (
              <span key={m.label} className={styles.metric}>
                <span className={styles.metric_label}>{m.label}</span>
                <span className={styles.metric_value}>{m.value}</span>
              </span>
            ))}
          </div>
        )}

        {domains && domains.length > 0 && (
          <ul className={styles.domains}>
            {domains.map((d) => (
              <li key={d.id} style={{ display: "flex" }}>
                <a
                  href={d.href}
                  className={`${styles.domain} ${d.id === activeDomainId ? styles.domain_active : ""}`.trim()}
                  aria-current={d.id === activeDomainId ? "page" : undefined}
                >
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.content}>{children}</div>

        {consoleContent !== undefined && (
          <section className={styles.console} aria-label={consoleLabel}>
            <button
              type="button"
              className={styles.console_bar}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <span>{consoleLabel}</span>
              {/* The counts live on the COLLAPSED bar. A drawer that hides its
                  error count when shut is a drawer that hides failures. */}
              {consoleErrors > 0 && (
                <span className={`${styles.count} ${styles.count_danger}`}>
                  {consoleErrors} {consoleErrors === 1 ? "error" : "errors"}
                </span>
              )}
              {consoleWarnings > 0 && (
                <span className={`${styles.count} ${styles.count_warning}`}>
                  {consoleWarnings} {consoleWarnings === 1 ? "warning" : "warnings"}
                </span>
              )}
              <span style={{ marginLeft: "auto" }}>{open ? "Hide" : "Show"}</span>
            </button>

            {open && <div className={styles.console_panel}>{consoleContent}</div>}
          </section>
        )}
      </div>
    </div>
  );
};
