"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import styles from "./progress-hud.module.css";

export interface ProgressHUDItem {
  key: string;
  label: string;
  isCompleted: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ProgressHUDProps {
  percentComplete: number;
  items: ProgressHUDItem[];
  onActionClick?: (item: ProgressHUDItem) => void;
  onDismiss?: () => void;
  title?: string;
}

export const ProgressHUD: React.FC<ProgressHUDProps> = ({
  percentComplete,
  items,
  onActionClick,
  title = "Setup Checklist",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, percentComplete)) / 100) * circumference;

  const isAllComplete = percentComplete >= 100;

  return (
    <div
      ref={containerRef}
      className={styles.hudContainer}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label="Onboarding Progress Indicator"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
    >
      <div className={styles.gaugeWrapper}>
        <svg className={styles.gaugeSvg} viewBox="0 0 28 28">
          <circle
            className={styles.gaugeBackground}
            cx="14"
            cy="14"
            r={radius}
          />
          <circle
            className={styles.gaugeProgress}
            cx="14"
            cy="14"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>

      <span className={styles.hudLabel}>{title}</span>
      <span className={styles.hudPercent}>{percentComplete}%</span>

      {isAllComplete ? (
        <span className={styles.hudBadgeComplete}>
          <Sparkles size={14} />
        </span>
      ) : isOpen ? (
        <ChevronUp size={14} />
      ) : (
        <ChevronDown size={14} />
      )}

      {isOpen && (
        <div
          className={styles.drawer}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>Onboarding Milestones</span>
            <span className={styles.hudPercent}>{percentComplete}% Completed</span>
          </div>

          <ul className={styles.drawerList}>
            {items.map((item) => (
              <li
                key={item.key}
                className={`${styles.drawerItem} ${
                  item.isCompleted ? styles.drawerItemCompleted : ""
                }`}
              >
                <div className={styles.drawerItemLeft}>
                  {item.isCompleted ? (
                    <CheckCircle2 size={14} color="var(--color-success, #16a34a)" />
                  ) : (
                    <Circle size={14} color="var(--color-text-tertiary, #94a3b8)" />
                  )}
                  <span>{item.label}</span>
                </div>

                {!item.isCompleted && item.actionLabel && (
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => onActionClick?.(item)}
                  >
                    {item.actionLabel}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
