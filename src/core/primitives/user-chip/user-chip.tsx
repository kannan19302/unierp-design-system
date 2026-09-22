"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { Avatar } from "../avatar";
import type { PresenceStatus } from "../presence";
import styles from "./user-chip.module.css";

export type UserChipShape = "pill" | "rounded";
export type UserChipSize = "sm" | "md";

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL UserChip primitive — compact identity badge showing avatar, presence, name, and role.
 */
export interface UserChipProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  avatarSrc?: string;
  status?: PresenceStatus;
  shape?: UserChipShape;
  size?: UserChipSize;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const UserChip = forwardRef<HTMLDivElement, UserChipProps>(({
  name,
  role,
  avatarSrc,
  status,
  shape = "pill",
  size = "md",
  onClick,
  onRemove,
  className = "",
  ...props
}, ref) => {
  const isInteractive = Boolean(onClick);
  const avatarSize = size === "sm" ? "xs" : "sm";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={`${styles.chip} ${styles[shape]} ${styles[size]} ${isInteractive ? styles.interactive : ""} ${className}`.trim()}
      {...props}
    >
      <div className={styles.avatarWrap}>
        <Avatar src={avatarSrc} name={name} size={avatarSize} presence={status} />
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        {role && <span className={styles.role}>{role}</span>}
      </div>
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${name}`}
        >
          &times;
        </button>
      )}
    </div>
  );
});

UserChip.displayName = "UserChip";
