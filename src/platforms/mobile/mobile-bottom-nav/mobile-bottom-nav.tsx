import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./mobile-bottom-nav.module.css";

export interface MobileNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
}

export interface MobileBottomNavProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items?: MobileNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export const MobileBottomNav = forwardRef<HTMLElement, MobileBottomNavProps>(
  (
    {
      items = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "orders", label: "Orders", icon: "📋", badge: 3 },
        { id: "inventory", label: "Stock", icon: "📦" },
        { id: "profile", label: "Account", icon: "👤" },
      ],
      activeId = "home",
      onSelect,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={`${styles.nav} ${className}`}
        role="navigation"
        aria-label="Mobile Bottom Navigation"
        {...props}
      >
        <div className={styles.bar}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.itemBtn} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect?.(item.id)}
              >
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{item.icon}</span>
                  {item.badge !== undefined && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </div>
                <span className={styles.label}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }
);

MobileBottomNav.displayName = "MobileBottomNav";
