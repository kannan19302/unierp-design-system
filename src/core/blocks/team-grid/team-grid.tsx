"use client";

import React from "react";
import styles from "./team-grid.module.css";

export interface TeamGridProps { members: TeamMember[]; title?: string; }
export interface TeamMember { name: string; role: string; initials: string; }

export const TeamGrid: React.FC<TeamGridProps> = (props) => {
  const { members, title = 'Our Team' } = props;
  return (
    <div className={styles.container} role="region" aria-label={title}>
      <h3 className={styles.title} style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>{title}</h3>
      <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--space-36, 9.375rem), 1fr))', justifyItems: 'center' }}>
        {members.map((m, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold, 700)', color: 'var(--color-brand)', margin: '0 auto' }}>{m.initials}</div>
            <div style={{ fontWeight: 'var(--weight-semibold, 600)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>{m.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{m.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
