"use client";

import { useCallback, useState, type FC, type ReactNode } from "react";
import styles from "./artifact-address.module.css";

/**
 * `<ArtifactAddress>` — the canonical, copyable identity of one thing in the
 * developer platform.
 *
 *     acme / apps / hr-onboarding / forms / leave-request @v4
 *
 * A breadcrumb describes where you clicked. An address describes what a thing
 * IS, and it is the same string in the workspace header, the list row, the
 * search result, the audit log and the share link. That is the whole reason
 * this is a component in the design system rather than a `<Breadcrumb>` with
 * different separators: a breadcrumb is navigation state, an address is
 * identity, and only one of the two is worth putting on a clipboard.
 *
 * ── The empty slot ──
 * `project` is nullable, and null RENDERS — as an em dash in the slot where
 * the owning project would sit, not as a closed-up shorter path. A library
 * artifact is precisely one whose `ownerProjectId IS NULL`, and that is what
 * lets publishing ATTACH it to an app without transferring it, so one form can
 * serve six apps at once. Collapsing the gap would make a library address
 * indistinguishable in shape from a project-owned one and hide the single
 * most load-bearing fact about it.
 *
 * ── Scope colour ──
 * The scope segment is the only coloured one, and it carries the same hue the
 * workspace rail edge carries. Scope is a third colour axis, orthogonal to
 * status and to the accent: scope says where a thing lives, status says what
 * state it is in, the accent says what you can click. The component sets
 * `--scope-hue` locally and the stylesheet reads it, so a host that wants a
 * different mapping overrides one custom property rather than forking.
 */

export type AddressScope = "app" | "site" | "library" | "manage";

const SCOPE_TOKEN: Record<AddressScope, string> = {
  app: "var(--scope-app, var(--color-primary))",
  site: "var(--scope-site, var(--color-info))",
  library: "var(--scope-library, var(--color-primary))",
  manage: "var(--scope-manage, var(--color-warning))",
};

/** The URL segment each scope occupies — `/apps`, `/sites`, `/library`, `/manage`. */
const SCOPE_SEGMENT: Record<AddressScope, string> = {
  app: "apps",
  site: "sites",
  library: "library",
  manage: "manage",
};

/** Why a scope has no owning project, shown on hovering the em dash. */
const NO_OWNER_REASON: Partial<Record<AddressScope, string>> = {
  library:
    "No owning project — a library artifact attaches to apps without moving.",
  manage: "Tenant-wide — not owned by any one project.",
};

export interface ArtifactAddressProps {
  /** Tenant slug. Omit in single-tenant contexts and the segment is dropped. */
  tenant?: string;
  scope: AddressScope;
  /**
   * The owning project's id. `null` is meaningful and renders as an em dash —
   * see the note above. Required rather than optional so a caller has to
   * decide, instead of getting the gap by forgetting to pass anything.
   */
  project: string | null;
  /** Builder segment: `forms`, `workflows`, `pages`, `environments`. */
  builder?: string;
  /** The artifact's own id — the leaf. */
  artifact?: string;
  /** Release, rendered after an `@`. Omit for unversioned surfaces. */
  version?: string;

  /** When set, the whole address links here. */
  href?: string;
  /** Renders a copy button. The copied string is the plain path. */
  copyable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Rendered after the address, inside the same row — e.g. a status chip. */
  trailing?: ReactNode;
}

/** The plain string form — what lands on the clipboard and in a log line. */
export function formatAddress({
  tenant,
  scope,
  project,
  builder,
  artifact,
  version,
}: Pick<
  ArtifactAddressProps,
  "tenant" | "scope" | "project" | "builder" | "artifact" | "version"
>): string {
  const parts: string[] = [];
  if (tenant) parts.push(tenant);
  parts.push(SCOPE_SEGMENT[scope]);
  parts.push(project ?? "—");
  if (builder) parts.push(builder);
  if (artifact) parts.push(artifact);
  const path = parts.join("/");
  return version ? `${path}@${version}` : path;
}

const Sep: FC<{ children?: ReactNode }> = ({ children = "/" }: any) => (
  <span className={styles.seg_sep} aria-hidden="true">
    {children}
  </span>
);

export const ArtifactAddress: FC<ArtifactAddressProps> = ({
  tenant,
  scope,
  project,
  builder,
  artifact,
  version,
  href,
  copyable = false,
  size = "md",
  className = "",
  trailing,
}: any) => {
  const scopeKey: AddressScope = scope;
  const [copied, setCopied] = useState(false);
  const plain = formatAddress({
    tenant,
    scope,
    project,
    builder,
    artifact,
    version,
  });

  const copy = useCallback(() => {
    // No clipboard in jsdom and none over plain http on a LAN host, so the
    // button must not throw where it cannot work — it simply does not confirm.
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }, [plain]);

  // The leaf is whichever segment is last — the artifact when there is one,
  // otherwise the builder, otherwise the project. Emphasising a fixed slot
  // would leave a list-level address (`acme/apps/hr-onboarding/forms`) with
  // nothing highlighted at all.
  const leaf = artifact ?? builder ?? project ?? undefined;

  const segments = (
    <>
      {tenant && (
        <>
          <span className={styles.seg}>{tenant}</span>
          <Sep />
        </>
      )}
      <span className={styles.seg_scope}>{SCOPE_SEGMENT[scopeKey]}</span>
      <Sep />
      {project === null ? (
        <span className={styles.seg_empty} title={NO_OWNER_REASON[scopeKey]}>
          {"—"}
        </span>
      ) : (
        <span className={leaf === project ? styles.seg_leaf : styles.seg}>
          {project}
        </span>
      )}
      {builder && (
        <>
          <Sep />
          <span className={leaf === builder ? styles.seg_leaf : styles.seg}>
            {builder}
          </span>
        </>
      )}
      {artifact && (
        <>
          <Sep />
          <span className={styles.seg_leaf}>{artifact}</span>
        </>
      )}
      {version && (
        <>
          <Sep>@</Sep>
          <span className={styles.seg_version}>{version}</span>
        </>
      )}
    </>
  );

  return (
    <span
      className={[styles.address, styles[size], className]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--scope-hue" as string]: SCOPE_TOKEN[scopeKey] }}
    >
      {href ? (
        <a className={styles.link} href={href} title={plain}>
          {segments}
        </a>
      ) : (
        segments
      )}

      {trailing}

      {copyable && (
        <button
          type="button"
          className={[styles.copy, copied ? styles.copy_done : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={copy}
          aria-label={copied ? `Copied ${plain}` : `Copy address ${plain}`}
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="9"
                y="9"
                width="11"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 15V5a2 2 0 0 1 2-2h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      )}
    </span>
  );
};
