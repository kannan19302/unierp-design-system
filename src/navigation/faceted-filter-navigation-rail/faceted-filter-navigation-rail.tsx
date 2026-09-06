import React, { useState } from "react";
import styles from "./faceted-filter-navigation-rail.module.css";

export interface FacetedFilterOption {
  id: string;
  label: string;
  count: number;
}

export interface FacetedFilterGroup {
  id: string;
  title: string;
  options: FacetedFilterOption[];
  isExpanded?: boolean;
}

export interface FacetedFilterNavigationRailProps {
  groups: FacetedFilterGroup[];
  selectedOptionIds: string[];
  onToggleOption: (groupId: string, optionId: string) => void;
  onClearAll?: () => void;
  title?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const FacetedFilterNavigationRail: React.FC<FacetedFilterNavigationRailProps> = ({
  groups,
  selectedOptionIds,
  onToggleOption,
  onClearAll,
  title = "Filter Facets",
  density = "standard",
  className = "",
  testId = "faceted-filter-navigation-rail",
}) => {
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<Set<string>>(new Set());

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <nav
      className={`${styles.railContainer ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label={title}
    >
      <div className={styles.header ?? ""}>
        <h4 className={styles.title ?? ""}>{title}</h4>
        {onClearAll && selectedOptionIds.length > 0 && (
          <button
            type="button"
            className={styles.clearAllBtn ?? ""}
            onClick={onClearAll}
            aria-label="Clear all filter facets"
          >
            Clear All
          </button>
        )}
      </div>

      <ul className={styles.groupsList ?? ""} role="list">
        {groups.map((group) => {
          const isCollapsed = collapsedGroupIds.has(group.id);

          return (
            <li key={group.id} className={styles.facetGroup ?? ""}>
              <button
                type="button"
                className={styles.groupHeader ?? ""}
                onClick={() => toggleGroupCollapse(group.id)}
                aria-expanded={!isCollapsed}
                aria-label={`${group.title} facet group`}
              >
                <h5 className={styles.groupTitle ?? ""}>{group.title}</h5>
                <span aria-hidden="true">{isCollapsed ? "▾" : "▴"}</span>
              </button>

              {!isCollapsed && (
                <ul className={styles.optionsList ?? ""} role="list">
                  {group.options.map((opt) => {
                    const isChecked = selectedOptionIds.includes(opt.id);

                    return (
                      <li key={opt.id} className={styles.optionItem ?? ""}>
                        <label className={styles.optionLabel ?? ""}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleOption(group.id, opt.id)}
                            aria-label={`${opt.label} (${opt.count} matches)`}
                          />
                          <span>{opt.label}</span>
                        </label>
                        <span className={styles.countBadge ?? ""}>
                          {opt.count}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
