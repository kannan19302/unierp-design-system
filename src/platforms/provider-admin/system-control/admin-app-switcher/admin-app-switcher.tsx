"use client";

import React, { useState, useId, useEffect, useRef } from "react";
import { Search, X, ArrowUpRight, Grid } from "lucide-react";
import styles from "./admin-app-switcher.module.css";

export interface AppManifest {
  id: string;
  appId?: string;
  label: string;
  description?: string;
  base: string;
  clusterId?: string;
  clusterName?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  searchKeywords?: string[];
}

export interface AppCluster {
  id: string;
  name: string;
}

export interface AdminAppSwitcherProps {
  items?: AppManifest[];
  clusters?: AppCluster[];
  activePath?: string;
  onLaunchApp?: (app: AppManifest) => void;
  className?: string;
}

const DEFAULT_CLUSTERS: AppCluster[] = [
  { id: "core", name: "Core Infrastructure" },
  { id: "security", name: "Security & IAM" },
  { id: "tenancy", name: "Tenancy Operations" },
];

const DEFAULT_ITEMS: AppManifest[] = [
  { id: "pao-tenants", appId: "TEN", label: "Tenant Orchestrator", base: "/tenants", clusterId: "tenancy", description: "Provision and manage tenant lifecycle and database instances" },
  { id: "pao-iam", appId: "IAM", label: "Identity & Access", base: "/iam", clusterId: "security", description: "OIDC providers, sessions, and elevated privilege grants" },
  { id: "pao-infra", appId: "OPS", label: "Infrastructure Fleet", base: "/infra", clusterId: "core", description: "Kubernetes pods, database clusters, and health telemetry" },
];

export function AdminAppSwitcher({
  items = DEFAULT_ITEMS,
  clusters = DEFAULT_CLUSTERS,
  activePath = "",
  onLaunchApp,
  className = "",
}: AdminAppSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCluster, setActiveCluster] = useState<string>("all");
  const searchInputId = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setActiveCluster("all");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredApps = items.filter((app) => {
    if (activeCluster !== "all" && app.clusterId !== activeCluster) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.label.toLowerCase().includes(q) ||
      (app.appId && app.appId.toLowerCase().includes(q)) ||
      (app.description && app.description.toLowerCase().includes(q)) ||
      (app.clusterName && app.clusterName.toLowerCase().includes(q)) ||
      (app.searchKeywords && app.searchKeywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  const handleLaunch = (app: AppManifest) => {
    onLaunchApp?.(app);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.waffleButton} ${isOpen ? styles.waffleButtonActive : ""} ${className}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Admin OS App Switcher: Open ${items.length} Platform Applications`}
        title="Admin OS App Switcher"
      >
        <div className={styles.waffleGridIcon} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.waffleDot} />
          ))}
        </div>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="UniERP Admin OS Applications Suite"
            className={styles.flyout}
          >
            <header className={styles.header}>
              <div className={styles.headerTop}>
                <div className={styles.titleArea}>
                  <h2 className={styles.title}>Switch workspace</h2>
                  <span className={styles.badge}>{items.length} available</span>
                </div>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close switcher"
                >
                  <X size={14} />
                </button>
              </div>

              <div className={styles.searchContainer}>
                <Search size={14} className={styles.searchIcon} aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  id={searchInputId}
                  type="text"
                  placeholder="Search workspaces and responsibilities"
                  aria-label="Search provider workspaces"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterPills} aria-label="Filter workspaces by responsibility">
                <button
                  type="button"
                  aria-pressed={activeCluster === "all"}
                  onClick={() => setActiveCluster("all")}
                  className={`${styles.filterPill} ${activeCluster === "all" ? styles.filterPillActive : ""}`}
                >
                  All ({items.length})
                </button>
                {clusters.map((cluster) => {
                  const count = items.filter((a) => a.clusterId === cluster.id).length;
                  return (
                    <button
                      key={cluster.id}
                      type="button"
                      aria-pressed={activeCluster === cluster.id}
                      onClick={() => setActiveCluster(cluster.id)}
                      className={`${styles.filterPill} ${activeCluster === cluster.id ? styles.filterPillActive : ""}`}
                    >
                      {cluster.name.replace(/ OS$/, "")} ({count})
                    </button>
                  );
                })}
              </div>
            </header>

            <div className={styles.appsList}>
              {filteredApps.length === 0 ? (
                <div className={styles.emptyState}>
                  No applications match &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredApps.map((app) => {
                  const Icon = app.icon || Grid;
                  const isActive = activePath === app.base || (activePath && activePath.startsWith(`${app.base}/`));
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleLaunch(app)}
                      className={`${styles.appCard} ${isActive ? styles.appCardActive : ""}`}
                    >
                      <div className={styles.appIconContainer}>
                        <Icon size={18} />
                      </div>
                      <div className={styles.appContent}>
                        <div className={styles.appHeaderRow}>
                          <span className={styles.appName}>{app.label}</span>
                          {app.appId && <span className={styles.appIdBadge}>{app.appId}</span>}
                        </div>
                        {app.description && (
                          <div className={styles.appDescription}>{app.description}</div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <footer className={styles.footer}>
              <span>Provider estate workspaces</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.launchpadLink}
              >
                <span>Control center home</span>
                <ArrowUpRight size={13} />
              </button>
            </footer>
          </div>
        </>
      )}
    </>
  );
}
