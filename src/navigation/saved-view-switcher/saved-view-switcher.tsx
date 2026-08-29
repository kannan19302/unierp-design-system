"use client";

import { type FC } from "react";
import { Bookmark } from "lucide-react";
import styles from "./saved-view-switcher.module.css";

export interface SavedView {
  id: string;
  name: string;
}

export interface SavedViewSwitcherProps {
  id?: string;
  views: SavedView[];
  activeViewId: string;
  onSelectView: (id: string) => void;
  className?: string;
}

export const SavedViewSwitcher: FC<SavedViewSwitcherProps> = ({
  id,
  views,
  activeViewId,
  onSelectView,
  className = "",
}) => {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
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
};
