"use client";

import { useMemo, useState, type FC, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./studio-console.module.css";

/**
 * `<StudioConsole>` — the bottom drawer where a builder tells the truth about
 * what it just did.
 *
 * Every builder had somewhere different for this: a toast that vanished, an
 * alert bar above the canvas, an error thrown to the browser console, or —
 * most often — nothing, and a save that silently did not happen. A validation
 * error the user cannot find is the same as no validation.
 *
 * Three tabs, and one rule that makes them worth having: **a problem is
 * actionable or it is not a problem.** Every entry carries the id of the thing
 * it is about, and clicking it selects that thing on the canvas. A message
 * like "Invalid configuration" with nothing to click is what this replaces.
 *
 * Collapsed by default — UI_UX_BRIEF's fourth design law is "calm by default",
 * and a screen with nothing wrong should be quiet. The count badge is what
 * makes collapsing safe: an unread error still shows on the bar.
 */

export type ProblemSeverity = "error" | "warning" | "info";

export interface StudioProblem {
  id: string;
  severity: ProblemSeverity;
  message: string;
  /** Human-readable location, e.g. "Email field" or "Step 3". */
  where?: string;
  /** Canvas element id. Clicking the problem selects it. */
  targetId?: string;
}

export interface StudioConsoleProps {
  problems?: StudioProblem[];
  /** Test-run output. Rendered verbatim in a monospace pane. */
  output?: string;
  /** Extension/run logs (Track G G04). Any node — usually a list. */
  logs?: ReactNode;
  /** Selects a canvas element. Wire to `useStudioCanvas().select`. */
  onLocate?: (targetId: string) => void;
  defaultOpen?: boolean;
}

type ConsoleTab = "problems" | "output" | "logs";

// `styles` is typed as an index signature, which under
// noUncheckedIndexedAccess yields `string | undefined` — so the map is typed
// to match rather than asserted away, and the `?? ""` keeps a missing class
// from rendering the literal text "undefined" into className.
const SEVERITY_CLASS: Record<ProblemSeverity, string | undefined> = {
  error: styles.severityError,
  warning: styles.severityWarning,
  info: styles.severityInfo,
};

export const StudioConsole: FC<StudioConsoleProps> = ({
  problems = [],
  output,
  logs,
  onLocate,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState<ConsoleTab>("problems");

  const { errors, warnings } = useMemo(
    () => ({
      errors: problems.filter((p) => p.severity === "error").length,
      warnings: problems.filter((p) => p.severity === "warning").length,
    }),
    [problems],
  );

  const tabs: { id: ConsoleTab; label: string; present: boolean }[] = [
    { id: "problems", label: "Problems", present: true },
    { id: "output", label: "Output", present: output !== undefined },
    { id: "logs", label: "Logs", present: logs !== undefined },
  ];

  return (
    <section
      className={`${styles.console} ${open ? styles.expanded : styles.collapsed}`}
      aria-label="Console"
    >
      <div className={styles.bar}>
        <div role="tablist" aria-label="Console sections" style={{ display: "flex" }}>
          {tabs
            .filter((t) => t.present)
            .map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
                onClick={() => {
                  setTab(t.id);
                  setOpen(true);
                }}
              >
                {t.label}
              </button>
            ))}
        </div>

        {/* The counts sit on the collapsed bar precisely so collapsing cannot
            hide a failure. `aria-live` announces a validation run that lands
            while focus is elsewhere (UI_UX_BRIEF §8). */}
        <span aria-live="polite" style={{ display: "flex", gap: "var(--space-1, 0.25rem)" }}>
          {errors > 0 ? (
            <span
              className={`${styles.count} ${styles.countError}`}
              aria-label={`${errors} errors`}
            >
              {errors}
            </span>
          ) : null}
          {warnings > 0 ? (
            <span
              className={`${styles.count} ${styles.countWarn}`}
              aria-label={`${warnings} warnings`}
            >
              {warnings}
            </span>
          ) : null}
        </span>

        <span className={styles.spacer} />

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={14} aria-hidden /> : <ChevronUp size={14} aria-hidden />}
          {open ? "Hide console" : "Show console"}
        </button>
      </div>

      {open ? (
        <div className={styles.body}>
          {tab === "problems" ? (
            problems.length === 0 ? (
              <p className={styles.clean}>No problems found.</p>
            ) : (
              <ul className={styles.list}>
                {problems.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={styles.problem}
                      onClick={() => p.targetId && onLocate?.(p.targetId)}
                      // Without a target there is nothing to locate, so the row
                      // is not a control — disabling it is more honest than a
                      // button that does nothing when clicked.
                      disabled={!p.targetId || !onLocate}
                    >
                      <span className={`${styles.severity} ${SEVERITY_CLASS[p.severity] ?? ""}`}>
                        {p.severity}
                      </span>
                      <span>{p.message}</span>
                      {p.where ? <span className={styles.where}>{p.where}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {tab === "output" ? <pre className={styles.output}>{output}</pre> : null}
          {tab === "logs" ? logs : null}
        </div>
      ) : null}
    </section>
  );
};
