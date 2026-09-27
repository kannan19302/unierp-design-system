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
  /** Distinguishes multiple breadcrumb landmarks on the same page. */
  "aria-label"?: string;
}

/**
 * `<Breadcrumb>` — Accessible hierarchical breadcrumb trail with WAI-ARIA nav and current-page semantics.
 * @maturity stable
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(({
  items,
  separator = <ChevronRight size={12} className={styles.separatorIcon} aria-hidden="true" />,
  className = "",
  "aria-label": ariaLabel = "Breadcrumb",
}, ref) => {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={`${styles.nav} ${className}`.trim()}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.key || index} className={styles.item}>
              {isLast && !item.href && !item.onClick ? (
                <span className={`${styles.text} ${styles.current}`} aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className={`${styles.link} ${isLast ? styles.current : ""}`.trim()}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button type="button" onClick={item.onClick} className={`${styles.link} ${isLast ? styles.current : ""}`.trim()} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </button>
              ) : (
                <span className={styles.text}>{item.label}</span>
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
