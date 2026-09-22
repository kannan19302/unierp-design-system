import React from 'react';
import styles from './tenant-module-nav.module.css';

export interface TenantNavTab {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
}

export interface TenantModuleNavProps {
  tabs: TenantNavTab[];
  activeTabId?: string;
  onSelectTab?: (tab: TenantNavTab) => void;
  linkComponent?: React.ComponentType<any>;
  className?: string;
}

export const TenantModuleNav: React.FC<TenantModuleNavProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  linkComponent: LinkComp,
  className = '',
}) => {
  return (
    <nav className={`${styles.navContainer} ${className}`.trim()} aria-label="Tenant Modules">
      <ul className={styles.tabList} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const classNames = `${styles.tabItem} ${isActive ? styles.active : ''}`.trim();

          const content = (
            <>
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={styles.badge} aria-hidden="true">
                  {tab.badge}
                </span>
              )}
            </>
          );

          if (LinkComp) {
            return (
              <li key={tab.id} role="presentation">
                <LinkComp
                  href={tab.href}
                  className={classNames}
                  aria-selected={isActive}
                  role="tab"
                >
                  {content}
                </LinkComp>
              </li>
            );
          }

          if (onSelectTab) {
            return (
              <li key={tab.id} role="presentation">
                <button
                  type="button"
                  className={classNames}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab)}
                >
                  {content}
                </button>
              </li>
            );
          }

          return (
            <li key={tab.id} role="presentation">
              <a
                href={tab.href}
                className={classNames}
                role="tab"
                aria-selected={isActive}
              >
                {content}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
