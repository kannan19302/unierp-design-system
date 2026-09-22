# Platform UI Specification (`@kannan19302/ui/platforms`)

## 1. Architectural Philosophy
In accordance with the UniERP Master Platform Architecture and PLT-DS standards, **the Design System is the exclusive owner of all visual UI components across the polyrepo**.

Consumer repositories (Layer 4 and 5) own:
- Application routing and entrypoints
- Data fetching, mutations, and cache management
- Business rules, domain validation, and permission evaluation
- View-model assembly and composition of design system components

Consumer repositories **do not own** bespoke visual components, local styled wrappers, custom CSS modules, or inline style overrides. Any presentation requiring domain- or platform-specific characteristics is owned inside `design-system/src/platforms/<platform>/`.

## 2. Platform Taxonomy
1. **`provider-admin` (`@kannan19302/ui/platforms/provider-admin`)**:
   - `AdminAppSwitcher`: Waffle grid launcher for 12 provider control plane modules.
   - `ConsoleShell`: Provider administrative shell orchestrator with breadcrumb and context bar.
   - `TopBar`: Control plane header with operator profile and search trigger.
   - `EnvironmentBanner` & `ImpersonationBanner`: Production/staging state indicators and break-glass warnings.
   - `PrivilegedCommandModal`: Elevated-privilege action execution modal with dual-control review.
   - `BreakGlassAction`: Emergency override trigger button with audit confirmation.
   - `RealTimeIndicator`: WebSocket connection state badge.
2. **`tenant-admin` (`@kannan19302/ui/platforms/tenant-admin`)**:
   - `SettingsTabLayout`: Multi-tab administrative preferences navigation.
   - `SubscriptionsTabLayout`: Tier licensing and billing overview layout.
3. **`business-suite` (`@kannan19302/ui/platforms/business-suite`)**:
   - `shared/ModuleTabLayout`: Standard domain module navigation tabs with active indicator.
   - `shared/BatchActionBar`: Floating multi-row selection action drawer.
   - `shared/RowContextMenu`: Entity contextual dropdown menu.
   - `shared/FinanceErrorBoundary`: Financial ledger crash recovery view.
   - `shared/OnboardingChecklist`: ERP master-data setup checklist drawer.
   - `shared/StrataAppGrid`: Interactive 40+ module application launcher grid.
4. **`developer-platform` (`@kannan19302/ui/platforms/developer-platform`)**:
   - `BuilderSidebar`: Visual designer drag-and-drop component palette.
   - `BuilderProperties`: Component attribute and styling inspector drawer.
   - `ProjectOverview`: Developer workspace release and deployment card.
   - `StudioRouteFrame`: Live iframe / canvas container for visual page preview.
5. **`marketing` (`@kannan19302/ui/platforms/marketing`)**:
   - `AnimatedCounter`: Tabular numeric ease-out counter.
   - `MagneticButton`: Physics-based cursor attraction interactive button.
   - `TiltCard`: 3D perspective hover card.
   - `HeroLeadForm`: Enterprise lead capture form with instant validation.
6. **`mobile` & `desktop` (`@kannan19302/ui/platforms/mobile`, `desktop`)**:
   - Generated tokens for Flutter (`tokens.g.dart`) and Tauri desktop window frame chrome.

## 3. Strict Dependency Rules
- `core` cannot import `platforms`
- Platform A cannot import private internal files of Platform B (extract shared UI to core or `platforms/shared`)
- Platform components must adhere to the 5-file uniform anatomy
