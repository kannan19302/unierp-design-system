"use client";

import { type FC, type CSSProperties } from "react";
import { Wifi, WifiOff, Clock, MinusCircle } from "lucide-react";
import styles from "./presence.module.css";

export type PresenceStatus = "online" | "offline" | "busy" | "away";
export type PresenceVariant = "icon" | "dot";

export interface PresenceProps {
  status: PresenceStatus;
  variant?: PresenceVariant;
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
  showLabel = false,
  pulse = false,
  className = "",
  style,
}) => {
  const meta = PRESENCE_META[status];
  const { Icon, statusClass } = meta;

  return (
    <span
      role="status"
      aria-label={meta.label}
      title={meta.label}
      className={`${styles.presence} ${styles[statusClass]} ${styles[variant]} ${pulse ? styles.pulse : ""} ${className}`.trim()}
      style={style}
    >
      {variant === "dot" ? (
        <span className={styles.dot} aria-hidden />
      ) : (
        <Icon size={10} aria-hidden />
      )}
      {showLabel && <span className={styles.label}>{meta.label}</span>}
    </span>
  );
};
