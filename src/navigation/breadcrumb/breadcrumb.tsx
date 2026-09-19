import { forwardRef, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./breadcrumb.module.css";

export interface BreadcrumbItem {
  key?: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

/**
 * `<Breadcrumb>` — Accessible hierarchical breadcrumb trail with WAI-ARIA nav and current-page semantics.
 * @maturity stable
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({
  items,
  separator = <ChevronRight size={12} className={styles.separatorIcon} aria-hidden="true" />,
  className = "",
}, ref) => {
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={`${styles.nav} ${className}`.trim()}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.key || index} className={styles.item}>
              {item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className={`${styles.link} ${isLast ? styles.current : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  onClick={item.onClick}
                  className={`${styles.text} ${isLast ? styles.current : ""} ${
                    item.onClick ? styles.clickable : ""
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className={styles.separator} aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";
