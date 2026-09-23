# Strata DL 3.0 — Component Inventory & Deduplication Registry

> **Version**: 3.0.0 | **Updated**: 2026-09-23
>
> This is the canonical component inventory for the UniERP Strata Design System.
> Before creating ANY new component, search this registry for semantic duplicates.

---

## 1. shadcn → Strata Mapping

Every shadcn/ui generic component is mapped to an existing or planned Strata component.
**No consuming app may import shadcn directly.** All access flows through `@unierp/design-system`.

| # | shadcn Component | Strata Location | Status | Notes |
|---|---|---|---|---|
| 1 | Accordion | `primitives/accordion` → `data-display/accordion` | ✅ Exists | |
| 2 | Alert | `primitives/alert` | ✅ Exists | |
| 3 | Alert Dialog | `overlays/modal` (variant: `confirm`) | ✅ Covered | Use Modal with `variant="confirm"` |
| 4 | Aspect Ratio | CSS utility (`aspect-ratio`) | ✅ Token | Not a component — use CSS aspect-ratio |
| 5 | Avatar | `primitives/avatar` | ✅ Exists | 8-slot identity ramp, presence dot |
| 6 | Badge | `primitives/badge` | ✅ Exists | |
| 7 | Breadcrumb | `navigation/breadcrumb` | ✅ Exists | |
| 8 | Button | `primitives/button` | ✅ Exists | 5 variants, 4 sizes, density-aware |
| 9 | Calendar | `inputs/calendar` | ✅ Exists | |
| 10 | Card | `data-display/card` | ✅ Exists | |
| 11 | Carousel | — | 🔲 Planned | Low priority for enterprise |
| 12 | Chart | `charts/*` (16 chart types) | ✅ Exists | Recharts-based |
| 13 | Checkbox | `inputs/checkbox` | ✅ Exists | |
| 14 | Collapsible | `data-display/accordion` (single item mode) | ✅ Covered | Use Accordion variant |
| 15 | Combobox | `inputs/combobox` | ✅ Exists | |
| 16 | Command | `navigation/command-palette` | ✅ Exists | |
| 17 | Context Menu | `overlays/context-menu` | ✅ Exists | |
| 18 | Data Table | `data-grid/table`, `data-grid/virtualized-table` | ✅ Exists | Enterprise-grade |
| 19 | Date Picker | `inputs/date-picker` | ✅ Exists | |
| 20 | Dialog | `overlays/modal` | ✅ Exists | |
| 21 | Drawer | `overlays/drawer` | ✅ Exists | |
| 22 | Dropdown Menu | `overlays/dropdown-menu` | ✅ Exists | |
| 23 | Form | `forms/*`, `form-engine/*` | ✅ Exists | Enterprise form engine |
| 24 | Hover Card | `overlays/popover` (variant: `hover`) | ✅ Covered | Use Popover with hover trigger |
| 25 | Input | `inputs/form-control` | ✅ Exists | With FormControl wrapper |
| 26 | Input OTP | `inputs/form-control` (variant: `otp`) | 🔲 Planned | Add OTP variant to FormControl |
| 27 | Label | `inputs/form-control` (sub-component) | ✅ Covered | Part of FormControl |
| 28 | Menubar | `navigation/enterprise-command-ribbon` | ✅ Covered | Enterprise menu bar pattern |
| 29 | Navigation Menu | `navigation/sidenav` | ✅ Exists | |
| 30 | Pagination | `navigation/pagination` | ✅ Exists | |
| 31 | Popover | `overlays/popover` | ✅ Exists | |
| 32 | Progress | `primitives/progress` | ✅ Exists | |
| 33 | Radio Group | `inputs/radio-group` | ✅ Exists | |
| 34 | Resizable | `layout/split-screen-auditor` + CSS `resize` | ✅ Covered | |
| 35 | Scroll Area | CSS `overflow: auto` + scrollbar styling | ✅ Token | Not a component — use CSS |
| 36 | Select | `inputs/combobox` (variant: `select`) | ✅ Covered | Use Combobox single-select mode |
| 37 | Separator | CSS `<hr>` + separator tokens | ✅ Token | Use `--separator-*` tokens |
| 38 | Sheet | `overlays/drawer` | ✅ Covered | Drawer serves as Sheet |
| 39 | Sidebar | `navigation/sidenav`, `shell/workspace-shell` | ✅ Exists | |
| 40 | Skeleton | `primitives/skeleton` | ✅ Exists | |
| 41 | Slider | `inputs/slider` | ✅ Exists | |
| 42 | Sonner/Toast | `overlays/toast`, `notifications/toast` | ⚠️ Duplicate | **CONSOLIDATE**: Keep `overlays/toast` |
| 43 | Stepper | `navigation/stepper` | ✅ Exists | |
| 44 | Switch | `inputs/switch` | ✅ Exists | |
| 45 | Table | `data-grid/table` | ✅ Exists | |
| 46 | Tabs | `navigation/tabs` | ✅ Exists | |
| 47 | Textarea | `inputs/form-control` (variant: `textarea`) | ✅ Covered | |
| 48 | Toggle | `inputs/segmented-control` (single) | ✅ Covered | |
| 49 | Toggle Group | `inputs/segmented-control` | ✅ Exists | |
| 50 | Tooltip | `overlays/tooltip` | ✅ Exists | |

