"use client";

import {
  useState,
  useRef,
  type FC,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import {
  X,
  Plus,
  Pin,
  ChevronLeft,
  ChevronRight,
  Layers,
  Copy,
  ArrowRightToLine,
  XCircle,
} from "lucide-react";
import styles from "./workspace-tabs.module.css";

export interface WorkspaceTabItem {
  id: string;
  title: string;
  icon?: ReactNode;
  dirty?: boolean;
  pinned?: boolean;
  closable?: boolean;
  badge?: string | number;
}

export interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab?: (id: string) => void;
  onCloseOtherTabs?: (id: string) => void;
  onCloseTabsToRight?: (id: string) => void;
  onPinTab?: (id: string) => void;
  onDuplicateTab?: (id: string) => void;
  onNewTab?: () => void;
  showNewTabButton?: boolean;
  className?: string;
}

export const WorkspaceTabs: FC<WorkspaceTabsProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onPinTab,
  onDuplicateTab,
  onNewTab,
  showNewTabButton = true,
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contextMenuTabId, setContextMenuTabId] = useState<string | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleContextMenu = (e: MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenuTabId((prev) => (prev === tabId ? null : tabId));
  };

  const handleAuxClick = (e: MouseEvent, tab: WorkspaceTabItem) => {
    // Middle click to close
    if (e.button === 1 && tab.closable !== false && onCloseTab) {
      e.preventDefault();
      onCloseTab(tab.id);
    }
  };

  const handleKeyDown = (e: KeyboardEvent, tabIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (tabIndex + 1) % tabs.length;
      if (tabs[next]) onSelectTab(tabs[next]!.id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (tabIndex - 1 + tabs.length) % tabs.length;
      if (tabs[prev]) onSelectTab(tabs[prev]!.id);
    } else if (e.key === "Delete" || (e.ctrlKey && e.key === "w")) {
      e.preventDefault();
      const tab = tabs[tabIndex];
      if (tab && tab.closable !== false && onCloseTab) {
        onCloseTab(tab.id);
      }
    }
  };

  return (
    <nav
      className={`${styles.container} ${className}`.trim()}
      aria-label="Workspace document tabs"
      onClick={() => setContextMenuTabId(null)}
    >
      <button
        type="button"
        className={styles.scrollBtn}
        onClick={() => handleScroll("left")}
        aria-label="Scroll tabs left"
      >
        <ChevronLeft size={14} aria-hidden="true" />
      </button>

      <div
        ref={scrollRef}
        role="tablist"
        aria-orientation="horizontal"
        className={styles.tabList}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTabId;
          const showMenu = contextMenuTabId === tab.id;

          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              onAuxClick={(e) => handleAuxClick(e, tab)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`${styles.tab} ${isActive ? styles.activeTab : ""} ${
                tab.pinned ? styles.pinnedTab : ""
              }`}
              title={tab.title}
            >
              {tab.pinned ? (
                <Pin size={12} className={styles.pinIcon} aria-hidden="true" />
              ) : (
                tab.icon || <Layers size={13} className={styles.tabIcon} aria-hidden="true" />
              )}

              <span className={styles.tabTitle}>{tab.title}</span>

              {tab.dirty && (
                <span
                  className={styles.dirtyDot}
                  title="Unsaved changes"
                  aria-label="Unsaved changes"
                />
              )}

              {tab.badge !== undefined && (
                <span className={styles.tabBadge}>{tab.badge}</span>
              )}

              {tab.closable !== false && onCloseTab && (
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  aria-label={`Close ${tab.title} tab`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}

              {showMenu && (
                <div
                  className={styles.contextDropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  {onPinTab && (
                    <button
                      type="button"
                      className={styles.contextItem}
                      onClick={() => {
                        onPinTab(tab.id);
                        setContextMenuTabId(null);
                      }}
                    >
                      <Pin size={12} aria-hidden="true" />
                      <span>{tab.pinned ? "Unpin Tab" : "Pin Tab"}</span>
                    </button>
                  )}
                  {onDuplicateTab && (
                    <button
                      type="button"
                      className={styles.contextItem}
                      onClick={() => {
                        onDuplicateTab(tab.id);
                        setContextMenuTabId(null);
                      }}
                    >
                      <Copy size={12} aria-hidden="true" />
                      <span>Duplicate Tab</span>
                    </button>
                  )}
                  {onCloseOtherTabs && (
                    <button
                      type="button"
                      className={styles.contextItem}
                      onClick={() => {
                        onCloseOtherTabs(tab.id);
                        setContextMenuTabId(null);
                      }}
                    >
                      <XCircle size={12} aria-hidden="true" />
                      <span>Close Others</span>
                    </button>
                  )}
                  {onCloseTabsToRight && (
                    <button
                      type="button"
                      className={styles.contextItem}
                      onClick={() => {
                        onCloseTabsToRight(tab.id);
                        setContextMenuTabId(null);
                      }}
                    >
                      <ArrowRightToLine size={12} aria-hidden="true" />
                      <span>Close to the Right</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.scrollBtn}
        onClick={() => handleScroll("right")}
        aria-label="Scroll tabs right"
      >
        <ChevronRight size={14} aria-hidden="true" />
      </button>

      {showNewTabButton && onNewTab && (
        <button
          type="button"
          className={styles.newTabBtn}
          onClick={onNewTab}
          aria-label="Open new workspace document"
          title="New Tab (Ctrl+T)"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      )}
    </nav>
  );
};
