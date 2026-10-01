# EmptyState direct comparison — 2026-09-28

## Scope and change contract

R2 evidence-only packet under the active 113-component benchmark program. Owners: PLT-DS (Strata evidence and component ledger), PLT-ERP (Business Suite consumer journey), PLT-OPS (cross-platform traceability). Roots touched: `design-system` evidence and `platform` traceability only. Search covered the design-system package and Business Suite source. No component or consumer source is changed. Rollback is limited to removing this packet and reverting its ledger row and traceability paragraph. Bulk implementation remains frozen until Input, DataTable and Breadcrumb calibration packets pass.

## Compared evidence

- Strata live Storybook Default: [local preview](http://localhost:6006/iframe.html?id=compositions-emptystate--default&viewMode=story). The visible example centers an icon, “No General Ledger Vouchers”, a short description and one “Create Voucher” action. AX exposed the heading, description and button.
- Official shadcn Empty: [component reference](https://ui.shadcn.com/docs/components/base/empty). Its composition separates EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription and EmptyContent. Live examples cover project creation with three actions, upload, notifications/refresh, avatar/offline, team invitation, search/404 and RTL.
- Community error pattern: [21st.dev Error Empty State by 7ovr](https://21st.dev/@7ovr/components/empty-states-4). The live preview presents “Something went wrong”, explains a failed data load and provides “Try Again” and “Contact Support”. The page describes it as an error treatment with destructive accent. This is a community example, not a domain standard.

This was a live inspection, not a pixel-matched screenshot study. Browser canvases had different viewport/content contexts; captures were not retained. The external examples were not validated against Strata tokens or Business Suite permissions.

## Source and consumer findings

- `EmptyState` is one fixed centered layout with optional icon, string title, description and action ReactNode. Its root always has `role="status"`; title is an `h3`. This is suitable as a basic announcement pattern but does not encode whether empty data is first-use, filtered, unavailable, or an error.
- Separate wrappers exist for Loading, Filtered, Error, Forbidden and Partial states. The Storybook AllStatesGallery omits PartialState; there is no Offline or stale-data wrapper in this module. The empty/error distinction and recovery path remain caller-owned.
- ErrorState only renders a “Try again” button when a callback exists and still inherits `role="status"`. The community error example adds an independent support action. Semantics and action policy need product review before any shared API change.
- Ultra-compact description CSS falls back to 10px (`--text-2xs`), below the workspace 11px minimum. The density story also says “Empty table cell partition” and pairs it with an Add action; it needs a real table-cell context and minimum target-size review before treating it as evidence of a usable dense pattern.
- Business Suite source search found no direct JSX use of Strata `EmptyState`/state wrappers. Finance owns a private error boundary/state with `role="alert"`, assertive announcement, retry behavior and finance-specific data-withholding copy. This is adjacent evidence of a consumer need, not proof of Strata adoption or a drop-in equivalent.

## Comparison decision

Keep the primitive focused on presentational composition, but define guidance for task-specific empty, filtered, loading, error, forbidden and partial-data states; ensure 11px minimum text; establish alert/status semantics and action requirements per state; and calibrate compact states in their real container. Assess whether shared composition should expose additional media/content slots after the frozen calibration gate. PLT-ERP should own any finance-specific integration and prove a real workflow before adoption is claimed.

## Evidence limits and next gates

Not verified: responsive/reflow behavior, theme contrast across all supported themes, RTL, keyboard/focus interaction, assistive-technology output, button target dimensions, state transitions, token fidelity, package typecheck/lint/build, direct consumer integration, and an end-to-end Business Suite journey. No test or build command was run. Source implementation, integration, deployment and release are not claimed.
