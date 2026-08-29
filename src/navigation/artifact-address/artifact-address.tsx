"use client";

import { useCallback, useState, type FC, type ReactNode } from "react";
import styles from "./artifact-address.module.css";

export type AddressScope = "app" | "site" | "library" | "manage";

const SCOPE_TOKEN: Record<AddressScope, string> = {
  app: "var(--scope-app, var(--color-primary))",
  site: "var(--scope-site, var(--color-info))",
  library: "var(--scope-library, var(--color-primary))",
  manage: "var(--scope-manage, var(--color-warning))",
};

const SCOPE_SEGMENT: Record<AddressScope, string> = {
  app: "apps",
  site: "sites",
  library: "library",
  manage: "manage",
};

const NO_OWNER_REASON: Partial<Record<AddressScope, string>> = {
  library: "No owning project — a library artifact attaches to apps without moving.",
  manage: "Tenant-wide — not owned by any one project.",
};

export interface ArtifactAddressProps {
  tenant?: string;
  scope: AddressScope;
  project: string | null;
  builder?: string;
  artifact?: string;
  version?: string;
  href?: string;
  copyable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  trailing?: ReactNode;
}

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

const Sep: FC<{ children?: ReactNode }> = ({ children = "/" }) => (
  <span className={styles.segSep} aria-hidden="true">
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
}) => {
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
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }, [plain]);

  const leaf = artifact ?? builder ?? project ?? undefined;

  const segments = (
    <>
      {tenant && (
        <>
          <span className={styles.seg}>{tenant}</span>
          <Sep />
        </>
      )}
      <span className={styles.segScope}>{SCOPE_SEGMENT[scopeKey]}</span>
      <Sep />
      {project === null ? (
        <span className={styles.segEmpty} title={NO_OWNER_REASON[scopeKey]}>
          {"—"}
        </span>
      ) : (
        <span className={leaf === project ? styles.segLeaf : styles.seg}>
          {project}
        </span>
      )}
      {builder && (
        <>
          <Sep />
          <span className={leaf === builder ? styles.segLeaf : styles.seg}>
            {builder}
          </span>
        </>
      )}
      {artifact && (
        <>
          <Sep />
          <span className={styles.segLeaf}>{artifact}</span>
        </>
      )}
      {version && (
        <>
          <Sep>@</Sep>
          <span className={styles.segVersion}>{version}</span>
        </>
      )}
    </>
  );

  return (
    <span
      className={[styles.address, styles[size], className].filter(Boolean).join(" ")}
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
          className={[styles.copy, copied ? styles.copyDone : ""].filter(Boolean).join(" ")}
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
