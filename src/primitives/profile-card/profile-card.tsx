"use client";

import { type FC, type ReactNode, useMemo } from "react";
import { Building2 } from "lucide-react";
import styles from "./profile-card.module.css";

export type ProfileStatus = "online" | "away" | "busy" | "offline";

export interface ProfileCardProps {
  /** User's full display name. */
  name: string;
  /** User's email address. */
  email: string;
  /** Optional role or title. */
  role?: string;
  /** Avatar image URL. Falls back to initials when omitted. */
  avatarUrl?: string;
  /** Tenant or organization name. */
  tenantName?: string;
  /** Real-time presence status. */
  status?: ProfileStatus;
  /** compact = header dropdown (48px), full = account page card. */
  variant?: "compact" | "full";
  /** Action buttons (Sign out, Switch tenant, etc.). */
  actions?: ReactNode;
  className?: string;
}

/**
 * `<ProfileCard>` — Reusable user identity card.
 *
 * Used across headers (compact variant in user dropdown),
 * account centers (full variant), and hover cards.
 */
export const ProfileCard: FC<ProfileCardProps> = ({
  name,
  email,
  role,
  avatarUrl,
  tenantName,
  status,
  variant = "compact",
  actions,
  className = "",
}) => {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }, [name]);

  const renderAvatar = () => (
    <div className={styles.avatarContainer}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className={styles.avatar}
        />
      ) : (
        <div className={styles.avatarFallback} aria-hidden="true">
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`${styles.statusDot} ${styles[`status-${status}`]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div
        className={`${styles.root} ${styles.compact} ${className}`.trim()}
        data-variant="compact"
      >
        {renderAvatar()}
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{name}</span>
            {role && <span className={styles.roleBadge}>{role}</span>}
          </div>
          <span className={styles.email}>{email}</span>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    );
  }

  return (
    <div
      className={`${styles.root} ${styles.full} ${className}`.trim()}
      data-variant="full"
    >
      <div className={styles.bannerHeader} aria-hidden="true" />
      <div className={styles.bodyContent}>
        {renderAvatar()}
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{name}</span>
          </div>
          <span className={styles.email}>{email}</span>
          {(role || tenantName) && (
            <div className={styles.metaRow}>
              {role && <span className={styles.roleBadge}>{role}</span>}
              {tenantName && (
                <span className={styles.tenantTag}>
                  <Building2 size={12} aria-hidden="true" />
                  <span>{tenantName}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};
