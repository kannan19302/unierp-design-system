# UniERP Design System Target Directory Tree

**Package:** `@kannan19302/ui`  
**Standard:** Strata Design Language 2.0 (DL 2.0) / Enterprise SaaS Master Standards  
**Status:** Canonical Reference Architecture & Authoritative Physical Directory Tree

---

## 1. Architectural Architecture Overview

The UniERP Design System is organized around two principal logical and physical strata:
1. **`src/core/`**: Shared foundations, tokens, themes, styles, atomic primitives, inputs, forms, filters, feedback, data-display, high-density data grids, navigation, overlays, charts, layout shells, enterprise patterns, and screen templates.
2. **`src/platforms/`**: Platform-specific presentation components owned strictly by the design system, subdivided by application where justified (`provider-admin`, `tenant-admin`, `business-suite`, `developer-platform`, `marketing`, `identity`, `marketplace`, `sites`, `mobile`, `desktop`).
3. **`adapters/`**: Native client adapters (e.g. Flutter native adapter `adapters/flutter/`).
4. **Root Compatibility Layer (`src/<category>/`)**: 100% backward-compatible re-export barrels (`export * from "../core/<category>";`) and CSS redirects (`@import "../core/tokens/...";`). **Zero physical component implementations reside in root `src/`**, eliminating duplicate source code and enforcing single source of truth.

---

## 2. Full Target Directory Tree

