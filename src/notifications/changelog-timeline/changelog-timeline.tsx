"use client";

import React from "react";
import styles from "./changelog-timeline.module.css";

export interface ChangelogTimelineProps { entries: ChangelogEntry[]; }
export interface ChangelogEntry { version: string; date: string; changes: { type: 'feat' | 'fix' | 'breaking'; text: string }[]; }

export const ChangelogTimeline: React.FC<ChangelogTimelineProps> = (props) => {
  const { entries } = props;
  const typeColors = { feat: 'var(--color-success)', fix: 'var(--color-info)', breaking: 'var(--color-error)' };
  const typeLabels = { feat: 'New', fix: 'Fix', breaking: '⚠ Breaking' };
  return (
    <div className={styles.container} role="region" aria-label="Changelog timeline">
      <h3 className={styles.title}>Changelog</h3>
      <div className={styles.content}>
        {entries.map((e, i) => (
          <div key={i} className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className={styles.tag}>{e.version}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{e.date}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {e.changes.map((c, ci) => (
                <li key={ci} style={{ fontSize: 'var(--text-sm)' }}>
                  <span style={{ fontWeight: 'var(--weight-semibold, 600)', color: typeColors[c.type], fontSize: 'var(--text-xs)', marginRight: 'var(--space-1)' }}>[{typeLabels[c.type]}]</span>
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
