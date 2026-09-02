"use client";

import { useState, type FC, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./tabbed-console.module.css";

export interface ConsoleTab {
  id: string;
  title: string;
  isDirty?: boolean;
  content: ReactNode;
  closable?: boolean;
}

export interface TabbedConsoleProps {
  tabs: ConsoleTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  className?: string;
}

export const TabbedConsole: FC<TabbedConsoleProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  className,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    activeTabId ?? (tabs[0]?.id ?? ""),
  );

  const currentId = activeTabId ?? internalActiveId;
  const activeTab = tabs.find((t) => t.id === currentId) ?? tabs[0];

  const handleSelect = (id: string) => {
    setInternalActiveId(id);
    onTabChange?.(id);
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onTabClose?.(id);
  };

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div role="tablist" aria-label="Console Workspace Tabs" className={styles.tab_strip}>
        {tabs.map((tab) => {
          const isActive = tab.id === currentId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`${styles.tab_item} ${isActive ? styles.tab_item_active : ""}`}
              onClick={() => handleSelect(tab.id)}
            >
              {tab.isDirty && <span className={styles.dirty_dot} title="Unsaved changes" />}
              <span>{tab.title}</span>
              {tab.closable !== false && tabs.length > 1 && (
                <span
                  role="button"
                  aria-label={`Close tab ${tab.title}`}
                  className={styles.close_btn}
                  onClick={(e) => handleClose(e, tab.id)}
                >
                  <X size={12} aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab?.id}`}
        aria-labelledby={`tab-${activeTab?.id}`}
        className={styles.content_area}
      >
        {activeTab?.content}
      </div>
    </div>
  );
};
