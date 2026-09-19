"use client";

import { type FC, type CSSProperties } from "react";
import { Wifi, WifiOff, Clock, MinusCircle } from "lucide-react";
import styles from "./presence.module.css";

export type PresenceStatus = "online" | "offline" | "busy" | "away";
export type PresenceVariant = "icon" | "dot" | "pill" | "badge";
export type PresenceSize = "sm" | "md" | "lg";

export interface PresenceProps {
  status: PresenceStatus;
  variant?: PresenceVariant;
  size?: PresenceSize;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}

const PRESENCE_META = {
  online: { label: "Online", Icon: Wifi, statusClass: "online" },
  offline: { label: "Offline", Icon: WifiOff, statusClass: "offline" },
  busy: { label: "Busy", Icon: MinusCircle, statusClass: "busy" },
  away: { label: "Away", Icon: Clock, statusClass: "away" },
};

export const Presence: FC<PresenceProps> = ({
  status,
  variant = "icon",
  size = "md",
  showLabel = false,
  pulse = false,
  className = "",
  style,
}) => {
  const meta = PRESENCE_META[status];
  const { Icon, statusClass } = meta;
  const isPill = variant === "pill" || variant === "badge";
  const shouldShowLabel = showLabel || isPill;

  const iconSizes = { sm: 9, md: 11, lg: 13 };

  return (
    <span
      role="status"
      aria-label={meta.label}
      title={meta.label}
      className={`${styles.presence} ${styles[statusClass]} ${styles[variant]} ${styles[size]} ${className}`.trim()}
      style={style}
    >
      {variant === "icon" ? (
        <Icon size={iconSizes[size]} aria-hidden />
      ) : (
        <span className={styles.dotContainer}>
          {pulse && <span className={styles.dotPing} aria-hidden />}
          <span className={styles.dot} aria-hidden />
        </span>
      )}
      {shouldShowLabel && <span className={styles.label}>{meta.label}</span>}
    </span>
  );
};

