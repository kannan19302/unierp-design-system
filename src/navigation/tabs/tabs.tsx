"use client";

import React, { forwardRef, type ReactNode, type KeyboardEvent } from "react";
import styles from "./tabs.module.css";

export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: string;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  value: string;
  onChange: (key: string) => void;
  variant?: "underline" | "pills";
  className?: string;
  testId?: string;
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
    >
      {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
      <span className={styles.label}>{tab.label}</span>
      {tab.badge != null && <span className={styles.tabBadge}>{tab.badge}</span>}
    </button>
  );
};

/**
 * Tabs allows switching between alternative views within the same context.
 *
 * @maturity stable
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      value,
      onChange,
      variant = "underline",
      className = "",
      testId = "tabs",
      ...rest
    },
    ref
  ) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);

    const onKeyDown = (e: KeyboardEvent) => {
      const currentIdx = enabledTabs.findIndex((t) => t.key === value);
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
        onChange(targetTab.key);
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        onKeyDown={onKeyDown}
        data-testid={testId}
        className={`${variant === "pills" ? styles.tablistPills : styles.tablist} ${className}`.trim()}
        {...rest}
      >
        {tabs.map((t) => (
          <TabButton
            key={t.key}
            tab={t}
            active={t.key === value}
            onClick={() => onChange(t.key)}
            variant={variant}
          />
        ))}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
