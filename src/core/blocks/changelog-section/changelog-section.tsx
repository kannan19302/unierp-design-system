"use client";

import React from "react";
import styles from "./changelog-section.module.css";

export interface ChangelogSectionProps { entries: PublicChangelogEntry[]; showAll?: boolean; }
export interface PublicChangelogEntry { version: string; date: string; title: string; items: string[]; }

export const ChangelogSection: React.FC<ChangelogSectionProps> = (props) => {
  const { entries, showAll = false } = props;
  const [expanded, setExpanded] = React.useState(showAll);
  const visible = expanded ? entries : entries.slice(0, 3);
  return (
    <div className={styles.container} role="region" aria-label="Changelog">
      <h3 className={styles.title}>What's New</h3>
      <div className={styles.content}>
        {visible.map((e, i) => (
          <div key={i} className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className={styles.tag}>{e.version}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{e.date}</span>
            </div>
            <div style={{ fontWeight: 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>{e.title}</div>
            <ul style={{ margin: 'var(--space-1) 0 0', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {e.items.map((item, ii) => <li key={ii}>{item}</li>)}
            </ul>
          </div>
        ))}
        {!expanded && entries.length > 3 && <button className={styles.btn} onClick={() => setExpanded(true)}>View All Releases →</button>}
      </div>
    </div>
  );
};
