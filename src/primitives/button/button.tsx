"use client";

import { type FC, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Show loading spinner */
  isLoading?: boolean;
  /** Render as child element (for Link components) */
  asChild?: boolean;
  /** Icon to show before the label */
  leftIcon?: ReactNode;
  /** Icon to show after the label */
  rightIcon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  asChild = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || isLoading;

  const buttonClass = [styles.button, styles[size], styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Comp
      className={buttonClass || undefined}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <span className={styles.loader} aria-hidden="true" />}
      {!isLoading && leftIcon && (
        <span className={styles.iconSlot}>{leftIcon}</span>
      )}
      <span
        className={`${styles.childrenContainer} ${isLoading ? styles.hiddenText : ""}`}
      >
        {children}
      </span>
      {!isLoading && rightIcon && (
        <span className={styles.iconSlot}>{rightIcon}</span>
      )}
    </Comp>
  );
};
