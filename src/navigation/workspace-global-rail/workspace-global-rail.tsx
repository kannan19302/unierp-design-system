import React, { useId } from "react";
import styles from "./workspace-global-rail.module.css";

export interface SuiteItem {
  id: string;
  name: string;
  shortCode: string; // e.g. "ERP", "CRM", "SCM", "HRM", "DEV", "BI"
  unreadCount?: number;
  iconLabel?: string;
}

export const defaultSuites: SuiteItem[] = [
  { id: "suite_erp", name: "Enterprise Resource Planning", shortCode: "ERP", unreadCount: 3 },
  { id: "suite_crm", name: "Customer Relationship Management", shortCode: "CRM" },
  { id: "suite_scm", name: "Supply Chain & Logistics", shortCode: "SCM", unreadCount: 1 },
  { id: "suite_hrm", name: "Human Capital Management", shortCode: "HCM" },
  { id: "suite_bi", name: "Business Intelligence & Analytics", shortCode: "BI" },
  { id: "suite_dev", name: "Developer & Platform OS", shortCode: "DEV" },
];

export interface WorkspaceGlobalRailProps {
  currentOrgName?: string;
  currentOrgAbbr?: string;
  activeSuiteId?: string;
  suites?: SuiteItem[];
  userInitials?: string;
  isUserOnline?: boolean;
  onSelectOrg?: () => void;
  onSelectSuite?: (suiteId: string) => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const WorkspaceGlobalRail: React.FC<WorkspaceGlobalRailProps> = ({
  currentOrgName = "Apex Global Holdings",
  currentOrgAbbr = "AG",
  activeSuiteId = "suite_erp",
  suites = defaultSuites,
  userInitials = "KP",
  isUserOnline = true,
  onSelectOrg,
  onSelectSuite,
  onOpenSettings,
  onOpenProfile,
  density = "compact",
  className = "",
}) => {
  const navId = useId();

  return (
    <nav
      id={navId}
      aria-label="Global Workspace Navigation Rail"
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <div className={styles.topSection}>
        <button
          type="button"
          className={styles.orgButton}
          onClick={onSelectOrg}
          aria-label={`Current Organization: ${currentOrgName}. Click to switch organization`}
          title={currentOrgName}
        >
          {currentOrgAbbr}
        </button>

        <ul className={styles.suiteList} role="menubar" aria-orientation="vertical">
          {suites.map((suite) => {
            const isActive = suite.id === activeSuiteId;
            return (
              <li key={suite.id} className={styles.suiteItem} role="none">
                {isActive && <div className={styles.activePill} aria-hidden="true" />}
                <button
                  type="button"
                  role="menuitem"
                  className={`${styles.suiteButton} ${isActive ? styles.suiteButtonActive : ""}`}
                  onClick={() => onSelectSuite?.(suite.id)}
                  aria-label={`${suite.name}${suite.unreadCount ? `, ${suite.unreadCount} unread items` : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  title={suite.name}
                >
                  {suite.shortCode}
                  {Boolean(suite.unreadCount && suite.unreadCount > 0) && (
                    <span className={styles.badge} aria-hidden="true">
                      {suite.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.bottomSection}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpenSettings}
          aria-label="Open Workspace Settings"
          title="Settings"
        >
          ⚙
        </button>

        <button
          type="button"
          className={styles.avatarButton}
          onClick={onOpenProfile}
          aria-label={`User Profile (${userInitials}). Status: ${isUserOnline ? "Online" : "Offline"}`}
          title="User Profile"
        >
          {userInitials}
          {isUserOnline && <span className={styles.onlineStatusDot} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
};
