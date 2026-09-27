# UniERP Design System — Downstream Consumer Usage Audit

**Date:** 2026-09-27 | **Scope:** 10 Consumer Repositories in Monorepo

## 1. Summary Metrics

- **Distinct Imported Symbols:** 142
- **Total Import Occurrences:** 6259

## 2. All Imported Symbols by Total Usage

| Symbol | Total Uses | Business Suite | Developer Platform | Tenant Admin | Provider Admin | Others |
|---|---|---|---|---|---|---|
| `Card` | **701** | 521 | 15 | 22 | 142 | shared: 1 |
| `Button` | **653** | 500 | 24 | 28 | 97 | shared: 4 |
| `Spinner` | **599** | 446 | 2 | 31 | 118 | shared: 2 |
| `PageHeader` | **599** | 519 | 52 | 26 | 1 | shared: 1 |
| `Badge` | **561** | 352 | 14 | 22 | 171 | shared: 2 |
| `DataTable` | **447** | 397 | 24 | 19 | 6 | shared: 1 |
| `Column` | **252** | 236 | 2 | 13 | 0 | shared: 1 |
| `useToast` | **233** | 187 | 5 | 7 | 33 | shared: 1 |
| `StatCardRow` | **193** | 65 | 3 | 5 | 120 | - |
| `Modal` | **183** | 141 | 7 | 8 | 27 | - |
| `ListPageTemplate` | **151** | 128 | 6 | 17 | 0 | - |
| `ListColumn` | **151** | 128 | 6 | 17 | 0 | - |
| `EmptyState` | **136** | 0 | 6 | 2 | 125 | shared: 3 |
| `StatCardItem` | **124** | 2 | 0 | 1 | 121 | - |
| `KPICard` | **117** | 114 | 1 | 2 | 0 | - |
| `FormField` | **113** | 77 | 4 | 9 | 22 | shared: 1 |
| `StatusBadge` | **97** | 83 | 7 | 7 | 0 | - |
| `Select` | **85** | 68 | 2 | 5 | 7 | shared: 3 |
| `Input` | **76** | 44 | 3 | 0 | 26 | shared: 3 |
| `TextField` | **74** | 64 | 2 | 8 | 0 | - |
| `SubTabBar` | **66** | 53 | 5 | 8 | 0 | - |
| `usePermission` | **65** | 0 | 0 | 0 | 64 | shared: 1 |
| `SubTab` | **60** | 51 | 1 | 8 | 0 | - |
| `ProtectedComponent` | **55** | 49 | 1 | 5 | 0 | - |
| `ModuleTab` | **34** | 30 | 2 | 2 | 0 | - |
| `Tabs` | **29** | 20 | 9 | 0 | 0 | - |
| `DashboardChart` | **29** | 29 | 0 | 0 | 0 | - |
| `ConfirmDialog` | **29** | 2 | 21 | 2 | 4 | - |
| `ForbiddenState` | **20** | 0 | 0 | 0 | 20 | - |
| `Pagination` | **19** | 16 | 0 | 1 | 1 | shared: 1 |
| `Textarea` | **17** | 10 | 1 | 4 | 1 | shared: 1 |
| `ChangeHistory` | **16** | 15 | 1 | 0 | 0 | - |
| `PageLoadingState` | **15** | 0 | 15 | 0 | 0 | - |
| `DataWorkspace` | **13** | 0 | 0 | 0 | 13 | - |
| `SortOrder` | **12** | 11 | 0 | 0 | 1 | - |
| `BrandMark` | **12** | 1 | 1 | 10 | 0 | - |
| `ThemeQuickToggle` | **12** | 1 | 1 | 10 | 0 | - |
| `ViewSwitcher` | **8** | 7 | 0 | 0 | 0 | shared: 1 |
| `ErrorState` | **8** | 0 | 0 | 0 | 8 | - |
| `ViewMode` | **7** | 6 | 0 | 0 | 0 | shared: 1 |
| `PageErrorState` | **7** | 0 | 7 | 0 | 0 | - |
| `Drawer` | **6** | 3 | 1 | 2 | 0 | - |
| `ThemeProvider` | **6** | 1 | 2 | 1 | 2 | - |
| `ModuleTabLayout` | **5** | 1 | 2 | 2 | 0 | - |
| `DashboardKPICard` | **4** | 3 | 0 | 0 | 1 | - |
| `useTheme` | **4** | 3 | 0 | 1 | 0 | - |
| `KanbanBoard` | **4** | 2 | 0 | 0 | 1 | shared: 1 |
| `KanbanItem` | **4** | 2 | 0 | 0 | 1 | shared: 1 |
| `Disclosure` | **4** | 3 | 0 | 1 | 0 | - |
| `StudioShell` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioToolbar` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioPalette` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioCanvas` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioInspector` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioConsole` | **4** | 0 | 4 | 0 | 0 | - |
| `PublishDiffDialog` | **4** | 0 | 4 | 0 | 0 | - |
| `PaletteGroup` | **4** | 0 | 4 | 0 | 0 | - |
| `PublishChange` | **4** | 0 | 4 | 0 | 0 | - |
| `StudioProblem` | **4** | 0 | 4 | 0 | 0 | - |
| `FilterBar` | **4** | 0 | 0 | 0 | 4 | - |
| `LoadingState` | **4** | 0 | 0 | 0 | 4 | - |
| `KanbanColumn` | **3** | 2 | 0 | 0 | 1 | - |
| `PermissionContext` | **3** | 2 | 0 | 0 | 1 | - |
| `PageEmptyState` | **3** | 0 | 3 | 0 | 0 | - |
| `ArtifactAddress` | **3** | 0 | 3 | 0 | 0 | - |
| `StrataBar` | **2** | 1 | 0 | 0 | 1 | - |
| `ToastProvider` | **2** | 1 | 1 | 0 | 0 | - |
| `Skeleton` | **2** | 0 | 1 | 0 | 1 | - |
| `useCommandPalette` | **2** | 0 | 1 | 0 | 1 | - |
| `Stepper` | **2** | 0 | 0 | 1 | 1 | - |
| `Sparkline` | **2** | 0 | 0 | 2 | 0 | - |
| `ColumnPicker` | **2** | 0 | 0 | 0 | 1 | shared: 1 |
| `TransactionWorkspace` | **1** | 1 | 0 | 0 | 0 | - |
| `TransactionSummaryItem` | **1** | 1 | 0 | 0 | 0 | - |
| `DetailPageTemplate` | **1** | 1 | 0 | 0 | 0 | - |
| `TrialCountdown` | **1** | 1 | 0 | 0 | 0 | - |
| `DemoBanner` | **1** | 1 | 0 | 0 | 0 | - |
| `MeridianBar` | **1** | 1 | 0 | 0 | 0 | - |
| `DrillDownModal` | **1** | 1 | 0 | 0 | 0 | - |
| `ModuleTabLayoutProps` | **1** | 1 | 0 | 0 | 0 | - |
| `ThemeSetting` | **1** | 1 | 0 | 0 | 0 | - |
| `TabbedConsole` | **1** | 1 | 0 | 0 | 0 | - |
| `KeyboardShortcutsHelp` | **1** | 1 | 0 | 0 | 0 | - |
| `StrataAppGrid` | **1** | 1 | 0 | 0 | 0 | - |
| `AppTile` | **1** | 1 | 0 | 0 | 0 | - |
| `DEFAULT_STRATA_APPS` | **1** | 1 | 0 | 0 | 0 | - |
| `TabContextMenu` | **1** | 1 | 0 | 0 | 0 | - |
| `TabContextMenuProps` | **1** | 1 | 0 | 0 | 0 | - |
| `ContextMenuTarget` | **1** | 1 | 0 | 0 | 0 | - |
| `PlatformShell` | **1** | 0 | 1 | 0 | 0 | - |
| `Alert` | **1** | 0 | 1 | 0 | 0 | - |
| `HeroBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `TrustBarBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `FeaturesGridBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `SocialProofBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `HowItWorksBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `PricingBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `FaqBlock` | **1** | 0 | 1 | 0 | 0 | - |
| `CommandPalette` | **1** | 0 | 1 | 0 | 0 | - |
| `CommandItem` | **1** | 0 | 1 | 0 | 0 | - |
| `ShellUser` | **1** | 0 | 1 | 0 | 0 | - |
| `ShellTenant` | **1** | 0 | 1 | 0 | 0 | - |
| `resolveManifestNav` | **1** | 0 | 1 | 0 | 0 | - |
| `DeveloperNav` | **1** | 0 | 1 | 0 | 0 | - |
| `WorkspaceShell` | **1** | 0 | 1 | 0 | 0 | - |
| `WorkspaceIdentity` | **1** | 0 | 1 | 0 | 0 | - |
| `PlatformManifest` | **1** | 0 | 1 | 0 | 0 | - |
| `SiteShell` | **1** | 0 | 1 | 0 | 0 | - |
| `SiteNavItem` | **1** | 0 | 1 | 0 | 0 | - |
| `FooterSection` | **1** | 0 | 1 | 0 | 0 | - |
| `FooterLink` | **1** | 0 | 1 | 0 | 0 | - |
| `Tooltip` | **1** | 0 | 0 | 1 | 0 | - |
| `MiniDonutChart` | **1** | 0 | 0 | 1 | 0 | - |
| `TagInput` | **1** | 0 | 0 | 0 | 1 | - |
| `SavedViewSwitcher` | **1** | 0 | 0 | 0 | 1 | - |
| `SavedView` | **1** | 0 | 0 | 0 | 1 | - |
| `DropdownMenu` | **1** | 0 | 0 | 0 | 1 | - |
| `FormSection` | **1** | 0 | 0 | 0 | 1 | - |
| `DescriptionList` | **1** | 0 | 0 | 0 | 1 | - |
| `BadgeProps` | **1** | 0 | 0 | 0 | 1 | - |
| `ActivityFeed` | **1** | 0 | 0 | 0 | 1 | - |
| `ActivityItem` | **1** | 0 | 0 | 0 | 1 | - |
| `ColumnPickerOption` | **1** | 0 | 0 | 0 | 1 | - |
| `SchemaForm` | **1** | 0 | 0 | 0 | 1 | - |
| `FormSectionSchema` | **1** | 0 | 0 | 0 | 1 | - |
| `FormWizard` | **1** | 0 | 0 | 0 | 1 | - |
| `FormWizardStep` | **1** | 0 | 0 | 0 | 1 | - |
| `DomainShell` | **1** | 0 | 0 | 0 | 1 | - |
| `GovernanceStrip` | **1** | 0 | 0 | 0 | 1 | - |
| `AdminAppSwitcher` | **1** | 0 | 0 | 0 | 1 | - |
| `useOptionalTheme` | **1** | 0 | 0 | 0 | 1 | - |
| `SideNav` | **1** | 0 | 0 | 0 | 1 | - |
| `SideNavSection` | **1** | 0 | 0 | 0 | 1 | - |
| `SideNavItem` | **1** | 0 | 0 | 0 | 1 | - |
| `StageProgressionBar` | **1** | 0 | 0 | 0 | 1 | - |
| `LifecycleTracker` | **1** | 0 | 0 | 0 | 1 | - |
| `ApprovalChain` | **1** | 0 | 0 | 0 | 1 | - |
| `StageItem` | **1** | 0 | 0 | 0 | 1 | - |
| `LifecycleStage` | **1** | 0 | 0 | 0 | 1 | - |
| `ApprovalStep` | **1** | 0 | 0 | 0 | 1 | - |
| `InfoHint` | **1** | 0 | 0 | 0 | 0 | shared: 1 |
| `exportToCsv` | **1** | 0 | 0 | 0 | 0 | shared: 1 |
