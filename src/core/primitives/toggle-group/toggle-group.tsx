"use client";

import {
  createContext,
  useContext,
  forwardRef,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import styles from "./toggle-group.module.css";

interface ToggleGroupContextValue {
  type: "single" | "multiple";
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  size: "sm" | "md" | "lg";
  variant: "default" | "outline";
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Selection mode */
  type?: "single" | "multiple";
  /** Controlled value (string for single, string[] for multiple) */
  value?: string | string[];
  /** Default value for uncontrolled usage */
  defaultValue?: string | string[];
  /** Callback fired on value change */
  onValueChange?: (value: any) => void;
  /** Sizing aligned with control density */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "outline";
  /** Disabled state for all child items */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * `<ToggleGroup>` — Composable group container for mutually exclusive or multiple toggle options.
 *
 * Adheres to Strata DL 3.0 / shadcn compound component pattern.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type = "single",
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = "md",
      variant = "default",
      disabled = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
      defaultValue ?? (type === "single" ? "" : [])
    );

    const currentValue = isControlled ? controlledValue! : uncontrolledValue;

    const handleItemToggle = (itemValue: string) => {
      if (type === "single") {
        const next = currentValue === itemValue ? "" : itemValue;
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      } else {
        const currentArr = Array.isArray(currentValue) ? currentValue : [];
        const next = currentArr.includes(itemValue)
          ? currentArr.filter((v) => v !== itemValue)
          : [...currentArr, itemValue];
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      }
    };

    const rootClass = [
      styles.group,
      styles[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <ToggleGroupContext.Provider
        value={{
          type,
          value: currentValue,
          onItemToggle: handleItemToggle,
          size,
          variant,
          disabled,
        }}
      >
        <div ref={ref} role="group" className={rootClass} {...props}>
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Value identifying this item */
  value: string;
  /** Child content (icon or label) */
  children: ReactNode;
}

/**
 * `<ToggleGroupItem>` — Individual item within a ToggleGroup.
 */
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, children, disabled: itemDisabled, className = "", onClick, ...props }, ref) => {
    const ctx = useContext(ToggleGroupContext);
    if (!ctx) {
      throw new Error("ToggleGroupItem must be used within a ToggleGroup");
    }

    const isSelected =
      ctx.type === "single"
        ? ctx.value === value
        : Array.isArray(ctx.value) && ctx.value.includes(value);

    const isDisabled = Boolean(ctx.disabled || itemDisabled);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      ctx.onItemToggle(value);
      onClick?.(e);
    };

    const itemClass = [
      styles.item,
      styles[ctx.variant],
      styles[ctx.size],
      isSelected ? styles.selected : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-pressed={isSelected}
        data-state={isSelected ? "on" : "off"}
        disabled={isDisabled}
        className={itemClass}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";
