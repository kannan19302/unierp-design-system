"use client";

import { type FC } from "react";
import { Heart } from "lucide-react";
import styles from "./health-score.module.css";

export interface HealthScoreProps {
  /** Health percentage from 0 to 100 */
  score: number;
  variant?: "text" | "pill";
  className?: string;
}

export const HealthScore: FC<HealthScoreProps> = ({
  score,
  variant = "text",
  className = "",
}) => {
  const status = score >= 80 ? "good" : score >= 50 ? "fair" : "poor";
  const label = score >= 80 ? "Good" : score >= 50 ? "Fair" : "Poor";

  return (
    <div
      aria-label={`Health score: ${score}% (${label})`}
      className={`${styles.container} ${styles[status]} ${variant === "pill" ? styles.pill : ""} ${className}`.trim()}
    >
      <Heart size={14} aria-hidden="true" className={styles.icon} />
      <span className={styles.scoreText}>
        {score}%
        <span className={styles.label}>({label})</span>
      </span>
    </div>
  );
};
