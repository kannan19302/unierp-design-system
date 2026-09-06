import React, { useState, useId, useMemo } from "react";
import styles from "./cross-filter-facet-panel.module.css";

export interface FacetOption {
  id: string;
  label: string;
  count: number;
  selected?: boolean;
}

export interface FacetCategory {
  id: string;
  name: string;
  options: FacetOption[];
}

export interface CrossFilterFacetPanelProps {
  /** Title of the facet panel (default: "Filter Records") */
  title?: string;
  /** Facet categories with options and counts */
  categories: FacetCategory[];
  /** Set of currently selected option IDs across all facets */
  selectedIds?: string[];
  /** Callback fired when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Optional callback fired when reset/clear all is clicked */
  onClearAll?: () => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const CrossFilterFacetPanel: React.FC<CrossFilterFacetPanelProps> = ({
  title = "Filter Records",
  categories,
  selectedIds = [],
  onSelectionChange,
  onClearAll,
  density = "compact",
  className,
}) => {
  const panelId = useId();
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleSearchChange = (catId: string, q: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [catId]: q,
    }));
  };

  const handleOptionToggle = (optionId: string) => {
    const isSelected = selectedIds.includes(optionId);
    const next = isSelected
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];
    onSelectionChange?.(next);
  };

  const handleClearCategory = (category: FacetCategory) => {
    const catOptionIds = new Set(category.options.map((o) => o.id));
    const next = selectedIds.filter((id) => !catOptionIds.has(id));
    onSelectionChange?.(next);
  };

  const handleSelectAllCategory = (category: FacetCategory) => {
    const catOptionIds = category.options.map((o) => o.id);
    const next = Array.from(new Set([...selectedIds, ...catOptionIds]));
    onSelectionChange?.(next);
  };

  const activeSelectionsCount = selectedIds.length;

  // Compute option map for active chips display
  const optionLookup = useMemo(() => {
    const map = new Map<string, { label: string; catName: string }>();
    categories.forEach((cat) => {
      cat.options.forEach((opt) => {
        map.set(opt.id, { label: opt.label, catName: cat.name });
      });
    });
    return map;
  }, [categories]);

  return (
    <aside
      className={`${styles.panel} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${panelId}-heading`}
    >
      {/* Panel Top Header */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <h2 id={`${panelId}-heading`} className={styles.title}>
            {title}
          </h2>
          {activeSelectionsCount > 0 && (
            <span className={styles.badge} aria-label={`${activeSelectionsCount} active filters`}>
              {activeSelectionsCount}
            </span>
          )}
        </div>
        {activeSelectionsCount > 0 && (
          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={() => {
              onSelectionChange?.([]);
              onClearAll?.();
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Chips Bar */}
      {activeSelectionsCount > 0 && (
        <div className={styles.activeChipsContainer} role="region" aria-label="Active filters">
          <div className={styles.chipsScroll}>
            {selectedIds.map((id) => {
              const info = optionLookup.get(id);
              if (!info) return null;
              return (
                <span key={id} className={styles.chip}>
                  <span className={styles.chipCategory}>{info.catName}:</span>
                  <span className={styles.chipLabel}>{info.label}</span>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleOptionToggle(id)}
                    aria-label={`Remove ${info.label} filter`}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Category List */}
      <div className={styles.categoryList}>
        {categories.map((category) => {
          const isCollapsed = Boolean(collapsedCategories[category.id]);
          const query = searchQueries[category.id]?.toLowerCase() ?? "";
          const maxCount = Math.max(...category.options.map((o) => o.count), 1);

          const filteredOptions = category.options.filter((opt) =>
            opt.label.toLowerCase().includes(query)
          );

          const selectedInCat = category.options.filter((o) =>
            selectedIds.includes(o.id)
          ).length;

          return (
            <section
              key={category.id}
              className={styles.categorySection}
              aria-labelledby={`${panelId}-cat-${category.id}`}
            >
              {/* Category Header Accordion Button */}
              <div className={styles.categoryHeader}>
                <button
                  type="button"
                  id={`${panelId}-cat-${category.id}`}
                  className={styles.categoryToggle}
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={!isCollapsed}
                >
                  <span
                    className={`${styles.chevron} ${
                      isCollapsed ? styles.chevronCollapsed : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                  <span className={styles.categoryName}>{category.name}</span>
                  {selectedInCat > 0 && (
                    <span className={styles.catSelectedBadge}>
                      {selectedInCat}
                    </span>
                  )}
                </button>

                {!isCollapsed && (
                  <div className={styles.catActions}>
                    <button
                      type="button"
                      className={styles.catActionBtn}
                      onClick={() => handleSelectAllCategory(category)}
                      title="Select all options in this category"
                    >
                      All
                    </button>
                    <span className={styles.catActionDivider} aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      className={styles.catActionBtn}
                      onClick={() => handleClearCategory(category)}
                      title="Clear options in this category"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* Category Body */}
              {!isCollapsed && (
                <div className={styles.categoryBody}>
                  {/* Search within facet if option count > 4 */}
                  {category.options.length > 4 && (
                    <div className={styles.searchBox}>
                      <input
                        type="text"
                        placeholder={`Search ${category.name}...`}
                        value={searchQueries[category.id] ?? ""}
                        onChange={(e) =>
                          handleSearchChange(category.id, e.target.value)
                        }
                        className={styles.searchInput}
                        aria-label={`Search options in ${category.name}`}
                      />
                      {Boolean(searchQueries[category.id]) && (
                        <button
                          type="button"
                          className={styles.searchClear}
                          onClick={() => handleSearchChange(category.id, "")}
                          aria-label="Clear facet search"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}

                  {/* Option Items */}
                  <ul className={styles.optionList} aria-label={category.name}>
                    {filteredOptions.length === 0 ? (
                      <li className={styles.emptyOptionText}>
                        No matching options
                      </li>
                    ) : (
                      filteredOptions.map((opt) => {
                        const checked = selectedIds.includes(opt.id);
                        const percentOfMax = Math.round(
                          (opt.count / maxCount) * 100
                        );

                        return (
                          <li key={opt.id} className={styles.optionItem}>
                            <label className={styles.optionLabel}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleOptionToggle(opt.id)}
                                className={styles.checkbox}
                              />
                              <span className={styles.optionName}>
                                {opt.label}
                              </span>
                              <span className={styles.optionCount}>
                                {opt.count.toLocaleString()}
                              </span>
                            </label>
                            {/* Proportional Distribution Fill Bar */}
                            <div
                              className={styles.distributionTrack}
                              aria-hidden="true"
                            >
                              <div
                                className={`${styles.distributionFill} ${
                                  checked ? styles.distributionFillActive : ""
                                }`}
                                style={{ width: `${percentOfMax}%` }}
                              />
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </aside>
  );
};
