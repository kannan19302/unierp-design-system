"use client";

import { useCallback, useState, type FC, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./meridian-bar.module.css";

/**
 * `<MeridianBar>` — the signature of the UniERP design language, and the one
 * element that is identical on all eleven platform surfaces.
 *
 *     acme / finance / invoices / INV-2043   ● Awaiting approval   [ Approve ]
 *     └─ where am I ────────────────────┘    └─ what state ─┘      └─ next verb ─┘
 *
 * ── Why this exists ──
 * UI_UX_BRIEF §11 gives each platform a deliberately different layout anatomy:
 * the wizard has no chrome, the ERP slides three columns, the control plane
 * leads with a live status strip, the marketing site is editorial. Eleven
 * anatomies is eleven products unless something does not move. This is that
 * something.
 *
 * It answers three questions, in this order, in this place, everywhere:
 *
 *   1. WHERE AM I   — identity, in mono, copyable. Not navigation. A breadcrumb
 *                     is where you clicked; an address is what this thing IS,
 *                     and only one of the two is worth putting on a clipboard.
 *   2. WHAT STATE   — exactly one status, in the shared pill vocabulary. Absent
 *                     when nothing is pending: design law 4, calm by default. A
 *                     bar that always shows a chip teaches people to ignore it.
 *   3. WHAT NEXT    — exactly one primary action. Singular in the API, not by
 *                     convention, because §7's "exactly one primary per view"
 *                     survives review pressure only if the type makes a second
 *                     one impossible to express.
 *
 * ── On the address prop ──
 * The Meridian plan said this component would "generalise `ArtifactAddress`
 * beyond builder artefacts". It does not, and deliberately. `ArtifactAddress`
 * encodes an invariant worth protecting — a null project renders as an em dash
 * rather than collapsing, because a library artifact is exactly one whose
 * `ownerProjectId IS NULL` and the gap is the most load-bearing fact about it.
 * Widening that component to also express `finance / invoices / INV-2043` would
 * mean either an optional-everything API or losing the invariant.
 *
 * So the bar takes EITHER a rendered `address` node — developer-platform passes
 * its `<ArtifactAddress>` straight in, keeping scope hues and the em dash — OR
 * a plain `segments` list for the other ten surfaces, which have no scopes and
 * no nullable project. Two shapes, one bar, neither distorted to fit the other.
 */

export type MeridianState =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const STATE_TOKENS: Record<MeridianState, { bg: string; fg: string; dot: string }> = {
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

/** Scope tints the bar's leading edge. Same hues, same meaning, as the rail. */
export type MeridianScope = "app" | "site" | "library" | "manage";

const SCOPE_TOKEN: Record<MeridianScope, string> = {
  app: "var(--scope-app, var(--color-primary))",
  site: "var(--scope-site, var(--color-info))",
  library: "var(--scope-library, var(--color-primary))",
  manage: "var(--scope-manage, var(--color-warning))",
};

export interface MeridianSegment {
  label: string;
  /** When set, this segment links. The leaf normally does not. */
  href?: string;
}

/**
 * The next verb.
 *
 * A discriminated union rather than a flat interface with two optional fields,
 * so that **a disabled verb without a stated reason does not compile**.
 *
 * §12.3 established the rule for the Studio toolbar — "a verb a builder
 * genuinely cannot perform renders disabled with a stated reason, not hidden,
 * so the bar has the same shape everywhere and nobody has to re-find a control
 * that moved" — and it is the same argument one altitude up. A disabled control
 * with no explanation is a dead end that looks like a bug.
 *
 * That rule was previously a sentence in a document. Here it is a type error:
 *
 *     action={{ label: "Approve", disabled: true }}
 *     //                          ^ Property 'disabledReason' is missing
 *
 * `href` is excluded from the disabled branch for the same reason a disabled
 * link is not a thing — an anchor cannot be disabled, only removed, which is
 * exactly the hiding this rule forbids.
 */
export type MeridianAction =
  | {
      label: string;
      onClick?: () => void;
      href?: string;
      disabled?: false;
      disabledReason?: never;
    }
  | {
      label: string;
      onClick?: () => void;
      href?: never;
      disabled: true;
      disabledReason: string;
    };

export interface MeridianBarProps {
  /** A rendered address — e.g. `<ArtifactAddress …/>`. Wins over `segments`. */
  address?: ReactNode;
  /** The general form: plain path segments, last one treated as the leaf. */
  segments?: MeridianSegment[];
  /** Adds a copy button. Copies `segments` joined with `/`. */
  copyable?: boolean;

  state?: { label: string; tone?: MeridianState };
  action?: MeridianAction;

  /** Tints the leading edge. Omit on surfaces that have no scope axis. */
  scope?: MeridianScope;
  className?: string;
  /** Extra controls between state and the primary verb. Use sparingly. */
  children?: ReactNode;
}

/** The plain string form — what lands on a clipboard, a log line or a ticket. */
export function formatSegments(segments: MeridianSegment[]): string {
  return segments.map((s) => s.label).join("/");
}

export const MeridianBar: FC<MeridianBarProps> = ({
  address,
  segments,
  copyable = false,
  state,
  action,
  scope,
  className = "",
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const plain = segments ? formatSegments(segments) : "";

  const copy = useCallback(() => {
    // No clipboard in jsdom, and none over plain http on a LAN host. The button
    // must not throw where it cannot work — it simply does not confirm.
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }, [plain]);

  const tone = STATE_TOKENS[state?.tone ?? "neutral"];

  const rootStyle = scope
    ? ({ ["--scope-hue" as string]: SCOPE_TOKEN[scope] } as Record<string, string>)
    : undefined;

  return (
    <div
      className={`${styles.root} ${scope ? styles.scoped : ""} ${className}`.trim()}
      style={rootStyle}
      data-meridian-bar=""
    >
      {/* 1 — where am I */}
      <div className={styles.identity}>
        {address ?? (
          segments && segments.length > 0 ? (
            <span className={styles.segments}>
              {segments.map((seg, i) => {
                const isLeaf = i === segments.length - 1;
                return (
                  <span key={`${seg.label}-${i}`}>
                    {i > 0 && (
                      <span className={styles.sep} aria-hidden="true">
                        {" / "}
                      </span>
                    )}
                    {seg.href && !isLeaf ? (
                      <a className={styles.seg_link} href={seg.href}>
                        {seg.label}
                      </a>
                    ) : (
                      <span className={isLeaf ? styles.leaf : undefined}>
                        {seg.label}
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
          ) : null
        )}

        {copyable && segments && segments.length > 0 && (
          <button
            type="button"
            className={styles.copy}
            onClick={copy}
            // The confirmation is in WORDS, not only in the icon swap — the
            // icon is aria-hidden, so the accessible name is the only thing a
            // screen-reader user gets.
            aria-label={copied ? `Copied ${plain}` : `Copy address ${plain}`}
          >
            {copied ? (
              <Check size={13} aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {/* 2 — what state. Absent, not empty, when nothing is pending. */}
      {state && (
        <span
          className={styles.state}
          style={
            {
              ["--state-bg" as string]: tone.bg,
              ["--state-fg" as string]: tone.fg,
              ["--state-dot" as string]: tone.dot,
            } as Record<string, string>
          }
        >
          <span className={styles.dot} aria-hidden="true" />
          {state.label}
        </span>
      )}

      {/* 3 — what next */}
      <div className={styles.action_slot}>
        {children}
        {action &&
          (action.href && !action.disabled ? (
            <a className={styles.verb} href={action.href}>
              {action.label}
            </a>
          ) : (
            <>
              {action.disabled && action.disabledReason && (
                <span className={styles.reason} id="meridian-verb-reason">
                  {action.disabledReason}
                </span>
              )}
              <button
                type="button"
                className={styles.verb}
                onClick={action.onClick}
                disabled={action.disabled}
                // Disabled, not hidden — and the reason is attached, so the
                // explanation reaches a screen reader too, not just the sighted
                // user who can see the grey text beside it.
                aria-describedby={
                  action.disabled && action.disabledReason
                    ? "meridian-verb-reason"
                    : undefined
                }
              >
                {action.label}
              </button>
            </>
          ))}
      </div>
    </div>
  );
};
