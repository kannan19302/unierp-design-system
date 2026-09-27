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
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./toggle-group.module.css";

export const toggleGroupVariants = cva(styles.group, {
  variants: {
    variant: {
      default: styles.default,
      outline: styles.outline,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const toggleGroupItemVariants = cva(styles.item, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    variant: {
      default: "",
      outline: styles.outline,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface ToggleGroupContextValue {
  type: "single" | "multiple";
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  size: "sm" | "md" | "lg";
  variant: "default" | "outline";
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    VariantProps<typeof toggleGroupVariants> {
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
 * Standardized with cva, data-slot, and W3C APG radiogroup/toolbar pattern.
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

    const rootClass = `${toggleGroupVariants({ variant })} ${className}`.trim();

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
        <div
          ref={ref}
          role={type === "single" ? "radiogroup" : "group"}
          data-slot="toggle-group"
          data-type={type}
          data-variant={variant}
          data-size={size}
          className={rootClass}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleGroupItemVariants> {
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
      toggleGroupItemVariants({ size: ctx.size, variant: ctx.variant }),
      isSelected ? styles.selected : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        role={ctx.type === "single" ? "radio" : "checkbox"}
        aria-checked={isSelected}
        data-slot="toggle-group-item"
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

// Compound component pattern attachment
(ToggleGroup as any).Item = ToggleGroupItem;
