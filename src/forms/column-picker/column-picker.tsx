"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";
import { Button } from "../../primitives/button";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./column-picker.module.css";

export interface ColumnPickerOption {
  key: string;
  label: ReactNode;
}

export const columnPickerVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type ColumnPickerDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface ColumnPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof columnPickerVariants> {
  options: ColumnPickerOption[];
  /** Keys currently visible */
  visible: string[];
  onChange: (visible: string[]) => void;
  label?: string;
  className?: string;
  density?: ColumnPickerDensity;
}

/**
 * `<ColumnPicker>` — Dropdown checklist to show/hide table columns. Controlled.
 *
 * @maturity stable
 */
export const ColumnPicker = forwardRef<HTMLDivElement, ColumnPickerProps>(
  (
    {
      options,
      visible,
      onChange,
      label = "Columns",
      className = "",
      density = "standard",
      ...restProps
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node))
          setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const toggle = (key: string) => {
      const next = visible.includes(key)
        ? visible.filter((k) => k !== key)
        : [...visible, key];
      // Never allow hiding every column
      if (next.length === 0) return;
      onChange(next);
    };

    const buttonSize =
      density === "ultra-compact"
        ? "sm"
        : density === "compact"
        ? "sm"
        : density === "comfortable"
        ? "lg"
        : "sm";

    return (
      <div
        ref={rootRef}
        data-slot="column-picker"
        data-density={density}
        className={columnPickerVariants({ density, className })}
        {...restProps}
      >
        <Button
          variant="secondary"
          size={buttonSize}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
          data-slot="column-picker-trigger"
        >
          {label}
        </Button>
        {open && (
          <div
            role="menu"
            className={styles.dropdown}
            data-slot="column-picker-dropdown"
          >
            {options.map((o) => (
              <label
                key={o.key}
                className={styles.checkboxItem}
                data-slot="column-picker-item"
              >
                <input
                  type="checkbox"
                  checked={visible.includes(o.key)}
                  onChange={() => toggle(o.key)}
                  data-slot="column-picker-checkbox"
                />
                <span data-slot="column-picker-label">{o.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ColumnPicker.displayName = "ColumnPicker";
