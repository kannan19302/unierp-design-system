"use client";

import React, { forwardRef } from "react";
import { Bookmark } from "lucide-react";
import styles from "./saved-view-switcher.module.css";

export interface SavedView {
  id: string;
  name: string;
}

export interface SavedViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  views: SavedView[];
  activeViewId: string;
  onSelectView: (id: string) => void;
  className?: string;
  testId?: string;
}

/**
 * SavedViewSwitcher provides a quick dropdown switcher for saved filter views,
 * layouts, and queries across high-density transactional grids.
 *
 * @maturity stable
 */
export const SavedViewSwitcher = forwardRef<HTMLDivElement, SavedViewSwitcherProps>(
  (
    {
      id,
      views,
      activeViewId,
      onSelectView,
      className = "",
      testId = "saved-view-switcher",
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        data-testid={testId}
        {...rest}
      >
        <Bookmark size={14} className={styles.icon} aria-hidden="true" />
        <div className={styles.selectWrapper}>
          <select
            id={id}
            value={activeViewId}
            onChange={(e) => onSelectView(e.target.value)}
            aria-label="Saved views"
            className={styles.select}
          >
            {views.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <span className={styles.arrow} aria-hidden="true" />
        </div>
      </div>
    );
  }
);

SavedViewSwitcher.displayName = "SavedViewSwitcher";