---

## 2. Duplicate Detection & Consolidation Actions

### ⚠️ Identified Duplicates

| Issue | Components Involved | Resolution |
|---|---|---|
| **Toast duplication** | `overlays/toast` + `notifications/toast` + `feedback/feedback-toast` | **CONSOLIDATE** → `overlays/toast` as canonical. Add feedback variants. Deprecate others. |
| **Alert duplication** | `primitives/alert` + `feedback/banner-alert` + `notifications/alert-banner` | **CONSOLIDATE** → `primitives/alert` as canonical with `banner` variant. |
| **Split view duplication** | `data-display/split-view` + `layout/split-screen-auditor` | **KEEP BOTH** — split-view is generic layout; split-screen-auditor is enterprise audit comparison |
| **Card variants** | `data-display/card` + `data-display/stat-card` + `data-display/project-card` + `dashboard/dashboard-kpi-card` | **KEEP** — Card is base; Stat/Project/KPI are semantic compositions |

### ✅ Valid Specializations (Not Duplicates)

These look similar by name but serve distinct enterprise purposes:

- `inputs/combobox` vs `inputs/multi-select`: Single-select vs multi-select with chip display
- `navigation/tabs` vs `navigation/sub-tab-bar`: Page-level vs nested section tabs
- `data-grid/table` vs `data-grid/virtualized-table` vs `data-grid/spreadsheet-grid`: Standard vs 10k+ rows vs editable spreadsheet
- `overlays/modal` vs `overlays/dual-control-modal`: Standard vs approval-required dual-control

---

## 3. Full Component Registry

### Layer 0: Tokens & Foundations
```
tokens/v3/
  primitives.css       — Raw color scales
  colors.css           — Semantic color roles
  typography.css       — Type system
  spacing.css          — Spatial scale
  radius.css           — Corner radius
  elevation.css        — Shadows & depth
  borders.css          — Border widths, dividers
  surfaces.css         — Surface hierarchy
  density.css          — 4-tier density matrix
  motion.css           — Easing & duration
  z-index.css          — Stacking layers
  focus.css            — Focus ring system
  icons.css            — Icon sizing
  charts.css           — Chart palette
  layout.css           — Shell dimensions
  opacity.css          — Opacity scale
  keyframes.css        — Standard animations
  platform-accents.css — Scope accent system
  themes/
    strata-dark.css
    strata-high-contrast.css
```

### Layer 1: Primitives (20 components)
```
primitives/
  alert              badge             button
  avatar             brand-mark        error-boundary
  health-score       info-hint         live-region
  presence           priority-indicator profile-card
  progress           protected-component skeleton
  spinner            split-button      tag
  trial-countdown    user-chip
```

