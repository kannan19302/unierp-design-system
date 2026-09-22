"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import styles from "./card.module.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Card component providing standard surface elevation, borders, and structured padding.
 *
 * @maturity stable
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  padding = "md",
  hover = false,
  className = "",
  style,
  ...props
}, ref) => {
  const cardClass = [
    styles.card,
    styles[`p_${padding}`],
    hover ? styles.hoverable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cardClass || undefined} style={style} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";
