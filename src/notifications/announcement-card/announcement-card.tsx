"use client";

import { forwardRef } from "react";
import styles from "./announcement-card.module.css";

export interface AnnouncementCardProps {
  title: string;
  body: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  onDismiss?: () => void;
  variant?: "info" | "feature" | "update";
  className?: string;
}

/**
 * AnnouncementCard component for product announcements, release highlights, and feature teasers.
 *
 * @maturity stable
 */
export const AnnouncementCard = forwardRef<HTMLDivElement, AnnouncementCardProps>(function AnnouncementCard(
  {
    title,
    body,
    ctaLabel,
    onCtaClick,
    onDismiss,
    variant = "info",
    className = "",
  },
  ref
) {
  const gradients = {
    info: "linear-gradient(135deg, var(--color-info-subtle), var(--color-bg-elevated))",
    feature: "linear-gradient(135deg, var(--color-brand-subtle), var(--color-bg-elevated))",
    update: "linear-gradient(135deg, var(--color-success-subtle), var(--color-bg-elevated))",
  };

  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`.trim()}
      role="article"
      aria-label={title}
      style={{ background: gradients[variant] }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ minInlineSize: 0 }}>
          <div style={{ fontWeight: "var(--weight-bold, 700)", fontSize: "var(--text-base)" }}>
            {title}
          </div>
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              marginBlockStart: "var(--space-1)",
            }}
          >
            {body}
          </div>
          {ctaLabel && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={onCtaClick}
              style={{ marginBlockStart: "var(--space-3)" }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-tertiary)",
              fontSize: "var(--text-lg)",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

AnnouncementCard.displayName = "AnnouncementCard";
