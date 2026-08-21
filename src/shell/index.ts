/**
 * `@kannan19302/ui/shell` — the navigation contract every UniERP platform
 * shares: one header/sidebar frame (`PlatformShell`), two distinct wizard
 * grids that must never be interchanged (`PlatformWizardGrid`,
 * `AppWizardGrid`), and the manifest schema each platform declares its own
 * nav tree and permission map against.
 *
 * The page-level empty/loading/error/unauthorized states this module's
 * components use already existed in this package before W3 —
 * `LoadingState` / `ErrorState` / `EmptyState` / `ForbiddenState` in
 * `../components/six-states` — and are re-exported here under the names the
 * platform plan uses, so a consumer of `@kannan19302/ui/shell` finds
 * everything the navigation layer needs at one import path.
 */

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
} from "../components/six-states";

export {
  type PlatformManifest,
  type PlatformNavItem,
  resolveManifestNav,
} from "./manifest";
