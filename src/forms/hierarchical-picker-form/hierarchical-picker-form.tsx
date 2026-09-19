"use client";

import {
  useState,
  useId,
  forwardRef,
  type HTMLAttributes,
} from "react";
import styles from "./hierarchical-picker-form.module.css";

export interface PickerLevel {
  label: string;
  options: Record<string, string[]>;
}

export interface HierarchicalPickerFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  levels: PickerLevel[];
  initialPath?: string[];
  onChange?: (path: string[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * `<HierarchicalPickerForm>` walks multi-tier organizational charts, cost center taxonomy,
 * and product category hierarchies via cascaded dependant dropdown levels.
 *
 * @maturity stable
 */
export const HierarchicalPickerForm = forwardRef<
  HTMLDivElement,
  HierarchicalPickerFormProps
>(
  (
    {
      levels,
      initialPath = [],
      onChange,
      title = "Hierarchical Taxonomy Selection",
      subtitle,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const baseId = useId();
    const [selected, setSelected] = useState<string[]>(initialPath);

    const handleChange = (levelIdx: number, value: string) => {
      const next = value
        ? [...selected.slice(0, levelIdx), value]
        : selected.slice(0, levelIdx);
      setSelected(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="group"
        aria-label={title}
        {...restProps}
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <div className={styles.content}>
          {levels.map((level, li) => {
            const parentKey = li === 0 ? "_root" : selected[li - 1] || "";
            const opts = level.options[parentKey] || level.options["_root"] || [];
            if (li > 0 && !selected[li - 1]) return null;

            const inputId = `${baseId}-level-${li}`;

            return (
              <div key={li} className={styles.fieldGroup}>
                <label htmlFor={inputId} className={styles.fieldLabel}>
                  {level.label}
                </label>
                <select
                  id={inputId}
                  className={styles.select}
                  value={selected[li] || ""}
                  onChange={(e) => handleChange(li, e.target.value)}
                >
                  <option value="">Select {level.label}...</option>
                  {opts.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {selected.length > 0 && (
            <div className={styles.pathBreadcrumb} aria-live="polite">
              <span>Selected Hierarchy:</span>
              <span className={styles.pathSegment}>{selected.join(" › ")}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HierarchicalPickerForm.displayName = "HierarchicalPickerForm";
