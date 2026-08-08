// ─────────────────────────────────────────────────
// @kannan19302/ui — the UniERP Design System, one package.
// The root barrel is the convenience surface; prefer a subpath so the
// consumer only pays for what it uses:
//   @kannan19302/ui/components, @kannan19302/ui/layout, @kannan19302/ui/charts,
//   @kannan19302/ui/data-grid, @kannan19302/ui/dashboard, @kannan19302/ui/notifications,
//   @kannan19302/ui/theme, @kannan19302/ui/tokens, @kannan19302/ui/hooks, @kannan19302/ui/utils,
//   @kannan19302/ui/icons, @kannan19302/ui/form-engine, @kannan19302/ui/workflow
// PLATFORM_ARCHITECTURE.md § 7.2 — the 13 @kannan19302/ui-* packages were merged
// here so the extraction in Phase 3 publishes one artifact, not fourteen.
// ─────────────────────────────────────────────────

export * from "./components";
export {
  ViewSwitcher,
  StatCardRow,
  ListPageTemplate,
  DetailPageTemplate,
  ModuleTabLayout,
  SubTabBar,
  type ViewSwitcherProps,
  type ViewMode,
  type StatCardRowProps,
  type StatCardItem,
  type ListPageTemplateProps,
  type ListColumn,
  type ListPageFilter,
  type ListPaginationProps,
  type DetailPageTemplateProps,
  type DetailTab,
  type ModuleTabLayoutProps,
  type ModuleTab,
  type SubTabBarProps,
  type SubTab,
} from "./layout";
export * from "./charts";
export {
  DataTable,
  KanbanBoard,
  ColumnPicker,
  toCsv,
  exportToCsv,
  type Column,
  type SortOrder,
  type DataTableProps,
  type KanbanBoardProps,
  type KanbanColumn,
  type KanbanItem,
  type ColumnPickerProps,
  type ColumnPickerOption,
} from "./data-grid";
export * from "./dashboard";
export {
  ToastProvider,
  useToast,
  DemoBanner,
  type ToastOptions,
  type ToastVariant,
  type DemoBannerProps,
} from "./notifications";
export {
  ThemeProvider,
  useTheme,
  THEMES,
  DEFAULT_THEME,
  type ThemeName,
  type ThemeSetting,
  type ThemeProviderProps,
  type BrandingTokens,
  DENSITIES,
  DEFAULT_DENSITY,
  type DensityName,
} from "./theme";

// Website Builder Blocks
export {
  HeroBlock,
  TrustBarBlock,
  FeaturesGridBlock,
  SocialProofBlock,
  HowItWorksBlock,
  PricingBlock,
  FaqBlock,
  type HowItWorksBlockProps,
} from "./blocks";