### Layer 2: Inputs (30 components)
```
inputs/
  acl-policy-visualizer  calendar          checkbox
  code-editor            color-picker      combobox
  currency-input         date-picker       date-time-picker
  feature-rollout-slider file-upload       fiscal-period-picker
  form-control           image-upload      inline-edit
  multi-select           number-input      number-stepper
  percent-input          policy-simulator-inspector
  radio-group            record-field-policy-matrix
  rich-text-editor       scheduler         secret-environment-editor
  segmented-control      signature-pad     slider
  switch                 tag-input
```

### Layer 3: Overlays (13 components)
```
overlays/
  context-menu       drawer             dropdown-menu
  dual-control-modal focus-trap         loading-overlay
  modal              overlay-hooks      popover
  portal             shortcut-cheat-sheet toast
  tooltip
```

### Layer 4: Navigation (34 components)
```
navigation/
  app-launcher-waffle-grid      artifact-address
  bim-model-viewer-toolbar      blade-navigation-stack
  bottom-utility-dock-bar       breadcrumb
  canvas-minimap-navigator      catalog-schema-explorer-tree
  command-palette               contextual-action-floating-dock
  document-tab-bar              enterprise-command-ribbon
  faceted-filter-navigation-rail fact-box-nav-drawer
  guided-flow-step-navigator    hierarchical-path-dropdown-trail
  keyboard-shortcut-legend      master-detail-split-navigator
  omni-jump-navigator           pagination
  perspective-mode-switcher     pinned-bookmarks-bar
  recent-items-history-menu     record-anchor-navigation-strip
  saved-view-switcher           sidenav
  stage-path-navigator          stepper
  sub-tab-bar                   tabs
  temporal-timeline-scrubber    tenant-hierarchy-scope-selector
  workspace-global-rail         workspace-pane-layout-selector
```

### Layer 5: Data Display (56 components)
```
data-display/
  accordion                      api-rate-limit-throttle-console
  assessment-rubric-matrix        audit-trail
  cap-table-scenario-simulator    card
  cash-flow-forecast-waterfall    clause-library-browser
  compensation-band-range-visualizer  computational-notebook-cell
  compute-cluster-topology-map    container-exec-terminal-console
  currency-rate-matrix            database-query-explain-plan
  description-list                distributed-trace-flame-graph
  document-annotator              drawing-sheet-punch-annotator
  drug-allergy-interaction-matrix empty-state
  file-tree                       funnel-dropoff-analyzer
  gantt-milestone-scheduler       gitops-deployment-sync-tree
  graphql-schema-relationship-viewer  inpatient-acuity-scorecard
  inpatient-bed-board             kafka-consumer-group-lag-matrix
  kitchen-display-station-expediter   medication-administration-matrix
  merkle-proof-audit-trail-verifier   multi-calendar-availability-scheduler
  option-vesting-schedule-waterfall   order-ticket-rack
  org-chart-hierarchy-tree        progress-hud
  project-card                    project-hill-chart
  query-execution-plan-viewer     redline-diff-viewer
  resource-capacity-heatmap       rest-api-client-workbench
  restaurant-floorplan-table-map  shipment-tracking-milestone-tracker
  sla-performance-gauge           split-bill-calculator
  split-view                      stack-trace-inspector
  stat-card                       statistical-process-control-chart
  supply-chain-disruption-risk-heatmap  tenant-screening-scorecard
  time-range-scrubber             timeline
  tree-view                       visual-inspection-lens
  vital-signs-trend-strip
```

