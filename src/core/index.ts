// ─────────────────────────────────────────────────
// @kannan19302/ui/core — Core Enterprise Design System Primitives & Components
// ─────────────────────────────────────────────────

export * from "./primitives";
export * from "./inputs";
export * from "./overlays";
export * from "./navigation";
export * from "./data-display";

// Explicitly resolve re-export ambiguity for V3 primitives
export {
  Input,
  type InputProps,
  Textarea,
  type TextareaProps,
  Collapsible,
  type CollapsibleProps,
} from "./primitives";
export * from "./data-grid";
export * from "./forms";
export * from "./layout";
export * from "./shell";
export * from "./studio";
export * from "./dashboard";
export * from "./charts";
export * from "./theme";
export * from "./blocks";
export * from "./brand";
export * from "./filters";
export * from "./feedback";
export * from "./patterns";
export * from "./templates";
export * from "./hooks";
export * from "./utils";
export * as Icons from "./icons";

// Explicit non-conflicting exports from workflow, form-engine, notifications
export {
  ApprovalChain,
  type Approver,
  type ApprovalStatus,
  type ApprovalChainProps,
  LifecycleTracker,
  type LifecycleStage,
  type LifecycleTrackerProps,
  StageProgressionBar,
  type StageProgressionBarProps,
  type StageItem,
  type StageStatus,
  type StageDensity,
  PeriodCloseCockpit,
  type PeriodCloseCockpitProps,
  type CloseTask,
  type CloseTaskStatus,
  type CockpitDensity,
  ActivityWorkLogStream,
  type ActivityWorkLogStreamProps,
  type WorkLogEntry,
  type WorkLogEntryType,
  AllocationRuleBuilder,
  type AllocationRuleBuilderProps,
  type AllocationTarget,
  type AllocationBasisType,
  TopologyDependencyGraph,
  type TopologyDependencyGraphProps,
  type TopologyNode,
  type TopologyEdge,
  type TopologyNodeType,
  type TopologyHealth,
  IncidentEscalationTree,
  type IncidentEscalationTreeProps,
  type EscalationTier,
  type EscalationResponder,
  type NotificationChannelType,
  type ResponderStatus,
  ReleasePipelineStepper,
  type ReleasePipelineStepperProps,
  type ReleaseStage,
  type PipelineStageStatus,
  PromotionApprovalInspector,
  type PromotionApprovalInspectorProps,
  type PromotionChangesSummary,
  type ReleaseRiskLevel,
} from "./workflow";

export {
  SettingsPage,
  type SettingsPageProps,
  type SettingSchemaEntry,
  type SettingScope,
  type SettingType,
  SchemaForm,
  type SchemaFormProps,
  type FormFieldSchema,
  type FormSectionSchema,
  type FormFieldType,
} from "./form-engine";

export {
  DemoBanner,
  type DemoBannerProps,
  NotificationCenter,
  type NotificationCenterProps,
  type NotificationItem,
  type NotificationPriority,
  type NotificationCategory,
} from "./notifications";
