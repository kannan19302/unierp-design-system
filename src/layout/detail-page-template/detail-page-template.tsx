"use client";

import React, { useState, type ReactNode } from "react";
import { Tabs, type TabItem } from "../../navigation/tabs";
import { PageHeader } from "../page-header";
import styles from "./detail-page-template.module.css";

export interface DetailTab {
  key: string;
  label: string;
  content: ReactNode;
  /** Badge count shown on the tab label */
  count?: number;
}

export interface DetailPageTemplateProps {
  title: string;
  subtitle?: string;
  /** Back navigation — typically a router.back() call or href */
  onBack?: () => void;
  backLabel?: string;
  /** Action buttons for the page header */
  actions?: ReactNode;
  /** Status badge or meta pills shown next to the title */
  meta?: ReactNode;
  tabs: DetailTab[];
  defaultTab?: string;
  /** Content shown above the tabs (e.g. a summary card row) */
  above?: ReactNode;
  /** DL 2.0: Context Rail slot for Activity, Comments, AI, Attachments */
  contextRail?: ReactNode;
  contextRailOpen?: boolean;
  loading?: boolean;
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  actions,
  meta,
  tabs,
  defaultTab,
  above,
  contextRail,
  contextRailOpen = true,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key ?? "");

  const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0];

  const tabItems: TabItem[] = tabs.map((t) => ({
    key: t.key,
    label: t.label,
    badge: t.count !== undefined ? t.count : undefined,
  }));

  return (
    <div className={styles.container}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={styles.backBtn}
        >
          ← {backLabel}
        </button>
      )}

      <div>
        <PageHeader title={title} description={subtitle} actions={actions} />
        {meta && <div className={styles.metaWrap}>{meta}</div>}
      </div>

      {above}

      <div>
        <Tabs tabs={tabItems} value={activeTab} onChange={setActiveTab} />

        <div className={styles.tabBody}>
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            className={styles.panel}
          >
            {loading ? (
              <div className={styles.skeletonLoading} />
            ) : (
              currentTab?.content
            )}
          </div>

          {contextRail && (
            <aside
              aria-label="Detail Context Rail"
              className={styles.rail}
              style={{ display: contextRailOpen ? "block" : "none" }}
            >
              {contextRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
