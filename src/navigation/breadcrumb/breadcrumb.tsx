"use client";

import {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import { ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import styles from "./breadcrumb.module.css";

export const breadcrumbVariants = cva(styles.nav, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface BreadcrumbItem {
  key?: string;
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items?: BreadcrumbItem[];
  children?: ReactNode;
  separator?: ReactNode;
  /** Maximum visible path segments when using `items`; hidden ancestors appear in a disclosure. */
  maxVisibleItems?: number;
  className?: string;
  /** Distinguishes multiple breadcrumb landmarks on the same page. */
  "aria-label"?: string;
}

/**
 * `<Breadcrumb>` — Accessible hierarchical breadcrumb trail with WAI-ARIA nav and current-page semantics.
 * Benchmarked against Radix / shadcn Breadcrumb, Carbon Breadcrumb, and SLDS Breadcrumb.
 *
 * @maturity stable
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      children,
      maxVisibleItems,
      separator = <ChevronRight size={12} className={styles.separatorIcon} aria-hidden="true" />,
      density = "standard",
      className = "",
      "aria-label": ariaLabel = "Breadcrumb",
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-slot="breadcrumb"
        data-density={density}
        className={breadcrumbVariants({ density, className })}
        {...props}
      >
        {items ? (
          <ol data-slot="breadcrumb-list" className={styles.list}>
            {(() => {
              const shouldCollapse =
                typeof maxVisibleItems === "number" &&
                Number.isInteger(maxVisibleItems) &&
                maxVisibleItems >= 2 &&
                items.length > maxVisibleItems;
              const visibleCount = shouldCollapse ? maxVisibleItems! : items.length;
              const hiddenEnd = shouldCollapse ? items.length - visibleCount + 1 : 0;
              const hiddenItems = shouldCollapse ? items.slice(1, hiddenEnd) : [];
              const visibleItems = shouldCollapse
                ? [...items.slice(0, 1), ...items.slice(hiddenEnd)]
                : items;
              const renderItem = (item: BreadcrumbItem, isLast: boolean) => (
                <>
                  {isLast && !item.href && !item.onClick ? (
                    <span
                      data-slot="breadcrumb-page"
                      className={`${styles.text} ${styles.current}`}
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      data-slot="breadcrumb-link"
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
                    <button
                      type="button"
                      data-slot="breadcrumb-link"
                      onClick={item.onClick}
                      className={`${styles.link} ${isLast ? styles.current : ""}`.trim()}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span data-slot="breadcrumb-page" className={styles.text}>
                      {item.label}
                    </span>
                  )}
                </>
              );

              const renderListItem = (item: BreadcrumbItem, originalIndex: number, isLast: boolean) => (
                <li key={item.key || originalIndex} data-slot="breadcrumb-item" className={styles.item}>
                  {renderItem(item, originalIndex === items.length - 1)}
                  {!isLast && (
                    <span data-slot="breadcrumb-separator" className={styles.separator} aria-hidden="true">
                      {separator}
                    </span>
                  )}
                </li>
              );

              const collapsedDisclosure = shouldCollapse ? (
                <li data-slot="breadcrumb-item" className={`${styles.item} ${styles.collapsed}`}>
                  <details className={styles.disclosure}>
                    <summary
                      role="button"
                      className={styles.disclosureTrigger}
                      aria-label={`Show ${hiddenItems.length} hidden breadcrumb ${hiddenItems.length === 1 ? "level" : "levels"}`}
                      title="Show hidden breadcrumb levels"
                    >
                      <span aria-hidden="true">…</span>
                    </summary>
                    <ol className={styles.disclosureList}>
                      {hiddenItems.map((item, index) => (
                        <li key={item.key || index} className={styles.disclosureItem}>
                          {renderItem(item, false)}
                        </li>
                      ))}
                    </ol>
                  </details>
                  <span data-slot="breadcrumb-separator" className={styles.separator} aria-hidden="true">
                    {separator}
                  </span>
                </li>
              ) : null;

              return (
                <>
                  {shouldCollapse ? (
                    <>
                      {renderListItem(visibleItems[0]!, 0, false)}
                      {collapsedDisclosure}
                      {visibleItems.slice(1).map((item, index) => {
                        const originalIndex = hiddenEnd + index;
                        return renderListItem(item, originalIndex, index === visibleItems.length - 2);
                      })}
                    </>
                  ) : (
                    visibleItems.map((item, index) => renderListItem(item, index, index === visibleItems.length - 1))
                  )}
                </>
              );
            })()}
          </ol>
        ) : (
          <ol data-slot="breadcrumb-list" className={styles.list}>
            {children}
          </ol>
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

/** Sub-components for compound composition */
export const BreadcrumbList = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} data-slot="breadcrumb-list" className={cn(styles.list, className)} {...props} />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} data-slot="breadcrumb-item" className={cn(styles.item, className)} {...props} />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a ref={ref} data-slot="breadcrumb-link" className={cn(styles.link, className)} {...props} />
  )
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn(styles.text, styles.current, className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn(styles.separator, className)}
    {...props}
  >
    {children ?? <ChevronRight size={12} className={styles.separatorIcon} />}
  </span>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
