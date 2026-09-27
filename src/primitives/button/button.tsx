import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./button.module.css";

/**
 * Class variance authority definitions for Button.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      default: styles.primary,
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      ghost: styles.ghost,
      destructive: styles.destructive,
      danger: styles.danger,
      link: styles.link,
    },
    size: {
      default: styles.md,
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      icon: styles.icon,
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Visual style variant */
  variant?:
    | "primary"
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "destructive"
    | "link";
  /** Size of the button */
  size?: "sm" | "md" | "default" | "lg" | "icon";
  /** Show loading spinner */
  isLoading?: boolean;
  /** Render as child element (for polymorphic Link components) */
  asChild?: boolean;
  /** Icon to show before the label */
  leftIcon?: ReactNode;
  /** Icon to show after the label */
  rightIcon?: ReactNode;
}

/**
 * `<Button>` — Primary enterprise action element supporting multiple variants, loading states, and icons.
 * Follows shadcn/ui and Strata design system standards with full cva, data-slot, and APG compliance.
 * @maturity stable
 */
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
    const buttonClass = buttonVariants({ variant, size, className });

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
          {isLoading && (
            <span className={styles.loader} data-slot="spinner" aria-hidden="true" />
          )}
          {!isLoading && leftIcon && (
            <span className={styles.iconSlot} data-slot="icon">
              {leftIcon}
            </span>
          )}
          <span
            data-slot="label"
            className={`${styles.childrenContainer} ${isLoading ? styles.hiddenText : ""}`}
          >
            {child.props.children}
          </span>
          {!isLoading && rightIcon && (
            <span className={styles.iconSlot} data-slot="icon">
              {rightIcon}
            </span>
          )}
        </>
      );

      return (
        <Slot
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          data-loading={isLoading ? "true" : undefined}
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
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={isLoading ? "true" : undefined}
        className={buttonClass || undefined}
        disabled={isDisabled}
        aria-busy={isLoading ? true : undefined}
        onClick={onClick}
        {...props}
      >
        {isLoading && (
          <span className={styles.loader} data-slot="spinner" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className={styles.iconSlot} data-slot="icon">
            {leftIcon}
          </span>
        )}
        <span
          data-slot="label"
          className={`${styles.childrenContainer} ${isLoading ? styles.hiddenText : ""}`}
        >
          {children}
        </span>
        {!isLoading && rightIcon && (
          <span className={styles.iconSlot} data-slot="icon">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
