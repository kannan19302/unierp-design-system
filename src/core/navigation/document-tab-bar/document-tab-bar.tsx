import React, { useId, useState, forwardRef, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import styles from "./document-tab-bar.module.css";

export interface DocumentTabItem {
  id: string;
  title: string;
  icon?: ReactNode;
  isDirty?: boolean;
  isPinned?: boolean;
  isClosable?: boolean;
}

export const defaultDocumentTabs: DocumentTabItem[] = [
  { id: "tab_projects", title: "Projects", isDirty: false, isPinned: false, isClosable: true },
  { id: "tab_supplier_exp", title: "Supplier experience", isDirty: false, isPinned: false, isClosable: true },
  { id: "tab_corp_web", title: "Corporate website", isDirty: false, isPinned: false, isClosable: true },
  { id: "tab_supplier_portal", title: "Supplier portal", isDirty: true, isPinned: false, isClosable: true },
];

export interface DocumentTabBarProps {
  tabs?: DocumentTabItem[];
  initialActiveTabId?: string;
  activeTabId?: string;
  onSelectTab?: (tabId: string) => void;
  onCloseTab?: (tabId: string) => void;
  onNewTab?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

/**
 * `<DocumentTabBar>` — Multi-document project tab bar for Strata Studio & Developer Platform.
 * Displays active projects, builders, and worksheets with dirty status dots and dismiss buttons.
 *
 * @maturity stable
 */
export const DocumentTabBar = forwardRef<HTMLElement, DocumentTabBarProps>(({
  tabs: propTabs = defaultDocumentTabs,
  initialActiveTabId = "tab_projects",
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  density = "compact",
  className = "",
}, ref) => {
  const barId = useId();
  const [internalActiveId, setInternalActiveId] = useState<string>(initialActiveTabId);
  const currentActiveId = activeTabId !== undefined ? activeTabId : internalActiveId;

  const handleSelect = (tabId: string) => {
    setInternalActiveId(tabId);
    onSelectTab?.(tabId);
  };

  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onCloseTab?.(tabId);
  };

  return (
    <nav
      ref={ref}
      id={barId}
      aria-label="Document Workspace Tabs"
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
    >
      <div className={styles.scrollWrapper}>
        <ul className={styles.tabList} role="list">
          {propTabs.map((tab) => {
            const isActive = tab.id === currentActiveId;
            return (
              <li
                key={tab.id}
                className={`${styles.tabItemWrapper} ${isActive ? styles.tabItemWrapperActive : ""} ${
                  tab.isPinned ? styles.tabPinned : ""
                }`.trim()}
              >
                <button
                  type="button"
                  id={`doc-tab-${tab.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`.trim()}
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
                    <X size={12} aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {onNewTab && (
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onNewTab}
            aria-label="Open New Document Worksheet"
            title="New Tab"
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
});

DocumentTabBar.displayName = "DocumentTabBar";
