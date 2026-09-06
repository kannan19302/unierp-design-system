import React, { useId, useState } from "react";
import styles from "./document-tab-bar.module.css";

export interface DocumentTabItem {
  id: string;
  title: string;
  icon?: string;
  isDirty?: boolean;
  isPinned?: boolean;
  isClosable?: boolean;
}

export const defaultDocumentTabs: DocumentTabItem[] = [
  { id: "tab_gl_worksheet", title: "Q3_Close_Ledger_Reconciliation.sql", icon: "📄", isDirty: true, isPinned: false, isClosable: true },
  { id: "tab_patient_chart", title: "Patient Chart: Vance, E. (MRN-104)", icon: "🏥", isDirty: false, isPinned: true, isClosable: true },
  { id: "tab_po_approval", title: "PO-88219 (Titanium Blades)", icon: "📦", isDirty: false, isPinned: false, isClosable: true },
  { id: "tab_trace_view", title: "APM Distributed Trace #99410", icon: "⚡", isDirty: false, isPinned: false, isClosable: true },
];

export interface DocumentTabBarProps {
  tabs?: DocumentTabItem[];
  initialActiveTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onCloseTab?: (tabId: string) => void;
  onNewTab?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DocumentTabBar: React.FC<DocumentTabBarProps> = ({
  tabs: propTabs = defaultDocumentTabs,
  initialActiveTabId = "tab_gl_worksheet",
  onSelectTab,
  onCloseTab,
  onNewTab,
  density = "compact",
  className = "",
}) => {
  const barId = useId();
  const [tabList, setTabList] = useState<DocumentTabItem[]>(propTabs);
  const [activeId, setActiveId] = useState<string>(initialActiveTabId);

  const handleSelect = (tabId: string) => {
    setActiveId(tabId);
    onSelectTab?.(tabId);
  };

  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const remaining = tabList.filter((t) => t.id !== tabId);
    setTabList(remaining);
    if (activeId === tabId && remaining.length > 0) {
      const nextActive = remaining[0]!;
      setActiveId(nextActive.id);
      onSelectTab?.(nextActive.id);
    }
    onCloseTab?.(tabId);
  };

  return (
    <nav
      id={barId}
      aria-label="Document Workspace Tabs"
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <div className={styles.scrollWrapper}>
        <ul className={styles.tabList} role="list">
          {tabList.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <li
                key={tab.id}
                className={`${styles.tabItemWrapper} ${isActive ? styles.tabItemWrapperActive : ""} ${
                  tab.isPinned ? styles.tabPinned : ""
                }`}
              >
                <button
                  type="button"
                  id={`doc-tab-${tab.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                  onClick={() => handleSelect(tab.id)}
                  title={tab.title}
                >
                  {tab.icon && (
                    <span className={styles.tabIcon} aria-hidden="true">
                      {tab.icon}
                    </span>
                  )}
                  {!tab.isPinned && <span className={styles.tabTitle}>{tab.title}</span>}
                  {tab.isDirty && (
                    <span
                      className={styles.dirtyDot}
                      aria-label="Unsaved document changes"
                      title="Unsaved changes"
                    />
                  )}
                </button>

                {tab.isClosable !== false && !tab.isPinned && (
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={(e) => handleClose(e, tab.id)}
                    aria-label={`Close tab: ${tab.title}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.actionButtons}>
        {onNewTab && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onNewTab}
            aria-label="Open New Document Worksheet"
            title="New Tab"
          >
            +
          </button>
        )}
      </div>
    </nav>
  );
};
