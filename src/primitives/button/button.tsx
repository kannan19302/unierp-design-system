import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Show loading spinner */
  isLoading?: boolean;
  /** Render as child element (for polymorphic Link components) */
  asChild?: boolean;
  /** Icon to show before the label */
  leftIcon?: ReactNode;
  /** Icon to show after the label */
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = Boolean(disabled || isLoading);

    const buttonClass = [styles.button, styles[size], styles[variant], className]
      .filter(Boolean)
      .join(" ");

    // Handle polymorphic composition via Radix Slot
    if (asChild && isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, any>>;
      const isAnchor = typeof child.type === "string" && child.type === "a";

      const handleChildClick = (e: MouseEvent<any>) => {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        child.props.onClick?.(e);
        onClick?.(e as any);
      };

      const composedChildren = (
        <>
          {isLoading && <span className={styles.loader} aria-hidden="true" />}
          {!isLoading && leftIcon && (
            <span className={styles.iconSlot}>{leftIcon}</span>
          )}
          <span
            className={`${styles.childrenContainer} ${isLoading ? styles.hiddenText : ""}`}
          >
            {child.props.children}
          </span>
          {!isLoading && rightIcon && (
            <span className={styles.iconSlot}>{rightIcon}</span>
          )}
        </>
      );

      return (
        <Slot
          ref={ref}
          className={buttonClass || undefined}
          aria-disabled={isDisabled ? true : undefined}
          aria-busy={isLoading ? true : undefined}
          tabIndex={isDisabled && isAnchor ? -1 : child.props.tabIndex}
          {...props}
          onClick={handleChildClick}
        >
          {cloneElement(child, {
            ...child.props,
            disabled: !isAnchor && isDisabled ? true : undefined,
            children: composedChildren,
          })}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClass || undefined}
        disabled={isDisabled}
        aria-busy={isLoading ? true : undefined}
        onClick={onClick}
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
      </button>
    );
  },
);

Button.displayName = "Button";
