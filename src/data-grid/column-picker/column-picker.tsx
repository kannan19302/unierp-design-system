"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../primitives/button";
import styles from "./column-picker.module.css";

export interface ColumnPickerOption {
  key: string;
  label: ReactNode;
}

export interface ColumnPickerProps {
  options: ColumnPickerOption[];
  /** Keys currently visible */
  visible: string[];
  onChange: (visible: string[]) => void;
  label?: string;
}

/** Dropdown checklist to show/hide table columns. Controlled. */
export function ColumnPicker({
  options,
  visible,
  onChange,
  label = "Columns",
}: ColumnPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={rootRef}
      className={styles.container}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
      </Button>
      {open && (
        <div
          role="menu"
          className={styles.dropdown}
        >
          {options.map((o) => (
            <label
              key={o.key}
              className={styles.checkboxItem}
            >
              <input
                type="checkbox"
                checked={visible.includes(o.key)}
                onChange={() => toggle(o.key)}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
