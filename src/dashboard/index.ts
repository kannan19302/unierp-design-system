"use client";

// @kannan19302/ui-dashboard — dashboard composites
export {
  DashboardKPICard,
  type DashboardKPICardProps,
} from "./dashboard-kpi-card";
export {
  DrillDownModal,
  type DrillDownModalProps,
  type DrillDownColumn,
} from "./drill-down-modal";
export {
  MultiPageDashboard,
  type MultiPageDashboardProps,
  type DashboardPage,
} from "./multi-page-dashboard";
export {
  OperationalDashboard,
  type OperationalDashboardProps,
} from "./operational-dashboard";
export {
  ActivityFeed,
  type ActivityFeedProps,
  type ActivityItem,
  type AuditActionType,
  type FieldDiff,
} from "./activity-feed";


export { ExecutiveSummaryDashboard, type ExecutiveSummaryDashboardProps } from "./executive-summary-dashboard";
export { FinancialStatementViewer, type FinancialStatementViewerProps } from "./financial-statement-viewer";
export { RealTimeMetricsBoard, type RealTimeMetricsBoardProps } from "./real-time-metrics-board";
export { DashboardGridLayout, type DashboardGridLayoutProps } from "./dashboard-grid-layout";
export { CrossFilterDashboard, type CrossFilterDashboardProps } from "./cross-filter-dashboard";
export { ComparisonPanel, type ComparisonPanelProps } from "./comparison-panel";
export { DashboardWidgetToolbar, type DashboardWidgetToolbarProps } from "./dashboard-widget-toolbar";
export { MetricTrendCard, type MetricTrendCardProps } from "./metric-trend-card";
export { AlertThresholdConfigurator, type AlertThresholdConfiguratorProps } from "./alert-threshold-configurator";
export { EmbeddedReportFrame, type EmbeddedReportFrameProps } from "./embedded-report-frame";
