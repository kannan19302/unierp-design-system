import { forwardRef, type CSSProperties, type FC } from "react";
import styles from "./skeleton.module.css";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  circle?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * `<Skeleton>` — Animated placeholder element simulating content loading geometry.
 * @maturity stable
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(({
  width = "100%",
  height = 16,
  radius,
  circle = false,
  className = "",
  style,
}, ref) => {
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
      ref={ref}
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
});

Skeleton.displayName = "Skeleton";

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
