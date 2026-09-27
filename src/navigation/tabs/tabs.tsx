"use client";

import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  type ReactNode,
  type KeyboardEvent,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./tabs.module.css";

export const tabsVariants = cva(styles.tablist, {
  variants: {
    variant: {
      underline: styles.tablistUnderline,
      pills: styles.tablistPills,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    variant: "underline",
    density: "standard",
  },
});

export type TabsVariantProps = VariantProps<typeof tabsVariants>;

export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: string;
  badge?: ReactNode;
  disabled?: boolean;
}

interface TabsContextValue {
  value: string;
  onChange: (key: string) => void;
  variant: "underline" | "pills";
  density: "ultra-compact" | "compact" | "standard" | "comfortable";
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs?: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  onValueChange?: (key: string) => void;
  variant?: "underline" | "pills";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
  children?: ReactNode;
}

const TabButton: React.FC<{
  tab: TabItem;
  active: boolean;
  onClick: () => void;
  variant: "underline" | "pills";
}> = ({ tab, active, onClick, variant }) => {
  const btnClass = [
    variant === "pills" ? styles.tabBtnPill : styles.tabBtn,
    active && (variant === "pills" ? styles.tabBtnPillActive : styles.tabBtnActive),
    tab.disabled ? styles.tabBtnDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={tab.disabled || undefined}
      onClick={tab.disabled ? undefined : onClick}
      className={btnClass}
      title={tab.description}
      data-slot="tabs-trigger"
      data-value={tab.key}
    >
      {tab.icon && (
        <span className={styles.icon} data-slot="tabs-icon" aria-hidden="true">
          {tab.icon}
        </span>
      )}
      <span className={styles.label} data-slot="tabs-label">
        {tab.label}
      </span>
      {tab.badge != null && (
        <span className={styles.tabBadge} data-slot="tabs-badge">
          {tab.badge}
        </span>
      )}
    </button>
  );
};

/* ─── Compound TabsList ─── */
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className = "", children, ...rest }, ref) {
    const ctx = useContext(TabsContext);
    const variant = ctx?.variant ?? "underline";
    const density = ctx?.density ?? "standard";

    return (
      <div
        ref={ref}
        role="tablist"
        data-slot="tabs-list"
        className={`${tabsVariants({ variant, density })} ${className}`.trim()}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

/* ─── Compound TabsTrigger ─── */
export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, icon, badge, disabled, className = "", children, onClick, ...rest }, ref) {
    const ctx = useContext(TabsContext);
    const active = ctx?.value === value;
    const variant = ctx?.variant ?? "underline";

    const btnClass = [
      variant === "pills" ? styles.tabBtnPill : styles.tabBtn,
      active && (variant === "pills" ? styles.tabBtnPillActive : styles.tabBtnActive),
      disabled ? styles.tabBtnDisabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-slot="tabs-trigger"
        data-value={value}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled) {
            ctx?.onChange(value);
          }
        }}
        className={btnClass}
        {...rest}
      >
        {icon && (
          <span className={styles.icon} data-slot="tabs-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.label} data-slot="tabs-label">
          {children}
        </span>
        {badge != null && (
          <span className={styles.tabBadge} data-slot="tabs-badge">
            {badge}
          </span>
        )}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

/* ─── Compound TabsContent ─── */
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children?: ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, className = "", children, ...rest }, ref) {
    const ctx = useContext(TabsContext);
    const active = ctx?.value === value;

    if (!active) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-slot="tabs-content"
        data-value={value}
        tabIndex={0}
        className={`${styles.tabContent} ${className}`.trim()}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

/**
 * Tabs allows switching between alternative views within the same context.
 * Supports both declarative array configuration (tabs={[...]}) and compound components (<TabsList>, <TabsTrigger>, <TabsContent>).
 *
 * @maturity stable
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onValueChange,
      variant = "underline",
      density = "standard",
      className = "",
      testId = "tabs",
      children,
      ...rest
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue || (tabs && tabs.length > 0 && tabs[0] ? tabs[0].key : "")
    );

    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : uncontrolledValue;

    const handleSelect = (key: string) => {
      if (!isControlled) {
        setUncontrolledValue(key);
      }
      onChange?.(key);
      onValueChange?.(key);
    };

    // If using compound components pattern with children
    if (children) {
      return (
        <TabsContext.Provider
          value={{
            value: activeValue,
            onChange: handleSelect,
            variant,
            density,
          }}
        >
          <div
            ref={ref}
            data-slot="tabs"
            data-testid={testId}
            data-density={density}
            data-variant={variant}
            className={className}
            {...rest}
          >
            {children}
          </div>
        </TabsContext.Provider>
      );
    }

    // Flat array configuration pattern
    const tabItems = tabs ?? [];
    const enabledTabs = tabItems.filter((t) => !t.disabled);

    const onKeyDown = (e: KeyboardEvent) => {
      const currentIdx = enabledTabs.findIndex((t) => t.key === activeValue);
      let nextIdx = currentIdx;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % enabledTabs.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = enabledTabs.length - 1;
      } else {
        return;
      }

      const targetTab = enabledTabs[nextIdx];
      if (targetTab) {
        handleSelect(targetTab.key);
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        onKeyDown={onKeyDown}
        data-slot="tabs"
        data-testid={testId}
        data-density={density}
        data-variant={variant}
        className={`${tabsVariants({ variant, density })} ${className}`.trim()}
        {...rest}
      >
        {tabItems.map((t) => (
          <TabButton
            key={t.key}
            tab={t}
            active={t.key === activeValue}
            onClick={() => handleSelect(t.key)}
            variant={variant}
          />
        ))}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
