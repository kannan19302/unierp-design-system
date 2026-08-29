"use client";

import { type FC } from "react";
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from "lucide-react";
import styles from "./priority-indicator.module.css";

export type Priority = "low" | "medium" | "high" | "urgent";

const PRIORITY_META = {
  low: { label: "Low", Icon: ArrowDown, variant: "low" },
  medium: { label: "Medium", Icon: ArrowRight, variant: "medium" },
  high: { label: "High", Icon: ArrowUp, variant: "high" },
  urgent: { label: "Urgent", Icon: AlertTriangle, variant: "urgent" },
};

export interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

export const PriorityIndicator: FC<PriorityIndicatorProps> = ({
  priority,
  showLabel = true,
  className = "",
}) => {
  const meta = PRIORITY_META[priority];
  const { Icon, variant } = meta;

  return (
    <span
      aria-label={`Priority: ${meta.label}`}
      className={`${styles.indicator} ${styles[variant]} ${className}`.trim()}
    >
      <Icon size={12} aria-hidden />
      {showLabel && <span className={styles.label}>{meta.label}</span>}
    </span>
  );
};