### Layer 6: Data Grid (43 components)
```
data-grid/
  audit-log-forensic-explorer     batch-reconciliation-matcher
  bill-of-materials-explosion-tree  bill-of-materials-tree-grid
  bin-location-grid               cam-expense-reconciliation-ledger
  change-history                  column-picker
  cross-filter-facet-panel        csv
  database-grant-privilege-matrix dns-zone-record-editor
  dock-door-scheduler             esg-emissions-calculator
  freight-carrier-rate-comparator gradebook-matrix-grid
  iam-permission-matrix-auditor   inbound-receiving-discrepancy-log
  insurance-policy-coverage-matrix  intercompany-elimination-matrix
  kanban-board                    lease-amortization-schedule
  loss-reserve-adjustment-ledger  matrix-inventory-variant-picker
  matter-trust-ledger             multi-unit-leasing-matrix
  nine-box-talent-calibration-matrix  pivot-grid
  portfolio-risk-stress-tester    quality-gates-table
  query-builder                   rent-roll-financial-schedule
  secret-vault-access-matrix      share-class-cap-table-structure
  shift-roster-scheduler          spend-category-sourcing-matrix
  spreadsheet-grid                subcontractor-compliance-lien-tracker
  subledger-distribution-table    table
  tax-engine-breakdown-table      three-way-matching-matrix
  virtualized-table               webhook-delivery-attempt-ledger
```

### Layer 7: Forms (16 components)
```
forms/
  action-bar                      address-auto-complete-form
  approval-signature-form         batch-entry-form
  bulk-action-bar                 cash-drawer-reconciliation-terminal
  conditional-field-group         document-upload-form
  enterprise-checkout-address-validator  filter-bar
  hierarchical-picker-form        inline-editable-record
  multi-step-transaction-form     permission-matrix-form
  repeater-field-group            vendor-payment-method-selector
```

### Layer 8: Shell (24 components)
```
shell/
  account-center     auth-cards      auth-shell
  catalog-shell      data-workspace  editorial-shell
  inspector-shell    launch-shell    manifest
  meridian-bar       onboarding-wizard  ops-shell
  planning-workspace platform-shell  record-shell
  settings-shell     site-shell      split-view-shell
  strata-bar         tabbed-console  transaction-workspace
  wizard-grid        workbench-shell workspace-shell
```

### Layer 9: Charts (16 types)
```
charts/
  box-plot-chart     bubble-chart      bullet-chart
  candlestick-chart  chart-type-picker charts
  cohort-retention   dashboard-chart   dual-axis-telemetry
  radar-chart        sankey-diagram    scatter-plot-chart
  sparkline-grid     stacked-bar-chart treemap-chart
  waterfall-chart
```

### Layer 10: Dashboard (16 components)
```
dashboard/
  activity-feed                   alert-threshold-configurator
  comparison-panel                cross-filter-dashboard
  dashboard-grid-layout           dashboard-kpi-card
  dashboard-widget-toolbar        drill-down-modal
  embedded-report-frame           executive-summary-dashboard
  financial-statement-viewer      metric-trend-card
  multi-page-dashboard            operational-dashboard
  real-time-metrics-board         service-health-kpi-grid
```

### Layer 11: Workflow (41 components)
```
workflow/
  activity-work-log-stream        alert-rule-condition-builder
  allocation-rule-builder         approval-chain
  bank-rule-condition-builder     billable-time-stopwatch-dock
  bpmn-palette                    bpmn-simulation-bar
  canary-rollout-progress-visualizer  cash-sweep-liquidity-optimizer
  clinical-decision-support-alert clinical-edc-field-verifier
  clinical-order-entry-pad        clinical-trial-cohort-randomizer
  compliance-evidence-collector   construction-submittal-register
  contract-clause-risk-analyzer   customer-sla-breach-timeline
  data-pipeline-dag-visualizer    dsar-request-lifecycle-manager
  entity-lineage                  expense-policy-rule-auditor
  feature-flag-targeting-rule-builder  incident-escalation-tree
  kubernetes-pod-console          legal-hold-custodian-tracker
  lifecycle-tracker               mass-payout-batch-approver
  on-call-rotation-schedule-calendar  payment-run-cockpit
  period-close-cockpit            promotion-approval-inspector
  release-pipeline-stepper        rfi-submission-workflow
  security-waf-rule-inspector     service-catalog-cart-checkout
  stage-progression-bar           supplier-tax-compliance-verifier
  tax-withholding-compliance-cockpit  topology-dependency-graph
  warehouse-pick-pack-wave-console    workflow-graph
```

### Total Component Count: **327** components across 11 layers
