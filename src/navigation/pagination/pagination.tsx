"use client";

import React, {
  forwardRef,
  type FC,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { cn } from "../../foundation/utils/cn";
import styles from "./pagination.module.css";

export const paginationVariants = cva(styles.container, {
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

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange">,
    VariantProps<typeof paginationVariants> {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}

const PageBtn: FC<{
  label: ReactNode;
  target: number;
  disabled: boolean;
  active?: boolean;
  onClick: (target: number) => void;
  ariaLabel?: string;
  dataSlot?: string;
}> = ({ label, target, disabled, active = false, onClick, ariaLabel, dataSlot = "pagination-button" }) => {
  const btnClass = [
    styles.pageBtn,
    active ? styles.active : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      data-slot={dataSlot}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      onClick={() => onClick(target)}
      className={btnClass}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
};

/**
 * Pagination provides accessible page-by-page stepping controls
 * with ellipsis aggregation and keyboard focus handling.
 * Benchmarked against shadcn Pagination, Ant Design Pagination, and Carbon Pagination.
 *
 * @maturity stable
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageCount,
      onChange,
      density = "standard",
      className = "",
      ...rest
    },
    ref
  ) => {
    if (pageCount <= 1) return null;

    const pages: number[] = [];
    const from = Math.max(1, page - 2);
    const to = Math.min(pageCount, page + 2);
    for (let p = from; p <= to; p++) pages.push(p);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        data-slot="pagination"
        data-density={density}
        className={paginationVariants({ density, className })}
        {...rest}
      >
        <PageBtn
          label={<ChevronLeft size={14} aria-hidden="true" />}
          target={page - 1}
          disabled={page <= 1}
          onClick={onChange}
          ariaLabel="Previous page"
          dataSlot="pagination-previous"
        />
        {from > 1 && (
          <PageBtn label={1} target={1} disabled={false} onClick={onChange} />
        )}
        {from > 2 && (
          <span data-slot="pagination-ellipsis" className={styles.ellipsis}>
            …
          </span>
        )}
        {pages.map((p) => (
          <PageBtn
            key={p}
            label={p}
            target={p}
            disabled={false}
            active={p === page}
            onClick={onChange}
          />
        ))}
        {to < pageCount - 1 && (
          <span data-slot="pagination-ellipsis" className={styles.ellipsis}>
            …
          </span>
        )}
        {to < pageCount && (
          <PageBtn
            label={pageCount}
            target={pageCount}
            disabled={false}
            onClick={onChange}
          />
        )}
        <PageBtn
          label={<ChevronRight size={14} aria-hidden="true" />}
          target={page + 1}
          disabled={page >= pageCount}
          onClick={onChange}
          ariaLabel="Next page"
          dataSlot="pagination-next"
        />
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

/** Compound sub-components for custom layouts */
export const PaginationContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="pagination-content" className={cn(styles.container, className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="pagination-item" className={cn(className)} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-current={isActive ? "page" : undefined}
    data-slot="pagination-button"
    className={cn(styles.pageBtn, isActive && styles.active, className)}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Go to previous page"
    data-slot="pagination-previous"
    className={cn(styles.pageBtn, className)}
    {...props}
  >
    <ChevronLeft size={14} aria-hidden="true" />
  </button>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Go to next page"
    data-slot="pagination-next"
    className={cn(styles.pageBtn, className)}
    {...props}
  >
    <ChevronRight size={14} aria-hidden="true" />
  </button>
));
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden="true"
    data-slot="pagination-ellipsis"
    className={cn(styles.ellipsis, className)}
    {...props}
  >
    <MoreHorizontal size={14} />
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";
