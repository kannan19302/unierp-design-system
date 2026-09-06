"use client";

import React from "react";
import styles from "./inbox-notification-stream.module.css";

export interface InboxNotificationStreamProps { items: InboxItem[]; onMarkAllRead?: () => void; onItemClick?: (id: string) => void; }
export interface InboxItem { id: string; title: string; body: string; timestamp: string; read: boolean; icon?: string; }

export const InboxNotificationStream: React.FC<InboxNotificationStreamProps> = (props) => {
  const { items, onMarkAllRead, onItemClick } = props;
  const unread = items.filter(i => !i.read).length;
  return (
    <div className={styles.container} role="region" aria-label="Notification inbox">
      <div className={styles.header}><h3 className={styles.title}>Notifications {unread > 0 && <span className={styles.badge} style={{ background: 'var(--color-error-subtle)', color: 'var(--color-error)' }}>{unread}</span>}</h3>{onMarkAllRead && <button className={styles.btn} onClick={onMarkAllRead} style={{ fontSize: 'var(--text-xs)' }}>Mark all read</button>}</div>
      <div className={styles.content}>
        {items.map(item => (
          <div key={item.id} className={styles.item} onClick={() => onItemClick?.(item.id)} style={{ cursor: 'pointer', opacity: item.read ? 0.7 : 1 }}>
            <span style={{ fontSize: 'var(--text-lg)' }}>{item.icon || '🔔'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: item.read ? 'normal' : 'var(--weight-semibold, 600)', fontSize: 'var(--text-sm)' }}>{item.title}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{item.body}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>{item.timestamp}</div>
            </div>
            {!item.read && <span className={styles.dot} style={{ background: 'var(--color-brand)' }} />}
          </div>
        ))}
      </div>
    </div>
  );
};
