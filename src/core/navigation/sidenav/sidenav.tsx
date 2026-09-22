"use client";

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import {
  Search,
  X,
  ChevronDown,
  Star,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import styles from "./sidenav.module.css";

export interface SideNavAction {
  icon: ReactNode;
  label: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export interface SideNavItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  keywords?: string[];
  href?: string;
  group?: string;
  isFavorite?: boolean;
  quickAction?: SideNavAction;
  items?: SideNavItem[];
  onClick?: () => void;
}

export interface SideNavSection {
  key?: string;
  id?: string;
  title: ReactNode;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  defaultOpen?: boolean;
  badge?: ReactNode;
  quickAction?: SideNavAction;
  items: SideNavItem[];
}

export interface SideNavSearchResult {
  key: string;
  label: ReactNode;
  href?: string;
  group?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface SideNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: SideNavItem[];
  sections?: SideNavSection[];
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed?: boolean) => void;
  allowFavorites?: boolean;
  favorites?: string[];
  onToggleFavorite?: (key: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  globalResults?: SideNavSearchResult[];
  onSelectResult?: (result: SideNavSearchResult) => void;
  className?: string;
  testId?: string;
}

/**
 * SideNav provides enterprise-grade multi-level hierarchy, collapsible sections,
 * favorite pinning, and cross-application quick search.
 *
 * @maturity stable
 */
export const SideNav = forwardRef<HTMLElement, SideNavProps>(
  (
    {
      items,
      sections: propSections,
      header,
      footer,
      collapsed = false,
      onToggleCollapse,
      allowFavorites = false,
      favorites = [],
      onToggleFavorite,
      searchable = false,
      searchPlaceholder = "Search navigation… (/)",
      searchQuery: controlledQuery,
      onSearchChange,
      globalResults,
      onSelectResult,
      className = "",
      testId = "side-nav",
      ...rest
    },
    ref
  ) => {
  const [internalQuery, setInternalQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (propSections) {
      for (const sec of propSections) {
        const key = sec.key || sec.id;
        const isCollapsed = sec.defaultCollapsed ?? (sec.defaultOpen !== undefined ? !sec.defaultOpen : false);
        if (key && isCollapsed) {
          initial[key] = true;
        }
      }
    }
    return initial;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery;

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledQuery === undefined) {
      setInternalQuery(val);
    }
    onSearchChange?.(val);
  };

  const handleClear = () => {
    if (controlledQuery === undefined) {
      setInternalQuery("");
    }
    onSearchChange?.("");
    inputRef.current?.focus();
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Keyboard shortcut: '/' to focus search, '[' or 'Ctrl+[' to toggle collapse
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const inInput = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      if (searchable && e.key === "/" && !inInput) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (onToggleCollapse && (e.key === "[" || (e.ctrlKey && e.key === "[")) && !inInput) {
        e.preventDefault();
        onToggleCollapse();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchable, onToggleCollapse]);

  // Build unified sections list (converting flat items if no sections provided)
  const rawSections: SideNavSection[] = propSections ?? (items ? [{ key: "default", title: "", items }] : []);

  // Filter local items based on query
  const lowerQuery = query.trim().toLowerCase();

  const filterItem = (item: SideNavItem): SideNavItem | null => {
    const labelText = typeof item.label === "string" ? item.label : "";
    const matchesSelf =
      !lowerQuery ||
      labelText.toLowerCase().includes(lowerQuery) ||
      item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      item.group?.toLowerCase().includes(lowerQuery);

    const filteredChildren = item.items
      ?.map(filterItem)
      .filter((child): child is SideNavItem => child !== null);

    if (matchesSelf || (filteredChildren && filteredChildren.length > 0)) {
      return {
        ...item,
        items: filteredChildren && filteredChildren.length > 0 ? filteredChildren : item.items,
      };
    }
    return null;
  };

  const filteredSections = rawSections
    .map((section) => ({
      ...section,
      items: section.items
        .map(filterItem)
        .filter((item): item is SideNavItem => item !== null),
    }))
    .filter((sec) => sec.items.length > 0);

  // Extract all favorited items across sections
  const favoritedItems: SideNavItem[] = [];
  if (allowFavorites && favorites.length > 0 && !lowerQuery) {
    const findFavorites = (itemList: SideNavItem[]) => {
      for (const item of itemList) {
        if (favorites.includes(item.key)) {
          favoritedItems.push(item);
        }
        if (item.items) {
          findFavorites(item.items);
        }
      }
    };
    for (const sec of rawSections) {
      findFavorites(sec.items);
    }
  }

  // Filter global results if provided
  const filteredGlobalResults = lowerQuery && globalResults
    ? globalResults.filter((r) => {
        const labelText = typeof r.label === "string" ? r.label : "";
        return (
          labelText.toLowerCase().includes(lowerQuery) ||
          r.group?.toLowerCase().includes(lowerQuery)
        );
      })
    : [];

  const totalItemCount = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  // Render a single navigation item (and its nested children recursively)
  const renderItem = (item: SideNavItem, depth = 0): ReactNode => {
    const isStarred = favorites.includes(item.key) || item.isFavorite;
    const hasChildren = item.items && item.items.length > 0;
    const itemTitle = typeof item.label === "string" ? item.label : undefined;

    return (
      <div key={item.key} className={styles.itemWrapper}>
        <div
          className={`${styles.itemRow} ${item.active ? styles.active : ""} ${
            depth > 0 ? styles.nestedItem : ""
          }`}
          style={depth > 0 && !collapsed ? { paddingInlineStart: `calc(var(--space-3) + (${depth} * var(--space-3)))` } : undefined}
        >
          <button
            type="button"
            disabled={item.disabled}
            onClick={item.onClick}
            className={styles.itemBtn}
            title={collapsed ? itemTitle : undefined}
            aria-current={item.active ? "page" : undefined}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            {!collapsed && <span className={styles.label}>{item.label}</span>}
            {!collapsed && item.badge && <span className={styles.badge}>{item.badge}</span>}
          </button>

          {/* Quick Action Button */}
          {!collapsed && item.quickAction && (
            <button
              type="button"
              className={styles.quickActionBtn}
              onClick={(e) => {
                e.stopPropagation();
                item.quickAction!.onClick(e);
              }}
              title={item.quickAction.label}
              aria-label={item.quickAction.label}
            >
              {item.quickAction.icon}
            </button>
          )}

          {/* Favorite Toggle */}
          {!collapsed && allowFavorites && (
            <button
              type="button"
              className={`${styles.starBtn} ${isStarred ? styles.starred : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(item.key);
              }}
              aria-label={
                isStarred
                  ? `Remove ${typeof item.label === "string" ? item.label : "item"} from favorites`
                  : `Add ${typeof item.label === "string" ? item.label : "item"} to favorites`
              }
              title={isStarred ? "Starred item" : "Star item"}
            >
              <Star size={13} fill={isStarred ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* Child Sub-items (Tree expansion) */}
        {!collapsed && hasChildren && (
          <div className={styles.nestedContainer}>
            <div className={styles.treeRail} aria-hidden="true" />
            <div className={styles.nestedList}>
              {item.items!.map((child) => renderItem(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      ref={ref}
      aria-label="Side Navigation"
      data-collapsed={collapsed ? "true" : "false"}
      data-testid={testId}
      className={`${styles.container} ${collapsed ? styles.collapsed : ""} ${className}`.trim()}
      {...rest}
    >
      {/* Header Area */}
      <div className={styles.headerRow}>
        {header && <div className={styles.header}>{header}</div>}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={() => onToggleCollapse?.(!collapsed)}
            className={styles.collapseToggleBtn}
            aria-label={collapsed ? "Expand sidebar ([)" : "Collapse sidebar ([)"}
            title={collapsed ? "Expand sidebar ([)" : "Collapse sidebar ([)"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        )}
      </div>

      {/* Search Input */}
      {searchable && (
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} aria-hidden="true" />
          {!collapsed && (
            <>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleQueryChange}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
                aria-label="Search navigation"
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearBtn}
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              ) : (
                <kbd className={styles.kbdShortcut} aria-hidden="true">/</kbd>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation Groups */}
      <nav className={styles.nav}>
        {totalItemCount === 0 && filteredGlobalResults.length === 0 && query ? (
          <div className={styles.emptyState} role="status">
            No navigation results found
          </div>
        ) : (
          <>
            {/* Starred / Pinned Section (Atlassian Style) */}
            {favoritedItems.length > 0 && !collapsed && (
              <div className={styles.sectionGroup} data-section="starred">
                <div className={styles.sectionHeaderStatic}>
                  <Star size={12} className={styles.starHeaderIcon} aria-hidden="true" />
                  <span className={styles.sectionTitle}>Starred</span>
                  <span className={styles.sectionCount}>{favoritedItems.length}</span>
                </div>
                <div className={styles.sectionBody}>
                  {favoritedItems.map((fav) => renderItem(fav))}
                </div>
              </div>
            )}

            {/* Standard Configured Sections */}
            {filteredSections.map((section, sIdx) => {
              const secKey = section.key || section.id || `sec-${sIdx}`;
              const isCollapsible = section.collapsible !== false && !collapsed;
              const isSecCollapsed = Boolean(collapsedSections[secKey]);

              return (
                <div key={secKey} className={styles.sectionGroup}>
                  {section.title && !collapsed && (
                    <div className={styles.sectionHeaderRow}>
                      <button
                        type="button"
                        onClick={() => isCollapsible && toggleSection(secKey)}
                        disabled={!isCollapsible}
                        className={`${styles.sectionHeaderBtn} ${isCollapsible ? styles.interactive : ""}`}
                        aria-expanded={isCollapsible ? !isSecCollapsed : undefined}
                        aria-label={`Toggle ${section.title} section`}
                      >
                        {isCollapsible && (
                          <ChevronDown
                            size={12}
                            className={`${styles.chevron} ${isSecCollapsed ? styles.chevronCollapsed : ""}`}
                            aria-hidden="true"
                          />
                        )}
                        {section.icon && <span className={styles.sectionIcon}>{section.icon}</span>}
                        <span className={styles.sectionTitle}>{section.title}</span>
                        {section.badge ? (
                          <span className={styles.sectionBadge}>{section.badge}</span>
                        ) : (
                          <span className={styles.sectionCount}>{section.items.length}</span>
                        )}
                      </button>

                      {section.quickAction && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            section.quickAction?.onClick(e);
                          }}
                          className={styles.sectionQuickActionBtn}
                          aria-label={section.quickAction.label}
                          title={section.quickAction.label}
                        >
                          {section.quickAction.icon}
                        </button>
                      )}
                    </div>
                  )}

                  {collapsed && section.title && (
                    <div className={styles.collapsedSectionDivider} title={typeof section.title === "string" ? section.title : undefined} />
                  )}

                  {(!isSecCollapsed || collapsed) && (
                    <div className={styles.sectionBody}>
                      {section.items.map((item) => renderItem(item))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Cross-Application Search Results */}
            {filteredGlobalResults.length > 0 && !collapsed && (
              <div className={styles.globalGroup}>
                <div className={styles.globalHeader}>All Applications</div>
                {filteredGlobalResults.map((result) => (
                  <button
                    key={result.key}
                    type="button"
                    onClick={() => {
                      onSelectResult?.(result);
                      result.onClick?.();
                    }}
                    className={styles.globalItemBtn}
                  >
                    {result.icon && <span className={styles.icon}>{result.icon}</span>}
                    <span className={styles.label}>{result.label}</span>
                    {result.group && <span className={styles.globalBadge}>{result.group}</span>}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </nav>

      {/* Footer Area */}
      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}
);

SideNav.displayName = "SideNav";
