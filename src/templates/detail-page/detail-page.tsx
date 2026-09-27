"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import { Tabs, type TabItem } from "../../navigation/tabs";
import { PageHeader } from "../page-header";
import styles from "./detail-page.module.css";

type ShellDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const detailPageVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.density_ultra_compact,
      compact: styles.density_compact,
      standard: styles.density_standard,
      comfortable: styles.density_comfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface DetailTab {
  key: string;
  label: string;
  content: ReactNode;
  /** Badge count shown on the tab label */
  count?: number;
}

export interface DetailPageTemplateProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof detailPageVariants> {
  title?: string;
  subtitle?: string;
  /** Back navigation — typically a router.back() call or href */
  onBack?: () => void;
  backLabel?: string;
  /** Action buttons for the page header */
  actions?: ReactNode;
  /** Status badge or meta pills shown next to the title */
  meta?: ReactNode;
  tabs?: DetailTab[];
  defaultTab?: string;
  /** Content shown above the tabs (e.g. a summary card row) */
  above?: ReactNode;
  /** Structural content slots (DetailLayout / DetailViewTemplate compatibility) */
  header?: ReactNode;
  main?: ReactNode;
  sidebar?: ReactNode;
  /** DL 2.0: Context Rail slot for Activity, Comments, AI, Attachments */
  contextRail?: ReactNode;
  contextRailOpen?: boolean;
  loading?: boolean;
  /** Strata 4-tier density scaling. */
  density?: ShellDensity;
  children?: ReactNode;
}

/**
 * DetailPageTemplate coordinates standard enterprise entity layouts,
 * unifying back-navigation, contextual headers, multi-tab content, and collapsible rails.
 *
 * @maturity stable
 */
export const DetailPageTemplate = forwardRef<HTMLDivElement, DetailPageTemplateProps>(
  (
    {
      title = "",
      subtitle,
      onBack,
      backLabel = "Back",
      actions,
      meta,
      tabs = [],
      defaultTab,
      above,
      header,
      main,
      sidebar,
      contextRail,
      contextRailOpen = true,
      loading = false,
      density = "standard",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key ?? "");

    const currentTab = tabs.find((t) => t.key === activeTab) ?? tabs[0];

    const tabItems: TabItem[] = tabs.map((t) => ({
      key: t.key,
      label: t.label,
      badge: t.count !== undefined ? t.count : undefined,
    }));

    return (
      <div
        ref={ref}
        data-slot="detail-page"
        data-density={density}
        className={`${detailPageVariants({ density })} ${className}`.trim()}
        {...props}
      >
        {onBack && (
          <button
            type="button"
            data-slot="detail-page-back-btn"
            onClick={onBack}
            className={styles.backBtn}
          >
            <ArrowLeft size={13} strokeWidth={1.75} />
            {backLabel}
          </button>
        )}

        <div data-slot="detail-page-header-area">
          <PageHeader density={density} title={title} description={subtitle} actions={actions} />
          {meta && <div data-slot="detail-page-meta" className={styles.metaWrap}>{meta}</div>}
        </div>

        {above && <div data-slot="detail-page-above">{above}</div>}

        {tabs.length > 0 ? (
          <div>
            <Tabs density={density} tabs={tabItems} value={activeTab} onChange={setActiveTab} />

            <div data-slot="detail-page-tab-body" className={styles.tabBody}>
              <div
                id={`tabpanel-${activeTab}`}
                role="tabpanel"
                data-slot="detail-page-panel"
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
                  data-slot="detail-page-rail"
                  className={styles.rail}
                  style={{ display: contextRailOpen ? "block" : "none" }}
                >
                  {contextRail}
                </aside>
              )}
            </div>
          </div>
        ) : (
          <div data-slot="detail-page-tab-body" className={styles.tabBody}>
            <div data-slot="detail-page-panel" className={styles.panel}>
              {loading ? <div className={styles.skeletonLoading} /> : (main ?? children)}
            </div>
            {(sidebar || contextRail) && (
              <aside
                aria-label="Detail Sidebar"
                data-slot="detail-page-rail"
                className={styles.rail}
                style={{ display: contextRailOpen ? "block" : "none" }}
              >
                {sidebar ?? contextRail}
              </aside>
            )}
          </div>
        )}
      </div>
    );
  }
);

DetailPageTemplate.displayName = "DetailPageTemplate";


