/**
 * `@kannan19302/ui/shell` — the navigation contract every UniERP platform
 * shares: one header/sidebar frame (`PlatformShell`), two distinct wizard
 * grids that must never be interchanged (`PlatformWizardGrid`,
 * `AppWizardGrid`), and the manifest schema each platform declares its own
 * nav tree and permission map against.
 *
 * Meridian Workbench 7 Core Floorplans:
 * 1. DataWorkspace (List / Ledger / Table)
 * 2. RecordWorkspace (Object / Record details)
 * 3. TransactionWorkspace (Document / Line-items / Vouchers)
 * 4. OperationalWorkspace (Operations / Workbenches / Queues)
 * 5. PlanningWorkspace (Gantt / Timeline / Scheduling)
 * 6. SettingsWorkspace (Configuration / Preferences)
 * 7. StudioWorkspace (Visual Builders / Studio)
 */

export {
  StrataBar,
  type StrataBarProps,
  type StrataState,
  type StrataScope,
  type LifecycleStep,
} from "./strata-bar";

export {
  TabbedConsole,
  type TabbedConsoleProps,
  type ConsoleTab,
} from "./tabbed-console";

export {
  SplitViewShell,
  type SplitViewShellProps,
} from "./split-view-shell";

export {
  MeridianBar,
  formatSegments,
  type MeridianBarProps,
  type MeridianSegment,
  type MeridianAction,
  type MeridianState,
  type MeridianScope,
} from "./meridian-bar";


export {
  DataWorkspace,
  type DataWorkspaceProps,
  type DataWorkspaceColumn,
  type DataWorkspaceFilter,
  type DataWorkspacePagination,
} from "./data-workspace";

export {
  TransactionWorkspace,
  type TransactionWorkspaceProps,
  type TransactionSummaryItem,
} from "./transaction-workspace";

export {
  PlanningWorkspace,
  type PlanningWorkspaceProps,
  type PlanningTimeframe,
} from "./planning-workspace";

export {
  RecordShell,
  RecordShell as RecordWorkspace,
  ObjectPage,
  type RecordShellProps,
  type ObjectPageProps,
  type ObjectSection,
} from "./record-shell";

export {
  WorkbenchShell,
  WorkbenchShell as OperationalWorkspace,
  type WorkbenchShellProps,
} from "./workbench-shell";

export {
  SettingsShell,
  SettingsShell as SettingsWorkspace,
  type SettingsShellProps,
  type SettingsItem,
} from "./settings-shell";

export {
  CatalogShell,
  CatalogGallery,
  CatalogListing,
  type CatalogShellProps,
  type CatalogFacet,
  type CatalogFacetOption,
  type CatalogTile,
  type CatalogListingProps,
  type CatalogPermission,
} from "./catalog-shell";

export {
  OpsShell,
  type OpsShellProps,
  type OpsMetric,
  type OpsDomain,
  type OpsRailItem,
  type OpsHealth,
} from "./ops-shell";

export {
  LaunchShell,
  type LaunchShellProps,
  type LaunchPlate,
} from "./launch-shell";

export {
  EditorialShell,
  EditorialBand,
  Eyebrow,
  HeroTitle,
  BandTitle,
  Lede,
  type EditorialShellProps,
  type EditorialBandProps,
  type BandTone,
} from "./editorial-shell";

export {
  PlatformShell,
  type PlatformShellProps,
  type ShellUser,
  type ShellTenant,
  type ShellPlatformSummary,
} from "./platform-shell";

export {
  WorkspaceShell,
  type WorkspaceShellProps,
  type WorkspaceNavItem,
  type WorkspaceIdentity,
  type WorkspaceScope,
} from "./workspace-shell";

export {
  PlatformWizardGrid,
  AppWizardGrid,
  type WizardTile,
} from "./wizard-grid";

export {
  LoadingState as PageLoadingState,
  ErrorState as PageErrorState,
  EmptyState as PageEmptyState,
  ForbiddenState as PageUnauthorizedState,
} from "../data-display/empty-state";

export {
  InspectorShell,
  type InspectorShellProps,
} from "./inspector-shell";

export {
  type PlatformManifest,
  type PlatformNavItem,
  resolveManifestNav,
} from "./manifest";
