"use client";

import { useCallback, useState, type FC, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./strata-bar.module.css";

export type StrataState =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const STATE_TOKENS: Record<StrataState, { bg: string; fg: string; dot: string }> = {
  neutral: {
    bg: "var(--color-bg-sunken)",
    fg: "var(--color-text-secondary)",
    dot: "var(--color-text-tertiary)",
  },
  success: {
    bg: "var(--color-success-light)",
    fg: "var(--color-success-text)",
    dot: "var(--color-success)",
  },
  warning: {
    bg: "var(--color-warning-light)",
    fg: "var(--color-warning-text)",
    dot: "var(--color-warning)",
  },
  danger: {
    bg: "var(--color-danger-light)",
    fg: "var(--color-danger-text)",
    dot: "var(--color-danger)",
  },
  info: {
    bg: "var(--color-info-light)",
    fg: "var(--color-info-text)",
    dot: "var(--color-info)",
  },
};

export type StrataScope = "app" | "site" | "library" | "manage";

export interface LifecycleStep {
  id: string;
  label: string;
  active?: boolean;
  completed?: boolean;
}

export interface StrataBarProps {
  /**
   * Plain segment hierarchy, e.g. ["acme", "finance", "invoices", "INV-2043"].
   * Joined with "/" and rendered in monospace. The terminal segment is bolded.
   */
  segments?: readonly string[];
  /**
   * Escape hatch for surfaces that render a richer address (e.g. ArtifactAddress).
   */
  address?: ReactNode;
  /**
   * Scope hue applied to the 3px leading edge.
   */
  scope?: StrataScope;
  /**
   * Operational status of the current entity.
   */
  state?: {
    kind: StrataState;
    label: string;
  };
  /**
   * Visual chevron lifecycle flow (e.g. Draft -> In Review -> Approved -> Posted).
   */
  lifecycle?: readonly LifecycleStep[];
  /**
   * Collaboration avatars (initials of active viewers).
   */
  activeUsers?: readonly string[];
  /**
   * Exactly one primary next action, rendered at the far right.
   */
  action?: ReactNode;
  className?: string;
}

export const StrataBar: FC<StrataBarProps> = ({
  segments,
  address,
  scope,
  state,
  lifecycle,
  activeUsers,
  action,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const copyText = segments ? segments.join(" / ") : undefined;

  const handleCopy = useCallback(() => {
    if (!copyText) return;
    navigator.clipboard?.writeText(copyText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  }, [copyText]);

  const scopeStyle = scope
    ? ({ "--scope-hue": `var(--scope-${scope})` } as Record<string, string>)
    : undefined;

  return (
    <header
      aria-label="Operational Context Bar"
      className={`${styles.root} ${scope ? styles.scoped : ""} ${className ?? ""}`}
      style={scopeStyle}
    >
      <div className={styles.identity}>
        {address ? (
          address
        ) : segments && segments.length > 0 ? (
          <div className={styles.segments}>
            {segments.map((s, i) => {
              const isTerminal = i === segments.length - 1;
              return (
                <span key={i} className={isTerminal ? styles.terminal : undefined}>
                  {i > 0 && <span className={styles.sep}> / </span>}
                  {s}
                </span>
              );
            })}
          </div>
        ) : null}

        {copyText && (
          <button
            type="button"
            className={styles.copy_btn}
            onClick={handleCopy}
            aria-label={copied ? "Copied address" : "Copy address"}
            title={copied ? "Copied!" : "Copy address to clipboard"}
          >
            {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
          </button>
        )}
      </div>

      <div className={styles.center}>
        {lifecycle && lifecycle.length > 0 && (
          <div className={styles.lifecycle_path} role="navigation" aria-label="Lifecycle progress">
            {lifecycle.map((step) => (
              <span
                key={step.id}
                className={`${styles.path_step} ${step.active ? styles.path_step_active : ""}`}
              >
                {step.label}
              </span>
            ))}
          </div>
        )}

        {state && (
          <span
            className={styles.state_pill}
            style={{
              backgroundColor: STATE_TOKENS[state.kind].bg,
              color: STATE_TOKENS[state.kind].fg,
            }}
          >
            <span
              className={styles.state_dot}
              style={{ backgroundColor: STATE_TOKENS[state.kind].dot }}
              aria-hidden
            />
            {state.label}
          </span>
        )}
      </div>

      <div className={styles.right}>
        {activeUsers && activeUsers.length > 0 && (
          <div className={styles.avatars} aria-label={`${activeUsers.length} active viewers`}>
            {activeUsers.slice(0, 3).map((initials, idx) => (
              <div key={idx} className={styles.avatar_circle} title={initials}>
                {initials}
              </div>
            ))}
          </div>
        )}

        {action && <div className={styles.action}>{action}</div>}
      </div>
    </header>
  );
};
