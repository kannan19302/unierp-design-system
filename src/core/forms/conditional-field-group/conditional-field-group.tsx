"use client";

import {
  useState,
  useId,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ChangeEvent,
} from "react";
import styles from "./conditional-field-group.module.css";

export interface ConditionalFieldGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  triggerLabel: string;
  triggerOptions: string[];
  groups: Record<string, ReactNode>;
  defaultOption?: string;
  onChange?: (selected: string) => void;
  className?: string;
}

/**
 * `<ConditionalFieldGroup>` dynamically mounts and unmounts polymorphic input sub-forms
 * based on master discriminant selections (e.g. payment method, tax regime, entity category).
 *
 * @maturity stable
 */
export const ConditionalFieldGroup = forwardRef<
  HTMLDivElement,
  ConditionalFieldGroupProps
>(
  (
    {
      triggerLabel,
      triggerOptions,
      groups,
      defaultOption = "",
      onChange,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const selectId = useId();
    const [selected, setSelected] = useState(defaultOption);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSelected(val);
      onChange?.(val);
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="group"
        aria-label={`${triggerLabel} Group`}
        {...restProps}
      >
        <div className={styles.fieldGroup}>
          <label htmlFor={selectId} className={styles.fieldLabel}>
            {triggerLabel}
          </label>
          <select
            id={selectId}
            className={styles.select}
            value={selected}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {triggerOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {selected && groups[selected] && (
          <div className={styles.section} role="region" aria-label={`${selected} Details`}>
            {groups[selected]}
          </div>
        )}
      </div>
    );
  }
);

ConditionalFieldGroup.displayName = "ConditionalFieldGroup";
