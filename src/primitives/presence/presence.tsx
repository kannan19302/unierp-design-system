"use client";

import { type FC, type CSSProperties } from "react";
import { Wifi, WifiOff, Clock, MinusCircle } from "lucide-react";
import styles from "./presence.module.css";

export type PresenceStatus = "online" | "offline" | "busy" | "away";

export interface PresenceProps {
  status: PresenceStatus;
  showLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}

const PRESENCE_META = {
  online: { label: "Online", Icon: Wifi, variant: "online" },
  offline: { label: "Offline", Icon: WifiOff, variant: "offline" },
  busy: { label: "Busy", Icon: MinusCircle, variant: "busy" },
  away: { label: "Away", Icon: Clock, variant: "away" },
};

export const Presence: FC<PresenceProps> = ({
  status,
  showLabel = false,
  className = "",
  style,
}) => {
  const meta = PRESENCE_META[status];
  const { Icon, variant } = meta;

  return (
    <span
      role="status"
      aria-label={meta.label}
      title={meta.label}
      className={`${styles.presence} ${styles[variant]} ${className}`.trim()}
      style={style}
    >
      <Icon size={10} aria-hidden />
      {showLabel && <span className={styles.label}>{meta.label}</span>}
    </span>
  );
};
