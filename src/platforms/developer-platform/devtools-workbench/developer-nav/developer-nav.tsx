import React from 'react';
import styles from './developer-nav.module.css';

export interface DeveloperNavItem {
  key: string;
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DeveloperNavProps {
  items: DeveloperNavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  className?: string;
}

export const DeveloperNav: React.FC<DeveloperNavProps> = ({
  items,
  currentPath = '',
  onNavigate,
  className = '',
}) => {
  return (
    <nav className={`${styles.nav} ${className}`.trim()} aria-label="Developer navigation">
      {items.map((item) => {
        const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
        return (
          <a
            key={item.key}
            href={item.href}
            className={`${styles.item} ${active ? styles.itemActive : ''}`.trim()}
            aria-current={active ? 'page' : undefined}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.href);
              }
            }}
          >
            {item.icon && <span className={styles.iconSlot}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};
