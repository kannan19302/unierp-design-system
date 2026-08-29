"use client";

import { type FC, type ComponentType } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./sub-tab-bar.module.css";

export interface SubTab {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
}

export interface SubTabBarProps {
  tabs: SubTab[];
  ariaLabel?: string;
  className?: string;
}

export const SubTabBar: FC<SubTabBarProps> = ({
  tabs,
  ariaLabel,
  className = "",
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let activeId: string | null = null;
  let bestScore = -1;
  for (const tab of tabs) {
    const [path = "", query] = tab.href.split("?");
    const pathMatches = pathname === path || (pathname && pathname.startsWith(`${path}/`));
    if (!pathMatches) continue;

    let queryMatches = true;
    if (query && searchParams) {
      const params = new URLSearchParams(query);
      for (const [key, val] of params.entries()) {
        if (searchParams.get(key) !== val) {
          queryMatches = false;
          break;
        }
      }
    }
    if (!queryMatches) continue;

    const score = path.length + (query ? 100000 : 0);
    if (score > bestScore) {
      bestScore = score;
      activeId = tab.id;
    }
  }

  return (
    <div
      className={`${styles.bar} ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel || "Sub-sections"}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
          >
            {Icon && <Icon size={14} className={styles.icon} />}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
