"use client";

import React, { forwardRef } from "react";
import styles from "./embedded-report-frame.module.css";

export interface EmbeddedReportFrameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  src?: string;
  height?: number | string;
  loading?: boolean;
  error?: string;
}

/**
 * EmbeddedReportFrame
 *
 * Secure container frame for embedding third-party BI reports, PowerBI/Tableau
 * dashboards, or external analytical canvases with sandboxed security policies.
 *
 * @maturity stable
 */
export const EmbeddedReportFrame = forwardRef<
  HTMLDivElement,
  EmbeddedReportFrameProps
>(function EmbeddedReportFrame(
  {
    title,
    src,
    height = 400,
    loading = false,
    error,
    className,
    ...restProps
  },
  ref
) {
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  const frameHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      ref={ref}
      className={containerClasses}
      role="region"
      aria-label={title}
      {...restProps}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      {loading ? (
        <div className={styles.empty}>Loading report...</div>
      ) : error ? (
        <div className={styles.empty} style={{ color: "var(--color-error)" }}>
          {error}
        </div>
      ) : src ? (
        <div
          className={styles.framePlaceholder}
          style={{ blockSize: frameHeight }}
        >
          Embedded Report: {src}
        </div>
      ) : (
        <div className={styles.empty}>No report configured</div>
      )}
    </div>
  );
});

EmbeddedReportFrame.displayName = "EmbeddedReportFrame";
