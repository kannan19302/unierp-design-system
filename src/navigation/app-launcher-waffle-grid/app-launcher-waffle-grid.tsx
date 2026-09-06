import React, { useId, useState } from "react";
import styles from "./app-launcher-waffle-grid.module.css";

export interface AppLauncherItem {
  id: string;
  name: string;
  description: string;
  category: string;
  shortIcon: string;
  isPinned?: boolean;
}

export const defaultAppList: AppLauncherItem[] = [
  {
    id: "app_gl",
    name: "General Ledger & Journals",
    description: "Multi-currency financial postings, trial balances, and period close.",
    category: "Finance & Accounting",
    shortIcon: "GL",
    isPinned: true,
  },
  {
    id: "app_ap",
    name: "Accounts Payable",
    description: "Supplier invoicing, 3-way matching, and payment batch execution.",
    category: "Finance & Accounting",
    shortIcon: "AP",
    isPinned: true,
  },
  {
    id: "app_inv",
    name: "Inventory & Warehouse (WMS)",
    description: "Bin storage tracking, stock transfers, and batch lot traceability.",
    category: "Supply Chain & Ops",
    shortIcon: "WMS",
    isPinned: true,
  },
  {
    id: "app_po",
    name: "Procurement & Purchase Orders",
    description: "Requisition workflows, supplier catalogs, and receiving logs.",
    category: "Supply Chain & Ops",
    shortIcon: "PO",
  },
  {
    id: "app_crm",
    name: "Customer 360 & Pipelines",
    description: "B2B accounts, opportunity Kanban, and omnichannel engagement.",
    category: "Sales & CRM",
    shortIcon: "CRM",
  },
  {
    id: "app_payroll",
    name: "Global Payroll & Benefits",
    description: "Direct deposits, statutory tax deductions, and wage compensation.",
    category: "Human Capital",
    shortIcon: "PAY",
  },
  {
    id: "app_sql",
    name: "SQL Studio & Data Catalog",
    description: "Interactive query worksheets, table schemas, and data pipelines.",
    category: "Analytics & Platform",
    shortIcon: "SQL",
  },
];

export interface AppLauncherWaffleGridProps {
  isOpenByDefault?: boolean;
  apps?: AppLauncherItem[];
  onLaunchApp?: (appId: string) => void;
  onViewAllApps?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const AppLauncherWaffleGrid: React.FC<AppLauncherWaffleGridProps> = ({
  isOpenByDefault = false,
  apps = defaultAppList,
  onLaunchApp,
  onViewAllApps,
  density = "compact",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenByDefault);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputId = useId();

  const filteredApps = apps.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categories = Array.from(new Set(filteredApps.map((a) => a.category)));

  const handleLaunch = (appId: string) => {
    onLaunchApp?.(appId);
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      data-density={density}
    >
      <button
        type="button"
        className={styles.waffleButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="App Launcher: Open Suite Applications Grid"
        title="App Launcher"
      >
        <div className={styles.waffleDots} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.waffleDot} />
          ))}
        </div>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Enterprise Application Launcher"
          className={styles.flyout}
        >
          <header className={styles.flyoutHeader}>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>App Launcher</h2>
              <button
                type="button"
                className={styles.waffleButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close App Launcher"
                style={{ width: "1.5rem", height: "1.5rem", border: "none" }}
              >
                ✕
              </button>
            </div>

            <div className={styles.searchBox}>
              <label htmlFor={searchInputId} className={styles.srOnly}>
                Search applications and modules
              </label>
              <input
                id={searchInputId}
                type="search"
                className={styles.searchInput}
                placeholder="Search apps or suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </header>

          <div className={styles.appScrollArea}>
            {categories.map((category) => {
              const categoryApps = filteredApps.filter((a) => a.category === category);
              return (
                <div key={category} className={styles.categoryGroup}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <div className={styles.appGrid}>
                    {categoryApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className={styles.appCard}
                        onClick={() => handleLaunch(app.id)}
                        aria-label={`Launch ${app.name}`}
                      >
                        <div className={styles.appIcon} aria-hidden="true">
                          {app.shortIcon}
                        </div>
                        <div className={styles.appContent}>
                          <span className={styles.appName}>{app.name}</span>
                          <span className={styles.appDesc}>{app.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--color-text-secondary, #64748b)", fontSize: "0.75rem", padding: "1rem" }}>
                No applications match &quot;{searchQuery}&quot;
              </p>
            )}
          </div>

          <footer className={styles.flyoutFooter}>
            <span>UniERP Suite Ecosystem</span>
            <button
              type="button"
              className={styles.allAppsLink}
              onClick={() => {
                setIsOpen(false);
                onViewAllApps?.();
              }}
            >
              View All 42 Apps →
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};
