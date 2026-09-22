"use client";

import { useId, useState, forwardRef, type ReactNode } from "react";
import styles from "./studio-inspector.module.css";

export type InspectorTabId = "properties" | "logic" | "style" | "advanced";

export interface CustomInspectorTab {
  id: string;
  label: string;
  content: ReactNode;
}

const DEFAULT_TAB_ORDER: { id: InspectorTabId; label: string }[] = [
  { id: "properties", label: "Properties" },
  { id: "logic", label: "Logic" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
];

export interface StudioInspectorProps {
  /** What is being inspected, e.g. "Hero" or "supplierTable". */
  subject?: string;
  /** Optional icon rendered in inspector header beside subject title */
  headerIcon?: ReactNode;
  /** Optional badge rendered in inspector header (e.g. "User Task", "Component") */
  headerBadge?: string;
  /** Optional action menu or close button in header (e.g. "..." menu) */
  actionMenu?: ReactNode;
  /** Custom tabs array (e.g. [{ id: "settings", label: "Settings", content: <SettingsPanel /> }]) */
  customTabs?: CustomInspectorTab[];
  /** Controlled active tab ID */
  activeTabId?: string;
  /** Callback fired on tab selection */
  onTabChange?: (tabId: string) => void;

  /** Legacy slot: Properties pane */
  properties?: ReactNode;
  /** Legacy slot: Logic pane */
  logic?: ReactNode;
  /** Legacy slot: Style pane */
  style?: ReactNode;
  /** Legacy slot: Advanced pane */
  advanced?: ReactNode;
  /** Shown across all tabs when nothing is selected. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * `<StudioInspector>` — Properties and configuration drawer for Strata visual builders.
 * Supports builder-specific custom tabs (e.g. Settings/Styles or Properties/Data/Events),
 * element badge header with action buttons, and accessible keyboard navigation.
 *
 * @maturity stable
 */
export const StudioInspector = forwardRef<HTMLDivElement, StudioInspectorProps>(({
  subject,
  headerIcon,
  headerBadge,
  actionMenu,
  customTabs,
  activeTabId,
  onTabChange,
  properties,
  logic,
  style,
  advanced,
  emptyState,
  className = "",
}, ref) => {
  const baseId = useId();
  const [internalActive, setInternalActive] = useState<string>(
    customTabs && customTabs.length > 0 ? customTabs[0]!.id : "properties"
  );
  const currentTabId = activeTabId !== undefined ? activeTabId : internalActive;

  const handleTabClick = (id: string) => {
    setInternalActive(id);
    onTabChange?.(id);
  };

  const nothingSelected = !subject;

  // Derive tab list
  const tabList = customTabs && customTabs.length > 0
    ? customTabs.map((t) => ({ id: t.id, label: t.label }))
    : DEFAULT_TAB_ORDER;

  // Derive active content
  let activeContent: ReactNode = null;
  if (customTabs && customTabs.length > 0) {
    const found = customTabs.find((t) => t.id === currentTabId);
    activeContent = found ? found.content : customTabs[0]?.content;
  } else {
    const panes: Record<string, ReactNode> = {
      properties,
      logic,
      style,
      advanced,
    };
    activeContent = panes[currentTabId];
  }

  return (
    <div
      ref={ref}
      className={`${styles.inspector} ${className}`.trim()}
      role="region"
      aria-label={subject ? `Inspector — ${subject}` : "Inspector"}
    >
      {subject && (
        <div className={styles.header}>
          <div className={styles.headerIdentity}>
            {headerIcon && <span className={styles.headerIcon}>{headerIcon}</span>}
            <span className={styles.headerTitle}>{subject}</span>
            {headerBadge && <span className={styles.headerBadge}>{headerBadge}</span>}
          </div>
          {actionMenu && <div className={styles.headerActions}>{actionMenu}</div>}
        </div>
      )}

      <div className={styles.tabs} role="tablist" aria-label="Inspector sections">
        {tabList.map((tab) => {
          const isActive = tab.id === currentTabId;
          const tabButtonId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              type="button"
              id={tabButtonId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`.trim()}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${currentTabId}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${currentTabId}`}
        className={styles.body}
      >
        {nothingSelected ? (
          <div className={styles.placeholder}>
            {emptyState ?? "Select something on the canvas to inspect its properties."}
          </div>
        ) : (
          activeContent ?? (
            <div className={styles.placeholder}>
              {subject ?? "This element"} has no {currentTabId} settings.
            </div>
          )
        )}
      </div>
    </div>
  );
});

StudioInspector.displayName = "StudioInspector";
