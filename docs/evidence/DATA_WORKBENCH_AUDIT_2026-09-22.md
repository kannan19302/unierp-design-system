# Data Workbench Audit and Elevation Specification

Date: 2026-09-22  
Owner: PLT-DS  
Risk: R2 additive shared-component change  
Knowledge delta: `UPDATED` — this evidence record defines the implementation slice; durable behavior remains owned by `platform/docs/platforms/design-system/REQUIREMENTS.md` and `EXPERIENCE.md`.

============================================================
COMPONENT AUDIT & ELEVATION SPECIFICATION
============================================================
1. Current Problem:         `DataTable` has strong enterprise behavior but presents it through extensive inline styling, mouse-mutated row colors, uppercase headers, raw shadow literals, and no shared toolbar/footer composition. This weakens theme fidelity, high-contrast behavior, reuse, responsive composition, and visual consistency with the newly fixed Strata foundations.
2. Reference Pattern:       shadcn/ui Data Table and Table use small composable table primitives, an explicit toolbar, sortable column controls, selection feedback, column visibility, and pagination. IBM Carbon and Shopify Polaris reinforce persistent batch feedback, compact enterprise density, and clear table boundaries. References are used for interaction and composition only.
3. Proposed Improvement:    Preserve the existing `DataTable` API and behaviors while moving visual state into token-only CSS Modules; add optional `caption`, `toolbar`, `footer`, `rowLabel`, and `aria-label` support; use sentence-case headers, visible keyboard focus, semantic selected/hover states, polished bulk actions, and responsive container treatments.
4. Shared Component(s):     `src/core/data-grid/table`; existing `FilterBar`, `ColumnPicker`, `Pagination`, and application-specific grids remain consumers/composition peers.
5. Dependent Screens/Repos: `business-suite`, `tenant-admin`, `provider-admin`, `developer-platform`, and `marketing-site` through `@kannan19302/ui/data-grid`. This iteration changes only the upstream design-system implementation and stories.
6. Implementation Plan:     (1) define additive accessibility/composition props; (2) replace inline presentation with CSS Module classes and CSS custom properties for runtime offsets/heights; (3) preserve sorting, selection, grouping, virtualization, pinning, and editing; (4) add tests for accessible naming, toolbar/footer composition, sorting, selection, and keyboard behavior; (5) add an enterprise workbench story composed from existing UniERP components; (6) run focused tests, typecheck, lint, build, Storybook compilation, and visual review.
============================================================

## Acceptance criteria

- `DW-01`: Existing consumers compile without changes and all current `DataTable` behavior remains available.
- `DW-02`: Table presentation uses Strata semantic tokens and CSS Modules with no raw color/shadow or mouse-style mutation.
- `DW-03`: Tables can expose an accessible name/caption and application-defined toolbar/footer content.
- `DW-04`: Sorting, selection, editing, grouping, pinning, virtualization, loading, empty, and summary states remain supported.
- `DW-05`: Keyboard focus and sortable headers are visible and operable; selection feedback is announced.
- `DW-06`: Storybook demonstrates a realistic enterprise workbench composed only from design-system components.
- `DW-07`: Focused tests, typecheck, lint, build, Storybook build, and visual theme review pass.

## Reference observations

- shadcn/ui keeps data-table behavior application-shaped while extracting reusable column-header, pagination, and view-option composition.
- shadcn/ui Table provides semantic table anatomy rather than coupling data acquisition or domain rules to the component.
- UniERP requires more than those references: four density modes, virtualized operational datasets, pinned columns, inline editing, bounded export, explicit loading/empty/recovery states, and Strata light/dark/high-contrast themes.

No third-party implementation is copied. Existing UniERP APIs, tokens, and enterprise capabilities remain authoritative.

## Browser-discovered input prerequisite — 2026-09-23

1. Current problem: the workbench screenshot shows the prefix search icon overlapping the placeholder because `Input` reserves no icon space.
2. Reference pattern: search inputs separate their leading icon and text using a shared inset.
3. Proposed improvement: reserve logical inline padding only on the sides with icon slots and use logical icon positioning.
4. Shared component: `src/core/inputs/form-control/form-control.module.css`.
5. Consumers: every `Input` using `prefixIcon` or `suffixIcon`; public props remain unchanged.
6. Plan: add token-based `:has()` padding rules and logical insets, then verify rendered search spacing and existing form-control tests.

## Keyboard and grouped identity audit — 2026-09-23

1. Current problem: navigation changes a visual marker without moving focus; Tab is intercepted at table boundaries. Group headers are counted as data indices, so default row keys and callback indices change when a group collapses. Enter can edit a different record from the visible focused row.
2. Reference pattern: semantic table controls retain native Tab traversal, while explicit cell arrow navigation moves actual focus and follows the displayed record order.
3. Proposed improvement: retain source indices separately from flattened display positions; skip group headers during arrow movement; leave Tab to the browser; restore cell focus after editing and prevent Escape from committing through blur.
4. Shared component: `src/core/data-grid/table`.
5. Consumers: all DataTable callers; prop signatures remain unchanged. Callback indices consistently refer to input data positions.
6. Plan: regression tests first, then source/display index separation and focus restoration; validate focused tests, lint/build and rendered keyboard behavior. Virtualized geometry remains a separate open criterion.
