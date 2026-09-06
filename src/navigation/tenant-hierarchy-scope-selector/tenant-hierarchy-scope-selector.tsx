import React, { useId, useState } from "react";
import styles from "./tenant-hierarchy-scope-selector.module.css";

export type TenantEnvironment = "PROD" | "STAGING" | "DEV";

export interface TenantScopeNode {
  id: string;
  holdingCompany: string;
  operatingSubsidiary: string;
  legalEntity: string;
  facilityOrRegion: string;
  environment: TenantEnvironment;
}

export const defaultTenantScopes: TenantScopeNode[] = [
  {
    id: "scope_apex_aero_tx_prod",
    holdingCompany: "Apex Global Holdings",
    operatingSubsidiary: "Apex Aerospace Corp",
    legalEntity: "Apex Propulsion Systems LLC",
    facilityOrRegion: "Dallas Plant 4 (us-south-1)",
    environment: "PROD",
  },
  {
    id: "scope_apex_aero_tx_stg",
    holdingCompany: "Apex Global Holdings",
    operatingSubsidiary: "Apex Aerospace Corp",
    legalEntity: "Apex Propulsion Systems LLC",
    facilityOrRegion: "Dallas Plant 4 (Staging)",
    environment: "STAGING",
  },
  {
    id: "scope_apex_semi_ca_prod",
    holdingCompany: "Apex Global Holdings",
    operatingSubsidiary: "Apex Semiconductor Inc",
    legalEntity: "Apex Silicon Fab 2",
    facilityOrRegion: "San Jose Foundry (us-west-1)",
    environment: "PROD",
  },
  {
    id: "scope_apex_eu_de_prod",
    holdingCompany: "Apex Global Holdings",
    operatingSubsidiary: "Apex European Operations GmbH",
    legalEntity: "Apex Precision Motors EU",
    facilityOrRegion: "Munich Assembly Center (eu-central-1)",
    environment: "PROD",
  },
  {
    id: "scope_apex_dev_sandbox",
    holdingCompany: "Apex Global Holdings",
    operatingSubsidiary: "Apex Digital Innovation",
    legalEntity: "Global Sandbox Tenant",
    facilityOrRegion: "Cloud Lab (Dev-01)",
    environment: "DEV",
  },
];

export interface TenantHierarchyScopeSelectorProps {
  isOpenByDefault?: boolean;
  initialScopeId?: string;
  scopes?: TenantScopeNode[];
  onSelectScope?: (scopeId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const TenantHierarchyScopeSelector: React.FC<TenantHierarchyScopeSelectorProps> = ({
  isOpenByDefault = false,
  initialScopeId = "scope_apex_aero_tx_prod",
  scopes = defaultTenantScopes,
  onSelectScope,
  density = "compact",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenByDefault);
  const [selectedId, setSelectedId] = useState<string>(initialScopeId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputId = useId();

  const activeScope = scopes.find((s) => s.id === selectedId) || scopes[0] || defaultTenantScopes[0]!;

  const filteredScopes = scopes.filter((scope) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      scope.holdingCompany.toLowerCase().includes(q) ||
      scope.operatingSubsidiary.toLowerCase().includes(q) ||
      scope.legalEntity.toLowerCase().includes(q) ||
      scope.facilityOrRegion.toLowerCase().includes(q) ||
      scope.environment.toLowerCase().includes(q)
    );
  });

  const handleSelect = (scopeId: string) => {
    setSelectedId(scopeId);
    onSelectScope?.(scopeId);
    setIsOpen(false);
  };

  const getEnvClass = (env: TenantEnvironment) => {
    switch (env) {
      case "PROD":
        return styles.envProd;
      case "STAGING":
        return styles.envStaging;
      case "DEV":
        return styles.envDev;
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`} data-density={density}>
      <button
        type="button"
        className={styles.scopeButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Current Tenant Scope: ${activeScope.operatingSubsidiary} - ${activeScope.facilityOrRegion} (${activeScope.environment})`}
      >
        <span className={styles.orgIcon} aria-hidden="true">🏢</span>
        <div className={styles.scopeHierarchy}>
          <span className={styles.scopePart}>{activeScope.operatingSubsidiary}</span>
          <span className={styles.scopeSeparator}>/</span>
          <span className={styles.scopePart}>{activeScope.facilityOrRegion}</span>
        </div>
        <span className={`${styles.envPill} ${getEnvClass(activeScope.environment)}`}>
          {activeScope.environment}
        </span>
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Select Corporate & Facility Scope"
          className={styles.flyout}
        >
          <header className={styles.flyoutHeader}>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>Corporate Tenant &amp; Scope Hierarchy</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close Scope Selector"
              >
                ✕
              </button>
            </div>

            <div>
              <label htmlFor={searchInputId} className={styles.srOnly}>
                Search subsidiary, legal entity, or region
              </label>
              <input
                id={searchInputId}
                type="search"
                className={styles.searchInput}
                placeholder="Search subsidiary, facility, region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </header>

          <div className={styles.scopeList} role="listbox" aria-label="Available Corporate Tenant Scopes">
            {filteredScopes.map((scope) => {
              const isActive = scope.id === selectedId;
              return (
                <button
                  key={scope.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`${styles.scopeItem} ${isActive ? styles.scopeItemActive : ""}`}
                  onClick={() => handleSelect(scope.id)}
                >
                  <div className={styles.itemMain}>
                    <span className={styles.itemPath}>
                      {scope.holdingCompany} / {scope.operatingSubsidiary}
                    </span>
                    <span className={styles.itemTitle}>
                      {scope.legalEntity} — {scope.facilityOrRegion}
                    </span>
                  </div>
                  <span className={`${styles.envPill} ${getEnvClass(scope.environment)}`}>
                    {scope.environment}
                  </span>
                </button>
              );
            })}

            {filteredScopes.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--color-text-secondary, #64748b)", fontSize: "0.75rem", padding: "1rem" }}>
                No corporate entities match &quot;{searchQuery}&quot;
              </p>
            )}
          </div>

          <footer className={styles.footer}>
            <span>RBAC Scoped Access Level</span>
            <span>Multi-Subsidiary Partitioning</span>
          </footer>
        </div>
      )}
    </div>
  );
};
