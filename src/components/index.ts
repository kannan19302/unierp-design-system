"use client";

// @kannan19302/ui-components — UniERP Design System primitives
export { Button, type ButtonProps } from "./button";
export { Badge, type BadgeProps } from "./badge";
export { StatusBadge, type StatusBadgeProps } from "./status-badge";
export {
  ArtifactAddress,
  formatAddress,
  type ArtifactAddressProps,
  type AddressScope,
} from "./artifact-address";
export { Card, type CardProps } from "./card";
export { Spinner, type SpinnerProps } from "./spinner";
export {
  Skeleton,
  SkeletonText,
  type SkeletonProps,
  type SkeletonTextProps,
} from "./skeleton";
export { EmptyState, type EmptyStateProps } from "./empty-state";
export {
  Modal,
  ConfirmDialog,
  type ModalProps,
  type ConfirmDialogProps,
} from "./modal";
export {
  FormField,
  Input,
  Textarea,
  Select,
  TextField,
  type FormFieldProps,
  type InputProps,
  type TextareaProps,
  type SelectProps,
} from "./form";
export {
  Tabs,
  Pagination,
  Disclosure,
  type TabsProps,
  type TabItem,
  type PaginationProps,
  type DisclosureProps,
} from "./navigation";
export {
  Stepper,
  FormSection,
  AutosaveIndicator,
  type StepperProps,
  type StepperStep,
  type FormSectionProps,
  type AutosaveIndicatorProps,
  type AutosaveStatus,
} from "./stepper";
export {
  ProtectedComponent,
  ProtectedField,
  PermissionContext,
  usePermission,
  useFieldAccess,
  type ProtectedComponentProps,
  type ProtectedFieldProps,
} from "./protected-component";
export { DatePicker, type DatePickerProps } from "./date-picker";
export { ComboBox, type ComboBoxProps, type ComboBoxOption } from "./combobox";
export { InfoHint, type InfoHintProps } from "./info-hint";
export { ProgressHUD, type ProgressHUDProps, type ProgressHUDItem } from "./progress-hud";
export { BrandMark, type BrandMarkProps } from "./brand-mark";
export { TrialCountdown, type TrialCountdownProps } from "./trial-countdown";

export { ContextRail, type ContextRailProps, type ContextRailTab } from "./context-rail";
export { ActionBar, type ActionBarProps, type ActionItem } from "./action-bar";
export { KPIStrip, type KPIStripProps, type KPICardItem } from "./kpi-strip";

// Stage B-I Primitive Exports
export * from "./overlays";
export * from "./feedback";
export * from "./extended-navigation";
export * from "./extended-inputs";
export * from "./temporal";
export * from "./heavy-inputs";
export * from "./structure";
export * from "./identity";
export * from "./enterprise-patterns";
export * from "./six-states";

