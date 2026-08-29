/**
 * @kannan19302/ui-workflow — workflow & approval-chain UI composites.
 * Pre-v1 this re-exports the stepper primitives; richer workflow
 * visualisations (approval chains, state diagrams) land here post-v1.
 */
export {
  Stepper,
  type StepperProps,
  type StepperStep,
} from "../navigation/stepper";

export {
  AutosaveIndicator,
  type AutosaveStatus,
} from "../inputs/form-control";

export {
  ApprovalChain,
  type ApprovalStep,
  type Approver,
  type ApprovalStatus,
  type ApprovalChainProps,
} from "./approval-chain";

export {
  LifecycleTracker,
  type LifecycleStage,
  type LifecycleTrackerProps,
} from "./lifecycle-tracker";

export {
  WorkflowGraph,
  type WorkflowGraphProps,
  type WorkflowNode,
  type WorkflowEdge,
  type WorkflowNodeStatus,
} from "./workflow-graph";

export {
  EntityLineage,
  type EntityLineageProps,
  type LineageItem,
} from "./entity-lineage";

