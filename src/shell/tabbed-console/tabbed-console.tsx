"use client";

import { useState, useRef, useEffect, type FC, type ReactNode } from "react";
import { X, Plus, ChevronDown, Search, AlertTriangle, FileText } from "lucide-react";
import styles from "./tabbed-console.module.css";

export interface ConsoleTab {
  id: string;
  title: string;
  icon?: ReactNode;
  pinned?: boolean;
  isDirty?: boolean;
  draftLabel?: string;
  scope?: string;
  content?: ReactNode;
  closable?: boolean;
}

export interface TabbedConsoleProps {
  tabs: ConsoleTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  canCreateTab?: boolean;
  searchable?: boolean;
  /** Density scale */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  children?: ReactNode;
}

export const TabbedConsole: FC<TabbedConsoleProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onNewTab,
  canCreateTab = false,
  searchable = true,
  density,
  className,
  children,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    activeTabId ?? (tabs[0]?.id ?? ""),
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingCloseTab, setPendingCloseTab] = useState<ConsoleTab | null>(null);
  const searchMenuRef = useRef<HTMLDivElement>(null);

  const currentId = activeTabId ?? internalActiveId;
  const activeTab = tabs.find((t) => t.id === currentId) ?? tabs[0];

  useEffect(() => {
    if (activeTabId && activeTabId !== internalActiveId) {
      setInternalActiveId(activeTabId);
    }
  }, [activeTabId, internalActiveId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchMenuRef.current && !searchMenuRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [searchOpen]);

  const handleSelect = (id: string) => {
    setInternalActiveId(id);
    onTabChange?.(id);
  };

  const initiateClose = (e: React.MouseEvent, tab: ConsoleTab) => {
    e.stopPropagation();
    if (tab.isDirty) {
      setPendingCloseTab(tab);
    } else {
      onTabClose?.(tab.id);
    }
  };

  const confirmDiscardClose = () => {
    if (pendingCloseTab) {
      onTabClose?.(pendingCloseTab.id);
      setPendingCloseTab(null);
    }
  };

  const cancelClose = () => {
    setPendingCloseTab(null);
  };

  const filteredTabs = tabs.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.scope && t.scope.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      className={`${styles.root} ${className ?? ""}`}
      data-floorplan="tabbed-console"
      data-density={density}
    >
      <div className={styles.tab_strip_bar}>
        <div role="tablist" aria-label="Console Workspace Tabs" className={styles.tab_strip}>
          {tabs.map((tab) => {
            const isActive = tab.id === currentId;
            const isPinned = tab.pinned;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`${styles.tab_item} ${isActive ? styles.tab_item_active : ""} ${
                  isPinned ? styles.tab_item_pinned : ""
                }`}
                onClick={() => handleSelect(tab.id)}
                title={tab.title}
              >
                {tab.icon && <span className={styles.tab_icon}>{tab.icon}</span>}
                {!isPinned && <span className={styles.tab_title}>{tab.title}</span>}
                {tab.isDirty && (
                  <span className={styles.dirty_indicator} title="Unsaved changes">
                    <span className={styles.dirty_dot} />
                    {tab.draftLabel && <span className={styles.draft_badge}>{tab.draftLabel}</span>}
                  </span>
                )}
                {!isPinned && tab.closable !== false && tabs.length > 1 && (
                  <span
                    aria-label={`Close tab ${tab.title}`}
                    className={styles.close_btn}
                    onClick={(e) => initiateClose(e, tab)}
                  >
                    <X size={12} aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Controls: New Tab & Search Overflow (outside role=tablist to satisfy ARIA spec) */}
        <div className={styles.tab_actions}>
          {(canCreateTab || onNewTab) && (
            <button
              type="button"
              className={styles.tab_action_btn}
              onClick={onNewTab}
              aria-label="New tab"
              title="Open new tab"
            >
              <Plus size={14} aria-hidden />
            </button>
          )}

          {searchable && (
            <div className={styles.search_container} ref={searchMenuRef}>
              <button
                type="button"
                className={`${styles.tab_action_btn} ${searchOpen ? styles.tab_action_active : ""}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search open tabs"
                aria-expanded={searchOpen}
                title="Search open tabs"
              >
                <ChevronDown size={14} aria-hidden />
              </button>

              {searchOpen && (
                <div className={styles.search_dropdown} role="dialog" aria-label="Open tabs search">
                  <div className={styles.search_input_wrap}>
                    <Search size={14} className={styles.search_icon} aria-hidden />
                    <input
                      type="text"
                      placeholder="Search open tabs"
                      className={styles.search_input}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className={styles.search_list} role="menu">
                    {filteredTabs.map((tab) => {
                      const isActive = tab.id === currentId;
                      return (
                        <div
                          key={tab.id}
                          className={`${styles.search_item} ${isActive ? styles.search_item_active : ""}`}
                          onClick={() => {
                            handleSelect(tab.id);
                            setSearchOpen(false);
                          }}
                          role="menuitem"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleSelect(tab.id);
                              setSearchOpen(false);
                            }
                          }}
                        >
                          <span className={styles.search_item_icon}>
                            {tab.icon || <FileText size={14} />}
                          </span>
                          <div className={styles.search_item_meta}>
                            <span className={styles.search_item_title}>{tab.title}</span>
                            {tab.scope && (
                              <span className={styles.search_item_scope}>{tab.scope}</span>
                            )}
                          </div>
                          {tab.draftLabel && (
                            <span className={styles.draft_badge}>{tab.draftLabel}</span>
                          )}
                          {tab.closable !== false && tabs.length > 1 && (
                            <button
                              type="button"
                              className={styles.search_item_close}
                              onClick={(e) => {
                                e.stopPropagation();
                                initiateClose(e, tab);
                              }}
                              aria-label={`Close tab ${tab.title}`}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {filteredTabs.length === 0 && (
                      <div className={styles.search_empty}>No matching open tabs</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {pendingCloseTab && (
        <div className={styles.modal_backdrop} role="dialog" aria-modal="true">
          <div className={styles.modal_card}>
            <div className={styles.modal_header}>
              <div className={styles.modal_title_row}>
                <AlertTriangle size={18} className={styles.modal_warn_icon} />
                <h3 className={styles.modal_title}>Close unsaved {pendingCloseTab.title}?</h3>
              </div>
              <button
                type="button"
                className={styles.modal_close_btn}
                onClick={cancelClose}
                aria-label="Cancel"
              >
                <X size={14} />
              </button>
            </div>
            <p className={styles.modal_body}>
              <strong>{pendingCloseTab.id}</strong> has unsaved changes.
            </p>
            <div className={styles.modal_actions}>
              <button
                type="button"
                className={styles.btn_secondary}
                onClick={cancelClose}
              >
                Keep editing
              </button>
              <button
                type="button"
                className={styles.btn_danger}
                onClick={confirmDiscardClose}
              >
                Discard changes
              </button>
              <button
                type="button"
                className={styles.btn_primary}
                onClick={confirmDiscardClose}
              >
                Save draft & close
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        role="tabpanel"
        id={`panel-${activeTab?.id}`}
        aria-labelledby={`tab-${activeTab?.id}`}
        className={styles.content_area}
      >
        {children ?? activeTab?.content}
      </div>
    </div>
  );
};
