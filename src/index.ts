// ─────────────────────────────────────────────────
// @unerp/ui — the UniERP Design System, one package.
// The root barrel is the convenience surface; prefer a subpath so the
// consumer only pays for what it uses:
//   @unerp/ui/components, @unerp/ui/layout, @unerp/ui/charts,
//   @unerp/ui/data-grid, @unerp/ui/dashboard, @unerp/ui/notifications,
//   @unerp/ui/theme, @unerp/ui/tokens, @unerp/ui/hooks, @unerp/ui/utils,
//   @unerp/ui/icons, @unerp/ui/form-engine, @unerp/ui/workflow
// PLATFORM_ARCHITECTURE.md § 7.2 — the 13 @unerp/ui-* packages were merged
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
  Table,
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


