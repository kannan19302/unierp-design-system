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
            : {
                backgroundColor: getAvatarPalette(name || initials).bg,
                color: getAvatarPalette(name || initials).fg,
              }
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

// Stable color and contrast pairing for initials background and foreground
const getAvatarPalette = (str?: string): { bg: string; fg: string } => {
  if (!str) {
    return {
      bg: "var(--surface-3-bg, var(--color-bg-muted))",
      fg: "var(--color-text-secondary)",
    };
  }
  const palettes = [
    { bg: "var(--color-primary-light)", fg: "var(--color-primary)" },
    { bg: "var(--color-info-light)", fg: "var(--color-info)" },
    { bg: "var(--color-success-light)", fg: "var(--color-success)" },
    { bg: "var(--color-warning-light)", fg: "var(--color-warning)" },
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index] || palettes[0]!;
};

export interface AvatarGroupProps {
  max?: number;
  size?: AvatarSize;
  className?: string;
  children: ReactNode;
}

import React from "react";

export const AvatarGroup: FC<AvatarGroupProps> = ({
  max = 4,
  size = "md",
  className = "",
  children,
}) => {
  const childArray = Children.toArray(children);
  const visibleChildren = childArray.slice(0, max).map((child) => {
    if (React.isValidElement<AvatarProps>(child)) {
      return React.cloneElement(child, {
        size: child.props.size ?? size,
      });
    }
    return child;
  });
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
