import { forwardRef } from "react";
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
  variant?: "text" | "pill";
  className?: string;
}

/**
 * `<PriorityIndicator>` — Semantic ticket and task priority level badge.
 * @maturity stable
 */
export const PriorityIndicator = forwardRef<HTMLSpanElement, PriorityIndicatorProps>(({
  priority,
  showLabel = true,
  variant = "text",
  className = "",
}, ref) => {
  const meta = PRIORITY_META[priority];
  const { Icon, variant: tone } = meta;

  return (
    <span
      ref={ref}
      aria-label={`Priority: ${meta.label}`}
      className={`${styles.indicator} ${styles[tone]} ${variant === "pill" ? styles.pill : ""} ${className}`.trim()}
    >
      <Icon size={12} aria-hidden />
      {showLabel && <span className={styles.label}>{meta.label}</span>}
    </span>
  );
});

PriorityIndicator.displayName = "PriorityIndicator";
