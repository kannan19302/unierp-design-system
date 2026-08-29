"use client";

import { type FC, type CSSProperties } from "react";
import styles from "./skeleton.module.css";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  circle?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Skeleton: FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  radius,
  circle = false,
  className = "",
  style,
}) => {
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;

  const skeletonClass = [
    styles.skeleton,
    circle ? styles.circle : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      aria-hidden="true"
      className={skeletonClass}
      style={
        {
          "--skeleton-w": w,
          "--skeleton-h": h,
          ...(radius ? { "--skeleton-r": radius } : {}),
          ...style,
        } as CSSProperties
      }
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: FC<SkeletonTextProps> = ({
  lines = 3,
  className = "",
}) => (
  <span className={`${styles.textContainer} ${className}`.trim()}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={12}
        width={i === lines - 1 ? "60%" : "100%"}
      />
    ))}
  </span>
);
