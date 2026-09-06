"use client";

import React from "react";
import styles from "./hierarchical-picker-form.module.css";

export interface HierarchicalPickerFormProps { levels: PickerLevel[]; onChange?: (path: string[]) => void; }
export interface PickerLevel { label: string; options: Record<string, string[]>; }

export const HierarchicalPickerForm: React.FC<HierarchicalPickerFormProps> = (props) => {
  const { levels, onChange } = props;
  const [selected, setSelected] = React.useState<string[]>([]);
  const handleChange = (levelIdx: number, value: string) => {
    const next = [...selected.slice(0, levelIdx), value];
    setSelected(next);
    onChange?.(next);
  };
  return (
    <div className={styles.container} role="group" aria-label="Hierarchical picker">
      <div className={styles.content}>
        {levels.map((level, li) => {
          const parentKey = li === 0 ? '_root' : selected[li - 1] || '';
          const opts = level.options[parentKey] || level.options['_root'] || [];
          if (li > 0 && !selected[li - 1]) return null;
          return (
            <div key={li} className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{level.label}</label>
              <select className={styles.select} value={selected[li] || ''} onChange={e => handleChange(li, e.target.value)} aria-label={level.label}>
                <option value="">Select {level.label}...</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};
