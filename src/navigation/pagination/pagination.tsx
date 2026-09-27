"use client";

import React, { forwardRef, type FC, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./pagination.module.css";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
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
}> = ({ label, target, disabled, active = false, onClick, ariaLabel }) => {
  const btnClass = [
    styles.pageBtn,
    active ? styles.active : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
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
 *
 * @maturity stable
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageCount,
      onChange,
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
        className={`${styles.container} ${className}`.trim()}
        {...rest}
      >
        <PageBtn
          label={<ChevronLeft size={14} aria-hidden="true" />}
          target={page - 1}
          disabled={page <= 1}
          onClick={onChange}
          ariaLabel="Previous page"
        />
        {from > 1 && (
          <PageBtn label={1} target={1} disabled={false} onClick={onChange} />
        )}
        {from > 2 && <span className={styles.ellipsis}>…</span>}
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
        {to < pageCount - 1 && <span className={styles.ellipsis}>…</span>}
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
        />
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";
