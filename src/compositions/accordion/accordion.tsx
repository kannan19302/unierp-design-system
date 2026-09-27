"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import styles from "./accordion.module.css";

export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenKey?: string | null;
  className?: string;
}

/**
 * Accordion provides vertically stacked disclosure panels for complex record views.
 *
 * @maturity stable
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({
  items,
  defaultOpenKey,
  className = "",
}, ref) => {
  const [openKey, setOpenKey] = useState<string | null>(
    defaultOpenKey !== undefined ? defaultOpenKey : items[0]?.key || null
  );

  return (
    <div ref={ref} className={`${styles.accordion} ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openKey === item.key;
        return (
          <div key={item.key} className={styles.item}>
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : item.key)}
              aria-expanded={isOpen}
              className={styles.headerBtn}
            >
              <span className={styles.title}>{item.title}</span>
              {isOpen ? (
                <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
              ) : (
                <ChevronRight size={14} className={styles.chevron} aria-hidden="true" />
              )}
            </button>
            {isOpen && <div className={styles.content}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
});

Accordion.displayName = "Accordion";

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Collapsible provides a lightweight toggleable disclosure region.
 *
 * @maturity stable
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(({
  title,
  children,
  defaultOpen = false,
  className = "",
}, ref) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div ref={ref} className={`${styles.collapsible} ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={styles.collapsibleBtn}
      >
        {open ? (
          <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
        ) : (
          <ChevronRight size={14} className={styles.chevron} aria-hidden="true" />
        )}
        <span className={styles.collapsibleTitle}>{title}</span>
      </button>
      {open && <div className={styles.collapsibleContent}>{children}</div>}
    </div>
  );
});

Collapsible.displayName = "Collapsible";

export const Disclosure = Collapsible;
export type DisclosureProps = CollapsibleProps;
