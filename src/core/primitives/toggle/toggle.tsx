"use client";

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import styles from "./toggle.module.css";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled pressed state */
  pressed?: boolean;
  /** Uncontrolled initial pressed state */
  defaultPressed?: boolean;
  /** Callback fired when pressed state transitions */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual style variant */
  variant?: "default" | "outline";
  /** Size variant aligned with control density */
  size?: "sm" | "md" | "lg";
  /** Toggle label or icon */
  children: ReactNode;
}

/**
 * `<Toggle>` — Two-state action button primitive adhering to Strata DL 3.0.
 *
 * Implements accessible `aria-pressed` semantics, density scaling, and focus states.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      variant = "default",
      size = "md",
      disabled = false,
      children,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledPressed !== undefined;
    const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
    const isPressed = isControlled ? controlledPressed : uncontrolledPressed;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isPressed;
      if (!isControlled) {
        setUncontrolledPressed(next);
      }
      onPressedChange?.(next);
      onClick?.(e);
    };

    const rootClass = [
      styles.toggle,
      styles[variant],
      styles[size],
      isPressed ? styles.pressed : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        disabled={disabled}
        data-state={isPressed ? "on" : "off"}
        className={rootClass}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = "Toggle";
