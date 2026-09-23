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

export {
  type SelectOption,
} from "./inputs";

export * from "./data-grid";
export * from "./forms";
export * from "./layout";
export * from "./shell";
export * from "./studio";
export * from "./dashboard";
export * from "./charts";
export * from "./theme";
export * from "./brand";
export * from "./feedback";
export * from "./tokens";
export * from "./hooks";
export * from "./utils";
export * as Icons from "./icons";

// Explicit non-conflicting exports from workflow
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
  ActivityWorkLogStream,
  type ActivityWorkLogStreamProps,
  type WorkLogEntry,
  type WorkLogEntryType,
  WorkflowGraph,
  type WorkflowGraphProps,
  type WorkflowNode,
  type WorkflowEdge,
  type WorkflowNodeStatus,
  BpmnPalette,
  type BpmnPaletteProps,
  BpmnSimulationBar,
  type BpmnSimulationBarProps,
  EntityLineage,
  type EntityLineageProps,
  AlertRuleConditionBuilder,
  type AlertRuleConditionBuilderProps,
} from "./workflow";
