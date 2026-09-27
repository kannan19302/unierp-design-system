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
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { Presence, type PresenceStatus } from "../badge";
import styles from "./avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

/**
 * Class variance authority definitions for Avatar.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const avatarVariants = cva(styles.avatar, {
  variants: {
    size: {
      xs: styles.xs,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      xl: styles.xl,
    },
    shape: {
      circle: styles.circle,
      square: styles.square,
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Avatar primitive — user identity visualization with presence indicators and fallback initials.
 * Standardized to Radix UI / Atlassian / shadcn enterprise benchmark.
 */
export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
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

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
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
    },
    ref,
  ) => {
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
      <div
        ref={ref}
        data-slot="avatar"
        data-size={size}
        data-shape={shape}
        className={`${styles.wrapper} ${sizeClass} ${className}`.trim()}
        {...props}
      >
        <div
          data-slot="avatar-frame"
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
              data-slot="avatar-image"
              className={styles.image}
              onError={() => setImgError(true)}
            />
          ) : (
            <span data-slot="avatar-fallback" className={styles.initials}>
              {initials || "?"}
            </span>
          )}
        </div>
        {presence && (
          <span data-slot="avatar-presence" className={styles.presenceIndicator}>
            <Presence status={presence} variant="dot" />
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = "", alt = "Avatar", ...props }, ref) => (
    <img
      ref={ref}
      alt={alt}
      data-slot="avatar-image"
      className={`${styles.image} ${className}`.trim()}
      {...props}
    />
  ),
);
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ children, className = "", ...props }, ref) => (
    <span
      ref={ref}
      data-slot="avatar-fallback"
      className={`${styles.initials} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  ),
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

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 4, size = "md", className = "", children, ...props }, ref) => {
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
      <div
        ref={ref}
        data-slot="avatar-group"
        className={`${styles.avatarGroup} ${styles[`group_${size}`]} ${className}`.trim()}
        {...props}
      >
        {visibleChildren}
        {excess > 0 && (
          <div
            data-slot="avatar-group-excess"
            className={`${styles.avatar} ${styles[size] || styles.md} ${styles.excessBadge}`}
          >
            <span className={styles.initials}>+{excess}</span>
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
