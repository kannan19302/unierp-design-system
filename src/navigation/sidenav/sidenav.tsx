"use client";

import { type FC, type ReactNode } from "react";
import styles from "./sidenav.module.css";

export interface SideNavItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SideNavProps {
  items: SideNavItem[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const SideNav: FC<SideNavProps> = ({
  items,
  header,
  footer,
  className = "",
}) => {
  return (
    <aside
      aria-label="Side Navigation"
      className={`${styles.container} ${className}`.trim()}
    >
      {header && <div className={styles.header}>{header}</div>}
      <nav className={styles.nav}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={item.disabled}
            onClick={item.onClick}
            className={`${styles.itemBtn} ${item.active ? styles.active : ""}`}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </button>
        ))}
      </nav>
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
};
