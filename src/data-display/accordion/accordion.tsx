"use client";

import { useState, type FC, type ReactNode } from "react";
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

export const Accordion: FC<AccordionProps> = ({
  items,
  defaultOpenKey,
  className = "",
}) => {
  const [openKey, setOpenKey] = useState<string | null>(
    defaultOpenKey !== undefined ? defaultOpenKey : items[0]?.key || null
  );

  return (
    <div className={`${styles.accordion} ${className}`.trim()}>
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
};

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Collapsible: FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.collapsible} ${className}`.trim()}>
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
};

export const Disclosure = Collapsible;
export type DisclosureProps = CollapsibleProps;
