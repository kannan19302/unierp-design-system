"use client";

import React from "react";
import styles from "./conditional-field-group.module.css";

export interface ConditionalFieldGroupProps { triggerLabel: string; triggerOptions: string[]; groups: Record<string, React.ReactNode>; }

export const ConditionalFieldGroup: React.FC<ConditionalFieldGroupProps> = (props) => {
  const { triggerLabel, triggerOptions, groups } = props;
  const [selected, setSelected] = React.useState('');
  return (
    <div className={styles.container} role="group" aria-label="Conditional field group">
      <div className={styles.fieldGroup}><label className={styles.fieldLabel}>{triggerLabel}</label><select className={styles.select} value={selected} onChange={e => setSelected(e.target.value)} aria-label={triggerLabel}><option value="">Select...</option>{triggerOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
      {selected && groups[selected] && <div className={styles.section}>{groups[selected]}</div>}
    </div>
  );
};
