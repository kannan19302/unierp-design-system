"use client";

import { useState, type FC, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./context-rail.module.css";

export interface ContextRailTab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  content: ReactNode;
}

export interface ContextRailProps {
  title?: string;
  tabs?: ContextRailTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * `<ContextRail>` — Right-hand contextual workspace panel for DL 2.0.
 *
 * Hosts context-specific features (Activity, Comments, Attachments, AI Assistant,
 * Approval Workflows, Audit Logs) without taking users away from their main working surface.
 */
export const ContextRail: FC<ContextRailProps> = ({
  title = "Context",
  tabs,
  activeTabId,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
  onClose,
  actions,
  children,
  className = "",
}) => {
  const [internalTabId, setInternalTabId] = useState<string>(
    activeTabId ?? (tabs?.[0]?.id || ""),
  );

  const currentTabId = activeTabId ?? internalTabId;
  const currentTab = tabs?.find((t) => t.id === currentTabId) ?? tabs?.[0];

  const handleSelectTab = (id: string) => {
    if (onTabChange) onTabChange(id);
    else setInternalTabId(id);
    if (collapsed && onToggleCollapse) {
      onToggleCollapse(false);
    }
  };

  return (
    <aside
      className={`${styles.rail} ${collapsed ? styles.railCollapsed : ""} ${className}`.trim()}
      aria-label="Context Rail"
    >
      <div className={styles.header}>
        {!collapsed && <h3 className={styles.title}>{title}</h3>}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          {actions}
          {onToggleCollapse && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => onToggleCollapse(!collapsed)}
              aria-label={collapsed ? "Expand context rail" : "Collapse context rail"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {onClose && !collapsed && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={onClose}
              aria-label="Close context rail"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {!collapsed && tabs && tabs.length > 1 && (
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTabId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`.trim()}
                onClick={() => handleSelectTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "var(--space-4)",
                      height: "var(--space-4)",
                      padding: "0 var(--space-1)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "var(--type-micro, 10px)",
                      fontWeight: "bold",
                      background: isActive
                        ? "var(--platform-accent, var(--color-primary))"
                        : "var(--surface-sunken-bg, var(--color-bg-sunken))",
                      color: isActive ? "var(--on-primary, #ffffff)" : "var(--color-text-secondary)",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!collapsed && (
        <div className={styles.body} role="tabpanel">
          {tabs ? currentTab?.content : children}
        </div>
      )}
    </aside>
  );
};
