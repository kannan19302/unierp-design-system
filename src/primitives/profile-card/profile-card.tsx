"use client";

import { type FC, type ReactNode, useMemo } from "react";
import styles from "./profile-card.module.css";

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

  return (
    <div
      className={`${styles.root} ${styles[variant]} ${className}`.trim()}
      data-variant={variant}
    >
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
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.email}>{email}</span>
        {variant === "full" && role && (
          <span className={styles.role}>{role}</span>
        )}
        {variant === "full" && tenantName && (
          <span className={styles.tenant}>{tenantName}</span>
        )}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};
