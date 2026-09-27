"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./card.module.css";

/**
 * Class variance authority definitions for Card.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const cardVariants = cva(styles.card, {
  variants: {
    padding: {
      none: styles.p_none,
      sm: styles.p_sm,
      md: styles.p_md,
      lg: styles.p_lg,
    },
    hover: {
      true: styles.hoverable,
      false: "",
    },
  },
  defaultVariants: {
    padding: "md",
    hover: false,
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Card component providing standard surface elevation, borders, and structured padding.
 * Follows shadcn/ui and Strata design system standards with full cva, data-slot, and compound sub-components.
 *
 * @maturity stable
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      padding = "md",
      hover = false,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const cardClass = cardVariants({ padding, hover, className });

    return (
      <div
        ref={ref}
        data-slot="card"
        data-padding={padding}
        data-hover={hover ? "true" : undefined}
        className={cardClass || undefined}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={`${styles.cardHeader || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = "", ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={`${styles.cardTitle || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = "", ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={`${styles.cardDescription || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={`${styles.cardContent || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={`${styles.cardFooter || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";
