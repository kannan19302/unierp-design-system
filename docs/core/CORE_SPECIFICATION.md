# Core Design System Specification (`@kannan19302/ui/core`)

## 1. Scope & Purpose
`src/core/` houses all platform-agnostic enterprise UI primitives, inputs, data grids, navigation elements, overlays, and floorplans. These components form the shared building blocks composed by all UniERP client applications.

## 2. Component Taxonomy
- **`tokens`**: CSS variables for color, typography, spacing, radii, elevation, density, motion, and platform accents.
- **`theme`**: ThemeScope, ThemeProvider, ThemeQuickToggle, ThemeCustomizer.
- **`styles`**: Reset stylesheet, global utilities, CSS variables loader.
- **`brand`**: BrandMark, enterprise logo variants.
- **`icons`**: Standardized Lucide icon mappings and enterprise SVG marks.
- **`primitives`**: Atomic controls (`Button`, `Badge`, `Avatar`, `Skeleton`, `Spinner`, `Alert`, `UserChip`, `PriorityIndicator`, `HealthScore`, `Tag`).
- **`inputs`**: Form controls (`Input`, `Select`, `Combobox`, `DatePicker`, `DateTimePicker`, `Checkbox`, `Switch`, `Slider`, `TagInput`, `CurrencyInput`, `PercentInput`, `FileUpload`).
- **`forms`**: Form structure (`FormField`, `FieldGroup`, `FieldSet`, `FormSection`, `FilterBar`, `RepeaterFieldGroup`, `MultiStepTransactionForm`).
- **`form-engine`**: Metadata-driven form generation, lookup resolvers, calculated field displays, validation summaries.
- **`data-display`**: Visual presentation (`Card`, `Timeline`, `StatCards`, `SplitView`, `EmptyState`, `ProgressHUD`, `AuditTrail`).
- **`data-grid`**: High-density tabular matrices (`Table`, `DataTable`, `PivotGrid`, `SpreadsheetGrid`, `KanbanBoard`, `VirtualizedTable`).
- **`filters`**: Faceted filtering rails, condition builders, query builders, and facet panels.
- **`navigation`**: Directional controls (`SideNav`, `Tabs`, `Breadcrumbs`, `Stepper`, `Pagination`, `CommandPalette`).
- **`overlays`**: Depth-layered surfaces (`Modal`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `DropdownMenu`, `ContextMenu`).
- **`feedback`**: User notification (`EscalationAlertStack`, `SystemStatusBar`, `AnnouncementCard`, `ProgressNotification`).
- **`charts`**: Financial and operational visualizations (`Recharts` abstractions, bullet charts, waterfall charts, treemaps, sparklines).
- **`dashboard`**: Executive summary grids, metric trend cards, comparison panels.
- **`layout`**: Page containers (`PageHeader`, `ListPageTemplate`, `DetailLayout`, `ContextRail`, `StatCardRow`).
- **`shell`**: The 8 Canonical Enterprise Floorplans (`DataWorkspace`, `RecordShell`, `TransactionWorkspace`, `OpsShell`, `PlanningWorkspace`, `SettingsShell`, `StudioShell`, `StrataBar`).
- **`workflow`**: Business process management (`ApprovalChain`, `LifecycleTracker`, `StageProgressionBar`, `PaymentRunCockpit`, `WarehousePickPackWaveConsole`).
- **`blocks`**: Composite marketing sections (`Hero`, `FeaturesGrid`, `Pricing`, `SocialProof`, `FAQ`, `CtaBanner`).
- **`studio`**: Visual designer canvas, palette, inspector.
- **`hooks`**: Encapsulated UI hooks (`useDisclosure`, `useScrollLock`, `useFocusTrap`, `useEscapeKey`, `useExcelClipboard`).
- **`utils`**: Core helper functions (`cn`, class merging, formatting, assertions).

## 3. The 5-File Uniform Anatomy Standard
Every component under `src/core/<category>/<name>/` MUST strictly adhere to the 5-file standard:
1. `<name>.tsx`: Logic, component interface, semantic HTML, ARIA attributes.
2. `<name>.module.css`: Token-governed scoped CSS module.
3. `<name>.stories.tsx`: CSF 3.0 Storybook story.
4. `<name>.test.tsx`: Vitest test suite with automated `vitest-axe` a11y audit.
5. `index.ts`: Barrel export.
