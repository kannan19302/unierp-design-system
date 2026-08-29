// ─────────────────────────────────────────────────
// @kannan19302/ui — UniERP Design Language 1.0 ("Meridian Instrument")
// Unified Public Root Barrel Export
// ─────────────────────────────────────────────────

export * from "./primitives";
export * from "./inputs";
export * from "./overlays";
export * from "./navigation";
export * from "./data-display";
export * from "./data-grid";
export * from "./forms";
export * from "./layout";
export * from "./shell";
export * from "./studio";
export * from "./dashboard";
export * from "./charts";
export * from "./theme";
export * from "./blocks";

// Explicit non-conflicting exports from workflow, form-engine, notifications
export {
  ApprovalChain,
  type Approver,
  type ApprovalStatus,
  type ApprovalChainProps,
  LifecycleTracker,
  type LifecycleStage,
  type LifecycleTrackerProps,
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
