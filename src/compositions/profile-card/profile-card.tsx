"use client";

import { forwardRef, type ReactNode, useMemo } from "react";
import { Building2 } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./profile-card.module.css";

export const profileCardVariants = cva(styles.root, {
  variants: {
    variant: {
      compact: styles.compact,
      full: styles.full,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    variant: "compact",
    density: "standard",
  },
});

export type ProfileCardVariantProps = VariantProps<typeof profileCardVariants>;

export type ProfileStatus = "online" | "away" | "busy" | "offline";

export interface ProfileCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ProfileCardVariantProps {
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
  /** Density tier */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  /** Action buttons (Sign out, Switch tenant, etc.). */
  actions?: ReactNode;
}

/**
 * `<ProfileCard>` — Reusable user identity card supporting compact header dropdown and full account center variants.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and strict logical CSS.
 *
 * @maturity stable
 */
export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(({
  name,
  email,
  role,
  avatarUrl,
  tenantName,
  status,
  variant = "compact",
  density = "standard",
  actions,
  className = "",
  ...rest
}, ref) => {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }, [name]);

  const renderAvatar = () => (
    <div className={styles.avatarContainer} data-slot="profile-card-avatar">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className={styles.avatar}
          data-slot="profile-card-avatar-img"
        />
      ) : (
        <div className={styles.avatarFallback} data-slot="profile-card-avatar-fallback" aria-hidden="true">
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`${styles.statusDot} ${styles[`status-${status}`]}`}
          data-slot="profile-card-status-dot"
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div
        ref={ref}
        data-slot="profile-card"
        data-variant="compact"
        data-density={density}
        className={`${profileCardVariants({ variant: "compact", density })}${className ? ` ${className}` : ""}`.trim()}
        {...rest}
      >
        {renderAvatar()}
        <div className={styles.info} data-slot="profile-card-info">
          <div className={styles.nameRow} data-slot="profile-card-name-row">
            <span className={styles.name} data-slot="profile-card-name">{name}</span>
            {role && <span className={styles.roleBadge} data-slot="profile-card-role-badge">{role}</span>}
          </div>
          <span className={styles.email} data-slot="profile-card-email">{email}</span>
        </div>
        {actions && <div className={styles.actions} data-slot="profile-card-actions">{actions}</div>}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="profile-card"
      data-variant="full"
      data-density={density}
      className={`${profileCardVariants({ variant: "full", density })}${className ? ` ${className}` : ""}`.trim()}
      {...rest}
    >
      <div className={styles.bannerHeader} data-slot="profile-card-banner" aria-hidden="true" />
      <div className={styles.bodyContent} data-slot="profile-card-body">
        {renderAvatar()}
        <div className={styles.info} data-slot="profile-card-info">
          <div className={styles.nameRow} data-slot="profile-card-name-row">
            <span className={styles.name} data-slot="profile-card-name">{name}</span>
          </div>
          <span className={styles.email} data-slot="profile-card-email">{email}</span>
          {(role || tenantName) && (
            <div className={styles.metaRow} data-slot="profile-card-meta-row">
              {role && <span className={styles.roleBadge} data-slot="profile-card-role-badge">{role}</span>}
              {tenantName && (
                <span className={styles.tenantTag} data-slot="profile-card-tenant-tag">
                  <Building2 size={12} aria-hidden="true" />
                  <span>{tenantName}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {actions && <div className={styles.actions} data-slot="profile-card-actions">{actions}</div>}
      </div>
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";