```
design-system/
├── src/
│   ├── core/                                    # Canonical Core Strata
│   │   ├── tokens/                              # CSS Variables & Design Tokens
│   │   │   ├── base.css                         # Hairline borders, elevation, radiuses
│   │   │   ├── design-tokens.css                # Base system tokens
│   │   │   ├── index.css                        # Tokens aggregator
│   │   │   ├── charts.css                       # Color palette for charts
│   │   │   ├── studio.css                       # Visual builder tokens
│   │   │   ├── meridian-chrome.css              # Instrument chrome
│   │   │   ├── strata-chrome.css                # Strata workbench chrome
│   │   │   ├── tokens.g.json                    # Machine-readable token definitions
│   │   │   ├── color-presets.ts                 # Programmatic token access
│   │   │   ├── themes/                          # 6 Supported Enterprise Themes
│   │   │   │   ├── strata.css                   # Strata Light (Primary)
│   │   │   │   ├── strata-dark.css              # Strata Dark
│   │   │   │   ├── strata-high-contrast.css     # High Contrast WCAG AAA
│   │   │   │   ├── meridian.css                 # Meridian Light
│   │   │   │   ├── meridian-dark.css            # Meridian Dark
│   │   │   │   └── classic.css                  # Heritage theme
│   │   │   └── v2/                              # Strata DL 2.0 Foundations
│   │   │       ├── density.css                  # 4-tier density scale (24px, 28px, 32px, 40px)
│   │   │       ├── typography.css               # Typographic scale (min 11px enforced)
│   │   │       ├── platform-accents.css         # 8 platform accent palettes
│   │   │       ├── surfaces.css                 # Layered elevations & backgrounds
│   │   │       ├── rtl.css                      # Bi-directional / logical layout overrides
│   │   │       └── index.css                    # DL 2.0 tokens entrypoint
│   │   ├── theme/                               # Theme Context & Provider
│   │   │   ├── theme-context.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── index.ts
│   │   ├── styles/                              # Global Cascade Layers
│   │   │   ├── globals.css                      # @layer reset, tokens, base, components, utilities
│   │   │   ├── fonts.css                        # Webfont declarations
│   │   │   └── layers/                          # Individual CSS layers
│   │   │       ├── reset.css
│   │   │       ├── base.css
│   │   │       ├── components.css
│   │   │       └── utilities.css
│   │   ├── brand/                               # Brand Marks & Logos
│   │   │   ├── brand-logo/
│   │   │   ├── brand-watermark/
│   │   │   └── index.ts
│   │   ├── icons/                               # Curated Lucide / Custom Icons
│   │   │   ├── icons.tsx
│   │   │   └── index.ts
│   │   ├── primitives/                          # Atomic Primitives (5-file anatomy)
│   │   │   ├── alert/
│   │   │   ├── avatar/
│   │   │   ├── badge/
│   │   │   ├── brand-mark/
│   │   │   ├── button/
│   │   │   ├── error-boundary/
│   │   │   ├── health-score/
│   │   │   ├── info-hint/
│   │   │   ├── live-region/
│   │   │   ├── presence/
│   │   │   ├── priority-indicator/
│   │   │   ├── profile-card/
│   │   │   ├── progress/
│   │   │   ├── protected-component/
│   │   │   ├── skeleton/
│   │   │   ├── spinner/
│   │   │   ├── split-button/
│   │   │   ├── tag/
│   │   │   ├── trial-countdown/
│   │   │   ├── user-chip/
│   │   │   └── index.ts
│   │   ├── inputs/                              # Interactive Input Elements (5-file anatomy)
│   │   │   ├── checkbox/
│   │   │   ├── combobox/
│   │   │   ├── date-picker/
│   │   │   ├── form-control/
│   │   │   ├── input/
│   │   │   ├── number-input/
│   │   │   ├── radio-group/
│   │   │   ├── select/
│   │   │   ├── slider/
│   │   │   ├── switch/
│   │   │   ├── textarea/
│   │   │   └── index.ts
│   │   ├── forms/                               # Form Compositions (5-file anatomy)
│   │   │   ├── filter-bar/
│   │   │   ├── form-section/
│   │   │   ├── form-grid/
│   │   │   └── index.ts
│   │   ├── filters/                             # Enterprise Search & Filtering Primitives
│   │   │   ├── query-builder/                   # Boolean rule builder (AND/WHERE/OR)
│   │   │   ├── filter-chip-group/               # Active filter chips with dismissal
│   │   │   └── index.ts
│   │   ├── feedback/                            # User Notifications & Alerting
│   │   │   ├── banner-alert/                    # Top-level severity alert banner
│   │   │   ├── feedback-toast/                  # Animated toast notification
│   │   │   └── index.ts
│   │   ├── data-display/                        # Data Visualization & Readouts (5-file anatomy)
│   │   │   ├── audit-trail/
│   │   │   ├── card/
│   │   │   ├── description-list/
│   │   │   ├── key-value-grid/
│   │   │   ├── metric-card/
│   │   │   ├── timeline/
│   │   │   └── index.ts
│   │   ├── data-grid/                           # High-Density Data Grids (5-file anatomy)
│   │   │   ├── table/                           # High-density sorting/selectable table
│   │   │   ├── cross-filter-facet-panel/        # Multi-dimensional faceting
│   │   │   ├── column-visibility-menu/          # Interactive column toggle
│   │   │   ├── pagination-controls/             # Accessible pagination
│   │   │   ├── saved-view-switcher/             # Preserved view management
│   │   │   └── index.ts
│   │   ├── navigation/                          # Spatial Navigation Elements (5-file anatomy)
│   │   │   ├── breadcrumb/
│   │   │   ├── command-menu/                    # Keyboard palette (Cmd+K)
│   │   │   ├── faceted-filter-navigation-rail/  # Collapsible filter rail
│   │   │   ├── pagination/
│   │   │   ├── sidebar/                         # Collapsible primary sidebar
│   │   │   ├── tabs/                            # Multi-panel tab list
│   │   │   ├── topbar/                          # Global chrome header
│   │   │   └── index.ts
│   │   ├── overlays/                            # Overlays & Floating Surfaces (5-file anatomy)
│   │   │   ├── dialog/                          # Accessible modal dialog
│   │   │   ├── drawer/                          # Side-docked flyout drawer
│   │   │   ├── popover/                         # Floating anchor popover
│   │   │   ├── tooltip/                         # Accessible micro-tooltip
│   │   │   └── index.ts
│   │   ├── charts/                              # Recharts-Powered Visualizations (5-file anatomy)
│   │   │   ├── area-chart/
│   │   │   ├── bar-chart/
│   │   │   ├── line-chart/
│   │   │   ├── pie-chart/
│   │   │   └── index.ts
│   │   ├── layout/                              # Structural Layout Primitives (5-file anatomy)
│   │   │   ├── container/
│   │   │   ├── flex/
│   │   │   ├── grid/
│   │   │   ├── page-header/
│   │   │   ├── separator/
│   │   │   ├── stack/
│   │   │   └── index.ts
│   │   ├── shell/                               # Canonical Enterprise Floorplans (5-file anatomy)
│   │   │   ├── data-workspace/                  # High-density data grid + facets
│   │   │   ├── record-shell/                    # Entity record master view
│   │   │   ├── transaction-workspace/           # Split-pane transaction entry
│   │   │   ├── ops-shell/                       # Live operations monitoring
│   │   │   ├── planning-workspace/              # Timeline & resource allocation
│   │   │   ├── settings-shell/                  # Multi-category configuration
│   │   │   └── index.ts
│   │   ├── patterns/                            # Enterprise Composite Patterns
│   │   │   ├── multi-step-wizard/               # Stepped form flow with validation
│   │   │   ├── approval-card/                   # Two-person review & sign workflow
│   │   │   └── index.ts
│   │   ├── templates/                           # Complete Assembled Screen Templates
│   │   │   ├── detail-view-template/            # Master detail with stats & timeline
│   │   │   ├── split-master-detail-template/    # 60/40 master-detail operational view
│   │   │   ├── screens/                         # Full-page assembled showcase stories
│   │   │   │   ├── clinical-screen.stories.tsx
│   │   │   │   ├── finance-ledger-screen.stories.tsx
│   │   │   │   └── operations-console-screen.stories.tsx
│   │   │   └── index.ts
│   │   ├── studio/                              # Visual Builder & Studio Shell
│   │   │   ├── studio-shell/
│   │   │   ├── canvas-grid/
│   │   │   └── index.ts
│   │   ├── dashboard/                           # Operational Dashboards & Widgets
│   │   │   ├── cross-filter-dashboard/
│   │   │   ├── metric-grid/
│   │   │   └── index.ts
│   │   ├── blocks/                              # Composable Pre-Built UI Blocks
│   │   │   ├── stats-summary-block/
│   │   │   └── index.ts
│   │   ├── form-engine/                         # Schema-Driven Dynamic Forms
│   │   │   ├── schema-form/
│   │   │   ├── settings-page/
│   │   │   └── index.ts
│   │   ├── notifications/                       # In-App Notification Center
│   │   │   ├── notification-center/
│   │   │   ├── demo-banner/
│   │   │   └── index.ts
│   │   ├── workflow/                            # BPMN & Lifecycle Engines
│   │   │   ├── approval-chain/
│   │   │   ├── bpmn-palette/
│   │   │   ├── bpmn-simulation-bar/
│   │   │   ├── lifecycle-tracker/
│   │   │   ├── period-close-cockpit/
│   │   │   └── index.ts
│   │   ├── hooks/                               # React Hooks
│   │   │   ├── use-density.ts
│   │   │   ├── use-keyboard-shortcut.ts
│   │   │   ├── use-theme.ts
│   │   │   └── index.ts
│   │   ├── utils/                               # UI Helper Utilities
│   │   │   ├── cn.ts                            # Classname utility
│   │   │   ├── formatters.ts                    # Currency, date, tabular numbers
│   │   │   └── index.ts
│   │   └── index.ts                             # Core Public Barrel
│   │
│   ├── platforms/                               # Canonical Platform Presentation Components
│   │   ├── provider-admin/                      # Provider Cloud Administration
│   │   │   ├── admin-app-switcher/              # Cross-tenant context switcher
│   │   │   ├── environment-banner/              # DEV/STAGING warning banner
│   │   │   ├── impersonation-banner/            # Active admin impersonation HUD
│   │   │   ├── privileged-command-modal/        # Elevate authority dialog
│   │   │   ├── break-glass-action/              # Emergency access controller
│   │   │   └── index.ts
│   │   ├── tenant-admin/                        # Tenant Organization Administration
│   │   │   ├── header-onboarding-hud/           # Setup progress banner
│   │   │   ├── keyboard-shortcuts-help/         # Hotkey reference modal
│   │   │   ├── onboarding-checklist/            # Configuration checklist widget
│   │   │   └── index.ts
│   │   ├── business-suite/                      # Business Suite (ERP/CRM/HR/Finance)
│   │   │   ├── real-time-indicator/             # WebSocket connectivity beacon
│   │   │   ├── strata-app-grid/                 # 12-factor module app launcher
│   │   │   ├── tab-context-menu/                # Multi-tab workspace controller
│   │   │   ├── tenant-module-nav/               # Domain navigation sidebar
│   │   │   ├── builder-sidebar/                 # Studio customizer sidebar
│   │   │   └── index.ts
│   │   ├── developer-platform/                  # Developer Cloud & API Console
│   │   │   ├── developer-nav/                   # Developer sidebar navigation
│   │   │   └── index.ts
│   │   ├── marketing/                           # Marketing Site Components
│   │   │   ├── animated-counter/                # Metric ticker with ease-out animation
│   │   │   └── index.ts
│   │   ├── identity/                            # Identity Provider (IDP / SSO)
│   │   │   ├── auth-card/                       # Enterprise SSO/Passkey login card
│   │   │   ├── session-expiry-modal/            # Automatic session timeout modal
│   │   │   └── index.ts
│   │   ├── marketplace/                         # Marketplace & App Directory
│   │   │   ├── extension-card/                  # Connector listing card
│   │   │   ├── listing-detail-header/           # Extension metadata banner
│   │   │   └── index.ts
│   │   ├── sites/                               # Public Sites & Documentation
│   │   │   ├── site-header/                     # Public responsive navigation
│   │   │   ├── site-footer/                     # Multi-column footer & status beacon
│   │   │   └── index.ts
│   │   ├── mobile/                              # Mobile Presentation Primitives
│   │   │   ├── mobile-action-sheet/             # Touch drawer action sheet
│   │   │   ├── mobile-bottom-nav/               # Bottom navigation bar
│   │   │   └── index.ts
│   │   ├── desktop/                             # Desktop Electron/Tauri Shell
│   │   │   ├── desktop-titlebar/                # Native frameless window titlebar
│   │   │   ├── window-frame/                    # App container with draggable regions
│   │   │   └── index.ts
│   │   └── index.ts                             # Platforms Public Barrel
│   │
│   ├── primitives/                              # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/primitives";
│   ├── inputs/                                  # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/inputs";
│   ├── data-display/                            # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/data-display";
│   ├── data-grid/                               # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/data-grid";
│   ├── forms/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/forms";
│   ├── navigation/                              # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/navigation";
│   ├── overlays/                                # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/overlays";
│   ├── charts/                                  # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/charts";
│   ├── layout/                                  # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/layout";
│   ├── shell/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/shell";
│   ├── studio/                                  # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/studio";
│   ├── dashboard/                               # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/dashboard";
│   ├── blocks/                                  # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/blocks";
│   ├── form-engine/                             # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/form-engine";
│   ├── notifications/                           # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/notifications";
│   ├── workflow/                                # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/workflow";
│   ├── brand/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/brand";
│   ├── components/                              # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/components";
│   ├── theme/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/theme";
│   ├── hooks/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/hooks";
│   ├── utils/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/utils";
│   ├── icons/                                   # Backward-Compatibility Barrel
│   │   └── index.ts                             # export * from "../core/icons";
│   ├── tokens/                                  # Backward-Compatibility CSS Redirects
│   │   ├── base.css                             # @import "../core/tokens/base.css";
│   │   ├── design-tokens.css                    # @import "../core/tokens/design-tokens.css";
│   │   ├── charts.css                           # @import "../core/tokens/charts.css";
│   │   ├── index.css                            # @import "../core/tokens/index.css";
│   │   ├── studio.css                           # @import "../core/tokens/studio.css";
│   │   ├── meridian-chrome.css                  # @import "../core/tokens/meridian-chrome.css";
│   │   ├── strata-chrome.css                    # @import "../core/tokens/strata-chrome.css";
│   │   ├── tokens.g.json                        # Synchronized JSON tokens
│   │   ├── color-presets.ts                     # export * from "../core/tokens/color-presets";
│   │   ├── index.ts                             # export * from "../core/tokens";
│   │   ├── themes/                              # Redirects to ../../core/tokens/themes/*
│   │   └── v2/                                  # Redirects to ../../core/tokens/v2/*
│   ├── styles/                                  # Backward-Compatibility CSS Redirects
│   │   ├── globals.css                          # @import "../core/styles/globals.css";
│   │   ├── fonts.css                            # @import "../core/styles/fonts.css";
│   │   └── layers/                              # Redirects to ../../core/styles/layers/*
│   ├── styles.css                               # Root CSS import @import "./core/styles/globals.css";
│   └── index.ts                                 # Root Package Barrel
│
├── adapters/                                    # Native Client Adapters
│   └── flutter/                                 # Native Flutter Dart Package
│       ├── lib/
│       │   ├── src/
│       │   │   ├── tokens.g.dart                # Generated Dart token constants
│       │   │   ├── uni_button.dart              # DL 2.0 Native Button
│       │   │   ├── uni_badge.dart               # DL 2.0 Native Status Badge
│       │   │   ├── uni_card.dart                # DL 2.0 Native Card
│       │   │   ├── uni_table.dart               # DL 2.0 High-Density Grid Table
│       │   │   └── uni_desktop_chrome.dart      # DL 2.0 Native Window Chrome
│       │   └── unierp_ui.dart                   # Public Dart barrel export
│       ├── test/
│       │   └── components_test.dart             # Flutter component unit tests
│       ├── pubspec.yaml                         # Flutter package manifest
│       └── README.md                            # Native Flutter usage guide
│
├── storybook/                                   # Isolated Storybook Sandbox
│   ├── .storybook/
│   │   ├── main.ts                              # Scans ../../src/core and ../../src/platforms
│   │   ├── preview.ts                           # Theme & Density toolbars
│   │   └── preview-head.html                    # Stylesheet injector
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                                        # Architecture & Migration Documentation
│   ├── foundations/                             # Design Language & Token Specs
│   ├── core/                                    # Core Component Reference
│   ├── platforms/                               # Platform Component Reference
│   ├── accessibility/                           # WCAG 2.2 AA Conformance Audits
│   ├── governance/                              # Automated CI Quality Gates
│   ├── migrations/                              # Migration Guides & Target Maps
│   │   ├── TARGET_DIRECTORY_TREE.md             # This authoritative tree
│   │   ├── OLD_PATH_NEW_PATH_MAP.md             # Complete path mapping
│   │   └── MIGRATION_GUIDE.md                   # Step-by-step developer guide
│   └── evidence/                                # Verification artifacts & evidence
│
├── scripts/                                     # Automated CI Governance Gates
│   ├── check-inventory.mjs                      # 100% 5-file uniform anatomy conformance
│   ├── generate-inventory.mjs                   # Generates inventory ledger
│   ├── check-tokens.mjs                         # Zero-token-debt AST gate
│   ├── check-contrast.mjs                       # WCAG AAA/AA 6-theme contrast gate
│   ├── check-platform-accents.mjs               # 8-platform accent color harmony
│   ├── check-density.mjs                        # 4-tier density scale verification
│   ├── check-logical-properties.mjs             # CSS logical properties (RTL) gate
│   ├── check-ui-governance.mjs                  # AST consumer UI ownership enforcer
│   ├── check-storybook-standards.mjs            # Storybook taxonomy & co-location gate
│   ├── check-stories-compilation.mjs            # Storybook AST syntax & JSX checker
│   ├── generate-cross-platform-tokens.mjs       # Syncs web, Flutter, mobile, desktop tokens
│   ├── copy-css.mjs                             # Mirrors stylesheets into dist/
│   ├── bundle-css-modules.mjs                   # Combines CSS modules for standalone consumers
│   └── fix-client-directives.mjs                # Hoists "use client" in emitted dist
│
├── package.json                                 # 44 subpath exports (core + platforms + legacy)
├── tsconfig.json                                # Base TypeScript configuration
├── tsconfig.build.json                          # Distribution build configuration
└── vitest.config.ts                             # Unit & Axe test suite configuration
```

---

## 3. Inviolable Structural Rules

1. **Strict 5-File Uniform Anatomy**: Every single React component across `src/core/` and `src/platforms/` MUST have:
   - `<name>.tsx`
   - `<name>.module.css`
   - `<name>.stories.tsx`
   - `<name>.test.tsx`
   - `index.ts`
2. **Zero Code Duplication**: Physical implementations reside **only** in `src/core/` and `src/platforms/`. Root directories `src/<category>/` contain **only** compatibility re-exports.
3. **Allowed Dependency Direction**: `tokens → core components → core patterns/templates → platform UI → applications`.
   - Core must never import platform UI.
   - Platform UI must never import another platform's private UI.
   - Design system must never import consumer applications.
4. **100% Backward Compatibility**: All 44 package subpaths (`@kannan19302/ui/primitives`, `@kannan19302/ui/tokens`, `@kannan19302/ui/inputs`, etc.) continue to resolve without breaking existing consumers.
