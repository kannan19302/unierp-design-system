"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./accordion.module.css";

export const accordionVariants = cva(styles.accordion, {
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

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;

export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionContextValue {
  openKeys: string[];
  toggleKey: (key: string) => void;
  density: "ultra-compact" | "compact" | "standard" | "comfortable";
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const AccordionItemContext = createContext<{ key: string; isOpen: boolean } | null>(null);

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> {
  items?: AccordionItem[];
  defaultOpenKey?: string | null;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: "single" | "multiple";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
  children?: ReactNode;
}

/**
 * Accordion provides vertically stacked disclosure panels for complex record views.
 * Supports both flat items array configuration and compound components (<AccordionItem>, <AccordionTrigger>, <AccordionContent>).
 *
 * @maturity stable
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      defaultOpenKey,
      value: controlledValue,
      defaultValue,
      onValueChange,
      type = "single",
      density = "standard",
      className = "",
      testId = "accordion",
      children,
      ...rest
    },
    ref
  ) => {
    // Initial open keys computation
    const getInitialKeys = (): string[] => {
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      if (defaultOpenKey !== undefined) {
        return defaultOpenKey ? [defaultOpenKey] : [];
      }
      if (items && items.length > 0 && items[0]) {
        return [items[0].key];
      }
      return [];
    };

    const [uncontrolledKeys, setUncontrolledKeys] = useState<string[]>(getInitialKeys);

    const isControlled = controlledValue !== undefined;
    const currentKeys = isControlled
      ? Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue]
      : uncontrolledKeys;

    const toggleKey = (key: string) => {
      let nextKeys: string[];
      if (type === "single") {
        nextKeys = currentKeys.includes(key) ? [] : [key];
      } else {
        nextKeys = currentKeys.includes(key)
          ? currentKeys.filter((k) => k !== key)
          : [...currentKeys, key];
      }

      if (!isControlled) {
        setUncontrolledKeys(nextKeys);
      }
      onValueChange?.(type === "single" ? (nextKeys[0] ?? "") : nextKeys);
    };

    // If compound components pattern
    if (children) {
      return (
        <AccordionContext.Provider value={{ openKeys: currentKeys, toggleKey, density }}>
          <div
            ref={ref}
            data-slot="accordion"
            data-density={density}
            data-testid={testId}
            className={`${accordionVariants({ density })} ${className}`.trim()}
            {...rest}
          >
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }

    // Flat items array pattern
    const accordionItems = items ?? [];

    return (
      <div
        ref={ref}
        data-slot="accordion"
        data-density={density}
        data-testid={testId}
        className={`${accordionVariants({ density })} ${className}`.trim()}
        {...rest}
      >
        {accordionItems.map((item) => {
          const isOpen = currentKeys.includes(item.key);
          return (
            <div key={item.key} className={styles.item} data-slot="accordion-item" data-state={isOpen ? "open" : "closed"}>
              <button
                type="button"
                onClick={() => toggleKey(item.key)}
                aria-expanded={isOpen}
                disabled={item.disabled}
                data-slot="accordion-trigger"
                className={styles.headerBtn}
              >
                <span className={styles.title} data-slot="accordion-title">{item.title}</span>
                {isOpen ? (
                  <ChevronDown size={14} className={styles.chevron} data-slot="accordion-icon" aria-hidden="true" />
                ) : (
                  <ChevronRight size={14} className={styles.chevron} data-slot="accordion-icon" aria-hidden="true" />
                )}
              </button>
              {isOpen && (
                <div className={styles.content} data-slot="accordion-content">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = "Accordion";

/* ─── Compound Accordion Components ─── */
export interface AccordionCompoundItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionCompoundItemProps>(
  function AccordionItem({ value, className = "", children, ...rest }, ref) {
    const ctx = useContext(AccordionContext);
    const isOpen = ctx?.openKeys.includes(value) ?? false;

    return (
      <AccordionItemContext.Provider value={{ key: value, isOpen }}>
        <div
          ref={ref}
          data-slot="accordion-item"
          data-state={isOpen ? "open" : "closed"}
          className={`${styles.item} ${className}`.trim()}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className = "", children, onClick, ...rest }, ref) {
    const ctx = useContext(AccordionContext);
    const itemCtx = useContext(AccordionItemContext);
    const isOpen = itemCtx?.isOpen ?? false;

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-slot="accordion-trigger"
        onClick={(e) => {
          onClick?.(e);
          if (itemCtx) {
            ctx?.toggleKey(itemCtx.key);
          }
        }}
        className={`${styles.headerBtn} ${className}`.trim()}
        {...rest}
      >
        <span className={styles.title} data-slot="accordion-title">{children}</span>
        {isOpen ? (
          <ChevronDown size={14} className={styles.chevron} data-slot="accordion-icon" aria-hidden="true" />
        ) : (
          <ChevronRight size={14} className={styles.chevron} data-slot="accordion-icon" aria-hidden="true" />
        )}
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className = "", children, ...rest }, ref) {
    const itemCtx = useContext(AccordionItemContext);
    const isOpen = itemCtx?.isOpen ?? false;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        data-slot="accordion-content"
        className={`${styles.content} ${className}`.trim()}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

/* ─── Collapsible / Disclosure ─── */
export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Collapsible provides a lightweight toggleable disclosure region.
 *
 * @maturity stable
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      title,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const handleToggle = () => {
      const next = !isOpen;
      if (controlledOpen === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        data-slot="collapsible"
        data-state={isOpen ? "open" : "closed"}
        className={`${styles.collapsible} ${className}`.trim()}
        {...rest}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          data-slot="collapsible-trigger"
          className={styles.collapsibleBtn}
        >
          {isOpen ? (
            <ChevronDown size={14} className={styles.chevron} data-slot="collapsible-icon" aria-hidden="true" />
          ) : (
            <ChevronRight size={14} className={styles.chevron} data-slot="collapsible-icon" aria-hidden="true" />
          )}
          <span className={styles.collapsibleTitle} data-slot="collapsible-title">{title}</span>
        </button>
        {isOpen && (
          <div className={styles.collapsibleContent} data-slot="collapsible-content">
            {children}
          </div>
        )}
      </div>
    );
  }
);

Collapsible.displayName = "Collapsible";

export const Disclosure = Collapsible;
export type DisclosureProps = CollapsibleProps;
