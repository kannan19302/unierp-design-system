"use client";

import { Fragment, type FC, type ReactNode } from "react";
import styles from "./workspace-shell.module.css";

/**
 * `<WorkspaceShell>` — the frame every project workspace (an App or a Site)
 * renders inside, one level below `<PlatformShell>` and one level above
 * `<StudioShell>`.
 *
 * It exists for the same reason `<StudioShell>` does, one altitude up: a
 * workspace that rendered its own project switcher and its own nav rail would
 * be the "thirteen builders, thirteen chromes" defect recurring at the
 * project level instead of the builder level. Entering an App and entering a
 * Site must feel like the same kind of place, differing only in which items
 * populate `nav` — never in how the rail, the switcher or the status strip
 * are laid out.
 *
 * This package has no opinion on WHAT belongs in `nav` — the consuming app's
 * builder registry decides that (`resolveBuilders(scope, permissions)`) and
 * hands this component the resolved list. That is also why `nav` items carry
 * a plain `icon?: ReactNode` rather than an icon-name string the way
 * `PlatformNavItem` does: `PlatformShell`'s nav is fixed platform chrome
 * resolved once from a manifest, but a workspace's nav is resolved per-render
 * from live registry + permission state, so asking every consumer to also
 * import an icon resolver here would be a second indirection for no benefit.
 *
 * ── What `scope` and `address` add ──
 * `scope` tints one hairline down the rail and the active nav marker. It
 * answers "which plane am I in" from anywhere on the screen without spending
 * vertical space on a badge, and it is the same hue `<ArtifactAddress>` gives
 * the scope segment, so the two reinforce each other rather than each
 * inventing a legend.
 *
 * `address` renders in the header strip. It is where a user reads and copies
 * the canonical identity of where they are — see `<ArtifactAddress>` for why
 * that is a different thing from a breadcrumb. Both props are optional and a
 * consumer that passes neither gets the previous layout.
 */

export type WorkspaceScope = "app" | "site" | "library" | "manage";

export interface WorkspaceNavItem {
  key: string;
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  /** UI_UX_BRIEF §12 rule 3, one level up: a not-yet-available builder is
   * disabled with a stated reason, never hidden and never a dead link. */
  disabledReason?: string;
  /**
   * Optional heading this item sits under. Consecutive items sharing a group
   * render beneath one label; a list with no groups renders exactly as before.
   * The registry's `kind` (builder / data / settings) is the intended source —
   * "authors something", "reads what was authored", "configures the project"
   * is a real distinction a user navigates by, not a tidying-up of a long list.
   */
  group?: string;
  /** Short ship-state marker — "beta", "soon". Rendered as a hairline tag. */
  tag?: string;
  /** `beta` warms the tag to the warning hue; anything else stays neutral. */
  tagTone?: "neutral" | "beta";
}

export interface WorkspaceIdentity {
  name: string;
  /** "App" | "Site" — or any label the host wants next to the name; this
   * package does not know the difference between the two project kinds. */
  kindLabel: string;
  icon?: ReactNode;
  status?: ReactNode;
}

export interface WorkspaceShellProps {
  /** Link back to the project list this workspace's kind belongs to
   * (`/apps` or `/sites`) — never back to the global platform home, because
   * "leave this app" and "leave the platform" are different actions. */
  backHref: string;
  backLabel: string;

  identity: WorkspaceIdentity;
  /** Renders next to the identity block — e.g. a project switcher trigger. */
  identityActions?: ReactNode;

  /** Which plane this workspace is in. Tints the rail edge and active marker. */
  scope?: WorkspaceScope;
  /** Canonical identity of the current location — an `<ArtifactAddress>`. */
  address?: ReactNode;

  nav: WorkspaceNavItem[];
  /** Rendered below `nav`, outside the scrollable region — settings/releases
   * links that should stay pinned regardless of how long `nav` gets. */
  navFooter?: ReactNode;

  /** e.g. a project-scoped command-palette trigger, a publish button. */
  headerActions?: ReactNode;

  children: ReactNode;
}

const SCOPE_CLASS: Record<WorkspaceScope, string | undefined> = {
  app: styles.scope_app,
  site: styles.scope_site,
  library: styles.scope_library,
  manage: styles.scope_manage,
};

export const WorkspaceShell: FC<WorkspaceShellProps> = ({
  backHref,
  backLabel,
  identity,
  identityActions,
  scope,
  address,
  nav,
  navFooter,
  headerActions,
  children,
}: any) => {
  return (
    <div
      className={[styles.shell, scope ? SCOPE_CLASS[scope as WorkspaceScope] ?? "" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className={styles.rail}>
        <a href={backHref} className={styles.back}>
          <span className={styles.back_arrow} aria-hidden="true">
            ←
          </span>
          {backLabel}
        </a>

        <div className={styles.identity}>
          {identity.icon && <span className={styles.identity_icon}>{identity.icon}</span>}
          <div className={styles.identity_text}>
            <span className={styles.identity_name}>{identity.name}</span>
            <span className={styles.identity_kind}>{identity.kindLabel}</span>
          </div>
          {identityActions}
        </div>
        {identity.status && <div className={styles.identity_status}>{identity.status}</div>}

        <nav className={styles.nav} aria-label={`${identity.name} navigation`}>
          {nav.map((item: WorkspaceNavItem, index: number) => {
            // A label is emitted when the group CHANGES, so the registry's
            // order decides the sections and this component never sorts —
            // re-sorting here would silently disagree with the order the
            // command palette and the "New…" menu derive from the same list.
            const previous = index > 0 ? nav[index - 1] : undefined;
            const heading =
              item.group && item.group !== previous?.group ? (
                <div key={`${item.key}__group`} className={styles.nav_group_label}>
                  {item.group}
                </div>
              ) : null;

            const inner = (
              <>
                <span className={styles.nav_icon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.nav_label}>{item.label}</span>
                {item.tag && (
                  <span
                    className={[
                      styles.nav_tag,
                      item.tagTone === "beta" ? styles.nav_tag_beta : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.tag}
                  </span>
                )}
              </>
            );

            return (
              <Fragment key={item.key}>
                {heading}
                {item.disabledReason ? (
                  <span
                    className={styles.nav_item_disabled}
                    title={item.disabledReason}
                    aria-disabled="true"
                  >
                    {inner}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={item.active ? styles.nav_item_active : styles.nav_item}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {inner}
                  </a>
                )}
              </Fragment>
            );
          })}
        </nav>

        {navFooter && <div className={styles.nav_footer}>{navFooter}</div>}
      </aside>

      <div className={styles.body}>
        {(address || headerActions) && (
          <div className={styles.header}>
            {address && <div className={styles.header_address}>{address}</div>}
            {headerActions && <div className={styles.header_actions}>{headerActions}</div>}
          </div>
        )}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
