"use client";

import {
  useId,
  useState,
  type FC,
  type ReactNode,
  type CSSProperties,
} from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import styles from "./navigation.module.css";

// ── Tabs ──────────────────────────────────────────────
export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Short "what does this tab show?" hint, surfaced as a hover tooltip. */
  description?: string;
  /** Optional badge rendered after the label (e.g. count pill). */
  badge?: ReactNode;
  /** Disabled tabs are visible but not clickable. */
  disabled?: boolean;
}
export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (key: string) => void;
  /** Visual variant. 'underline' (default) shows a bottom border indicator;
   *  'pills' renders tabs as pill-shaped toggles. */
  variant?: "underline" | "pills";
}

const TabButton: FC<{
  tab: TabItem;
  active: boolean;
  onClick: () => void;
  variant: "underline" | "pills";
}> = ({ tab, active, onClick, variant }) => {
  const btnClass = [
    variant === "pills" ? styles.tab_btn_pill : styles.tab_btn,
    active &&
      (variant === "pills"
        ? styles.tab_btn_pill_active
        : styles.tab_btn_active),
    tab.disabled && styles.tab_btn_disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      role="tab"
      aria-selected={active}
      aria-disabled={tab.disabled || undefined}
      onClick={tab.disabled ? undefined : onClick}
      className={btnClass}
      title={tab.description}
    >
      {tab.icon}
      {tab.label}
      {tab.badge != null && (
        <span className={styles.tab_badge}>{tab.badge}</span>
      )}
    </button>
  );
};

export const Tabs: FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  variant = "underline",
}) => {
  const enabledTabs = tabs.filter((t) => !t.disabled);

  const onKeyDown = (e: React.KeyboardEvent) => {
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
      role="tablist"
      onKeyDown={onKeyDown}
      className={variant === "pills" ? styles.tablist_pills : styles.tablist}
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
};


// ── Pagination ────────────────────────────────────────
export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

const PageBtn: FC<{
  label: ReactNode;
  target: number;
  disabled: boolean;
  active?: boolean;
  onClick: (target: number) => void;
  ariaLabel?: string;
}> = ({ label, target, disabled, active = false, onClick, ariaLabel }) => {
  const btnClass = [styles.page_btn, active && styles.page_btn_active]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      disabled={disabled}
      aria-current={active || undefined}
      onClick={() => onClick(target)}
      className={btnClass}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
};

export const Pagination: FC<PaginationProps> = ({
  page,
  pageCount,
  onChange,
}) => {
  if (pageCount <= 1) return null;
  const pages: number[] = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(pageCount, page + 2);
  for (let p = from; p <= to; p++) pages.push(p);
  return (
    <div className={styles.pagination_container}>
      <PageBtn
        label={<ChevronLeft size={15} />}
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
        label={<ChevronRight size={15} />}
        target={page + 1}
        disabled={page >= pageCount}
        onClick={onChange}
        ariaLabel="Next page"
      />
    </div>
  );
};


// ── Disclosure ────────────────────────────────────────
export interface DisclosureProps {
  summary: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}
export const Disclosure: FC<DisclosureProps> = ({
  summary,
  children,
  defaultOpen = false,
  open: openProp,
  onToggle,
}) => {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : openState;
  const panelId = useId();

  const toggle = () => {
    const next = !open;
    if (onToggle) onToggle(next);
    if (openProp === undefined) setOpenState(next);
  };

  const chevronStyle: CSSProperties = {
    transform: open ? "rotate(0deg)" : "rotate(-90deg)",
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={styles.disclosure_trigger}
      >
        <span className={styles.summary_content}>{summary}</span>
        <ChevronDown
          size={14}
          className={styles.chevron_down}
          style={chevronStyle}
        />
      </button>
      {open && <div id={panelId}>{children}</div>}
    </div>
  );
};
