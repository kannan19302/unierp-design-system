"use client";

import React, { useState, type ReactNode } from "react";
import { Tabs, type TabItem } from "../components";
import { PageHeader } from "./page-header";

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
}: any) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key ?? "");

  const currentTab = tabs.find((t: any) => t.key === activeTab) ?? tabs[0];

  const tabItems: TabItem[] = tabs.map((t: any) => ({
    key: t.key,
    label: t.label,
    badge: t.count !== undefined ? t.count : undefined,
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "none",
            border: "none",
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            cursor: "pointer",
            padding: 0,
            alignSelf: "flex-start",
          }}
        >
          ← {backLabel}
        </button>
      )}

      <div>
        <PageHeader title={title} description={subtitle} actions={actions} />
        {meta && (
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              flexWrap: "wrap",
              marginTop: "var(--space-2)",
            }}
          >
            {meta}
          </div>
        )}
      </div>

      {above}

      <div>
        <Tabs tabs={tabItems} value={activeTab} onChange={setActiveTab} />

        <div
          style={{
            display: "flex",
            gap: "var(--density-panel-gap, 16px)",
            paddingTop: "var(--space-6)",
            alignItems: "flex-start",
          }}
        >
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            style={{ flex: 1, minWidth: 0 }}
          >
            {loading ? (
              <div
                style={{
                  height: "var(--space-48, 200px)",
                  background:
                    "linear-gradient(90deg, var(--color-bg-sunken) 25%, var(--color-border) 37%, var(--color-bg-sunken) 63%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s ease-in-out infinite",
                  borderRadius: "var(--radius-lg)",
                }}
              />
            ) : (
              currentTab?.content
            )}
          </div>

          {contextRail && (
            <aside
              aria-label="Detail Context Rail"
              style={{
                display: contextRailOpen ? "block" : "none",
                flexShrink: 0,
              }}
            >
              {contextRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
