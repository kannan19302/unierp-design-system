"use client";

import { type FC, type ReactNode } from "react";
import styles from "./account-center.module.css";

export interface AccountSection {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  description?: string;
}

export interface AccountCenterShellProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    tenantName?: string;
  };
  sections: AccountSection[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  children: ReactNode;
  headerActions?: ReactNode;
  className?: string;
}

/**
 * `<AccountCenterShell>` — Unified Account Center layout.
 *
 * Provides a dedicated self-service workspace for user identity,
 * credentials, active sessions, density preferences, and accessibility settings.
 */
export const AccountCenterShell: FC<AccountCenterShellProps> = ({
  user,
  sections,
  activeSection,
  onNavigate,
  children,
  headerActions,
  className = "",
}) => {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      {/* ── User Header Banner ── */}
      <header className={styles.header}>
        <div className={styles.headerIdentity}>
          <div className={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback} aria-hidden="true">
                {initials}
              </div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.metaRow}>
              {user.role && <span className={styles.badge}>{user.role}</span>}
              {user.tenantName && (
                <span className={styles.tenantBadge}>{user.tenantName}</span>
              )}
            </div>
          </div>
        </div>
        {headerActions && (
          <div className={styles.headerActions}>{headerActions}</div>
        )}
      </header>

      {/* ── Main Layout Body ── */}
      <div className={styles.body}>
        {/* Navigation Rail */}
        <nav
          className={styles.navRail}
          aria-label="Account Settings Sections"
        >
          <ul className={styles.navList} role="list">
            {sections.map((sec) => {
              const isActive = sec.id === activeSection;
              return (
                <li key={sec.id} className={styles.navItem}>
                  <button
                    type="button"
                    className={`${styles.navButton} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => onNavigate(sec.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {sec.icon && (
                      <span className={styles.navIcon} aria-hidden="true">
                        {sec.icon}
                      </span>
                    )}
                    <span className={styles.navLabel}>{sec.label}</span>
                    {sec.badge !== undefined && (
                      <span className={styles.sectionBadge}>
                        {sec.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Pane */}
        <main className={styles.contentPane} id="account-content-pane">
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
};
