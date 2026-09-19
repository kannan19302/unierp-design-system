"use client";

import { useState, type FC, type ReactNode, Children } from "react";
import { Presence, type PresenceStatus } from "../presence";
import styles from "./avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  presence?: PresenceStatus;
  alt?: string;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  name,
  initials: explicitInitials,
  size = "md",
  shape = "circle",
  presence,
  alt,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (text?: string): string => {
    if (!text) return "?";
    const parts = text.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  };

  const initials = explicitInitials || getInitials(name);
  const sizeClass = styles[size] || styles.md;
  const shapeClass = shape === "square" ? styles.square : styles.circle;
  const avatarLabel = alt || name || "Avatar";

  return (
    <div className={`${styles.wrapper} ${sizeClass} ${className}`.trim()}>
      <div
        className={`${styles.avatar} ${shapeClass}`}
        data-shape={shape}
        style={
          src && !imgError
            ? undefined
            : { backgroundColor: getBackgroundColor(name || initials) }
        }
        role="img"
        aria-label={avatarLabel}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={avatarLabel}
            className={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.initials}>{initials || "?"}</span>
        )}
      </div>
      {presence && (
        <span className={styles.presenceIndicator}>
          <Presence status={presence} variant="dot" />
        </span>
      )}
    </div>
  );
};

// Stable color hash for background
const getBackgroundColor = (str?: string): string => {
  if (!str) return "var(--surface-3-bg, var(--color-bg-muted))";
  const colors = [
    "var(--color-primary-light)",
    "var(--color-info-light)",
    "var(--color-success-light)",
    "var(--color-warning-light)",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index] || colors[0]!;
};

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  className?: string;
  children: ReactNode;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({
  max = 4,
  size = "md",
  className = "",
  children,
}) => {
  const childArray = Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const excess = childArray.length - max;

  return (
    <div className={`${styles.avatarGroup} ${styles[`group_${size}`]} ${className}`.trim()}>
      {visibleChildren}
      {excess > 0 && (
        <div className={`${styles.avatar} ${styles[size] || styles.md} ${styles.excessBadge}`}>
          <span className={styles.initials}>+{excess}</span>
        </div>
      )}
    </div>
  );
};
