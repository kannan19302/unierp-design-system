import React, { useId, useState } from "react";
import styles from "./enterprise-command-ribbon.module.css";

export interface RibbonActionItem {
  id: string;
  label: string;
  icon: string;
  shortcutKey?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
}

export interface RibbonActionGroup {
  id: string;
  title: string;
  actions: RibbonActionItem[];
}

export interface RibbonTab {
  id: string;
  title: string;
  groups: RibbonActionGroup[];
}

export const defaultRibbonTabs: RibbonTab[] = [
  {
    id: "tab_home",
    title: "Home / Actions",
    groups: [
      {
        id: "grp_posting",
        title: "Posting",
        actions: [
          { id: "act_post", label: "Post & Release", icon: "✓", shortcutKey: "Alt+P", isPrimary: true },
          { id: "act_preview_gl", label: "Preview GL", icon: "👁", shortcutKey: "Alt+V" },
          { id: "act_reverse", label: "Reverse Posting", icon: "↺", shortcutKey: "Alt+R" },
        ],
      },
      {
        id: "grp_manage",
        title: "Document",
        actions: [
          { id: "act_save", label: "Save Draft", icon: "💾", shortcutKey: "Ctrl+S" },
          { id: "act_attach", label: "Attach Files", icon: "📎", shortcutKey: "Alt+A" },
          { id: "act_audit", label: "Audit Trail", icon: "🛡️", shortcutKey: "Alt+T" },
        ],
      },
    ],
  },
  {
    id: "tab_navigate",
    title: "Navigate & Related",
    groups: [
      {
        id: "grp_entities",
        title: "Related Records",
        actions: [
          { id: "act_cust_card", label: "Customer 360", icon: "👤" },
          { id: "act_open_invoices", label: "Open Invoices", icon: "📄" },
          { id: "act_bank_recon", label: "Bank Reconciliation", icon: "🏦" },
        ],
      },
    ],
  },
  {
    id: "tab_reports",
    title: "Analyze & Export",
    groups: [
      {
        id: "grp_export",
        title: "Reporting",
        actions: [
          { id: "act_excel", label: "Export to Excel", icon: "📊", shortcutKey: "Alt+X" },
          { id: "act_pdf", label: "Print PDF Voucher", icon: "🖨️", shortcutKey: "Ctrl+P" },
        ],
      },
    ],
  },
];

export interface EnterpriseCommandRibbonProps {
  tabs?: RibbonTab[];
  initialTabId?: string;
  onExecuteAction?: (actionId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const EnterpriseCommandRibbon: React.FC<EnterpriseCommandRibbonProps> = ({
  tabs = defaultRibbonTabs,
  initialTabId = "tab_home",
  onExecuteAction,
  density = "compact",
  className = "",
}) => {
  const ribbonId = useId();
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || defaultRibbonTabs[0]!;

  return (
    <nav
      id={ribbonId}
      aria-label="Enterprise Command Ribbon"
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.tabHeader}>
        <ul className={styles.tabList} role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <li key={tab.id} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`ribbon-tab-${tab.id}`}
                  aria-selected={isActive}
                  className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.title}
                </button>
              </li>
            );
          })}
        </ul>
      </header>

      <div
        role="toolbar"
        aria-label={`${currentTab.title} action ribbon toolbar`}
        className={styles.ribbonBody}
      >
        {currentTab.groups.map((group) => (
          <div key={group.id} className={styles.actionGroup} aria-label={group.title}>
            {group.actions.map((act) => (
              <button
                key={act.id}
                type="button"
                className={`${styles.ribbonActionBtn} ${
                  act.isPrimary ? styles.ribbonActionPrimary : ""
                }`}
                onClick={() => onExecuteAction?.(act.id)}
                disabled={act.isDisabled}
                aria-label={
                  act.shortcutKey ? `${act.label} (${act.shortcutKey})` : act.label
                }
              >
                <span className={styles.actionIcon} aria-hidden="true">
                  {act.icon}
                </span>
                <span className={styles.actionLabel}>{act.label}</span>
                {act.shortcutKey && (
                  <span className={styles.keyTipBadge} aria-hidden="true">
                    {act.shortcutKey}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};
