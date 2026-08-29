/**
 * @kannan19302/ui-workflow — workflow & approval-chain UI composites.
 * Pre-v1 this re-exports the stepper primitives; richer workflow
 * visualisations (approval chains, state diagrams) land here post-v1.
 */
export {
  Stepper,
  AutosaveIndicator,
  type StepperProps,
  type StepperStep,
  type AutosaveStatus,
} from "../components";

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
