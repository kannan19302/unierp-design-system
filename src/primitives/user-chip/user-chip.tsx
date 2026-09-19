"use client";

import type { FC } from "react";
import { Avatar } from "../avatar";
import type { PresenceStatus } from "../presence";
import styles from "./user-chip.module.css";

export interface UserChipProps {
  name: string;
  role?: string;
  avatarSrc?: string;
  status?: PresenceStatus;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const UserChip: FC<UserChipProps> = ({
  name,
  role,
  avatarSrc,
  status,
  onClick,
  onRemove,
  className = "",
}) => {
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={`${styles.chip} ${isInteractive ? styles.interactive : ""} ${className}`.trim()}
    >
      <div className={styles.avatarWrap}>
        <Avatar src={avatarSrc} name={name} size="sm" presence={status} />
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
};
