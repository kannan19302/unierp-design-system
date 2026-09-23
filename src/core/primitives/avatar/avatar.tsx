"use client";

import {
  useState,
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { Presence, type PresenceStatus } from "../presence";
import styles from "./avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Avatar primitive — user identity visualization with presence indicators and fallback initials.
 */
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  presence?: PresenceStatus;
  alt?: string;
  className?: string;
  children?: ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  name,
  initials: explicitInitials,
  size = "md",
  shape = "circle",
  presence,
  alt,
  className = "",
  children,
  ...props
}, ref) => {
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
    <div ref={ref} className={`${styles.wrapper} ${sizeClass} ${className}`.trim()} {...props}>
      <div
        className={`${styles.avatar} ${shapeClass}`}
        data-shape={shape}
        style={
          children || (src && !imgError)
            ? undefined
            : {
                backgroundColor: getAvatarPalette(name || initials).bg,
                color: getAvatarPalette(name || initials).fg,
              }
        }
        role="img"
        aria-label={avatarLabel}
      >
        {children ? (
          children
        ) : src && !imgError ? (
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
});

Avatar.displayName = "Avatar";

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = "", alt = "Avatar", ...props }, ref) => (
    <img
      ref={ref}
      alt={alt}
      className={`${styles.image} ${className}`.trim()}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ children, className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`${styles.initials} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  )
);
AvatarFallback.displayName = "AvatarFallback";

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

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  className?: string;
  children: ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({
  max = 4,
  size = "md",
  className = "",
  children,
  ...props
}, ref) => {
  const childArray = Children.toArray(children);
  const visibleChildren = childArray.slice(0, max).map((child) => {
    if (isValidElement<AvatarProps>(child)) {
      return cloneElement(child, {
        size: child.props.size ?? size,
      });
    }
    return child;
  });
  const excess = childArray.length - max;

  return (
    <div ref={ref} className={`${styles.avatarGroup} ${styles[`group_${size}`]} ${className}`.trim()} {...props}>
      {visibleChildren}
      {excess > 0 && (
        <div className={`${styles.avatar} ${styles[size] || styles.md} ${styles.excessBadge}`}>
          <span className={styles.initials}>+{excess}</span>
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";
