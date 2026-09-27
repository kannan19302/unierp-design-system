# Strata element and Storybook standardization — baseline cycle, 2026-09-27

**STATUS: PARTIAL. This is not done.** Owner: PLT-DS. Risk: R1 for this bounded Storybook test-tool repair and evidence capture. Source revision before the cycle: `design-system` `234ec47c8ae7bb328adf1ee7ba54c64c70c6ae45`; owning `platform` authority revision: `0984a83e73f9508d88da2d3a138ac977e216bcae`. No component, public export, token, schema or application behavior was changed.

## Objective and acceptance criteria

The requested outcome is element-specific benchmark research, implementation, Storybook documentation and testing for all existing 116 Strata units across ten tiers, with no new elements. This cycle repairs a false-green visual discovery path and establishes a current source inventory. The [Strata Elevation Protocol](../../../platform/docs/platforms/design-system/STRATA_ELEVATION_PROTOCOL.md) withholds mass execution until Input, DataTable and Breadcrumb calibration passes. The [accepted SaaS readiness decision](../../../platform/workspace/governance/UNIERP_SAAS_READINESS_AUDIT_2026-08-28.md) also records broad development as NO-GO. This bounded tooling correction does not claim to activate mass execution.

| Criterion | Status | Evidence |
| --- | --- | --- |
| AC-01: Discover current Storybook files and exports; fail on zero targets | PASS | 118 source story files and 473 CSF story exports found. The repaired runner's IDs match all 473 stories in a fresh production Storybook index. |
| AC-02: Use canonical Strata themes and four densities | PASS | Three Strata themes × four densities now enumerate 5,676 visual cases. The old runner used legacy themes, omitted ultra-compact, added a non-existent `mode` global and pointed outside the current source tree. |
| AC-03: Put visual baselines inside the owning Storybook package and require review | PASS | Snapshot path is local to the Storybook test directory; automatic baseline creation is disabled. Existing screenshot baselines were not created or accepted. |
| AC-04: Establish exact 116-unit identity and research/implementation/Storybook/test parity per unit | NOT VERIFIED | The source-backed [inventory](STRATA_111_COMPONENT_INVENTORY_2026-09-27.json) identifies 111 component directories in nine tiers. The inventory gate asserts five more foundation packages arithmetically but does not name them; the foundation source tree contains more than five groupings. No unit is certified standardized from file presence alone. |
| AC-05: Close three calibration packets and affected consumer integration before mass execution | NOT VERIFIED | Current focused tests and builds pass, but browser screen-reader, true 200% zoom, OS forced-colour/reduced-motion and consumer evidence are still missing or stale. |

## Current inventory boundary

| Component tier | Directories |
| --- | ---: |
| Primitives | 17 |
| Inputs | 19 |
| Compositions | 18 |
| Charts | 14 |
| Overlays | 11 |
| Navigation | 9 |
| Templates | 7 |
| Shells | 8 |
| Forms | 8 |
| **Component total** | **111** |

`scripts/check-inventory.mjs` passes for 111 directories with co-located story and test files. That check proves structural presence, not quality across Purpose/Usage, Anatomy, Variants, Sizes, Density, States, Behavior, Content, Interaction, Accessibility, Responsive behavior, Themes, Tokens, Composition, API, Data conditions, Motion, Internationalization, Performance, Documentation, Testing and Downstream impact. Each dimension still needs a per-element applicability decision, with an explicit reason for N/A. The extra five foundation units need an authoritative identity before the 116 denominator can be audited.

## First component-specific reference decision — Button (research only)

Sources inspected 2026-09-27. Scoring uses the protocol's eight 0–3 criteria in order: task fit / interaction / states / density-responsive / semantics-keyboard / visual discipline / portability / maintenance. Task fit and semantics are counted twice (30 maximum). Scores describe inspected documentation and examples, not a claim of live accessibility conformance.

| Equivalent | Score | Useful traits and limit |
| --- | ---: | --- |
| [IBM Carbon Button usage](https://carbondesignsystem.com/components/button/usage/) and [accessibility](https://carbondesignsystem.com/components/button/accessibility/) | 26/30 (`3/3/3/2/3/2/1/3`) | **Primary benchmark** for action hierarchy, verb-led content, group usage, icon-only labeling, Tab/Space/Enter behavior and RTL. Carbon publishes automated, keyboard and manual screen-reader status. Its label alignment, palette, React package and size scale are not Strata defaults. |
| [shadcn/ui Button](https://ui.shadcn.com/docs/components/base/button) | 25/30 (`3/2/3/2/2/3/3/2`) | Supplemental for restrained variants, loading/spinner composition, icon spacing and API examples. Its current Base UI guidance keeps links as anchors styled with button variants; Strata's existing `asChild` anchor semantics need direct regression proof before any API change. |
| [Microsoft Fluent 2 React Button](https://fluent2.microsoft.design/components/web/react/core/button/usage) | 25/30 (`3/2/2/2/3/2/2/3`) | Supplemental for separating ordinary action buttons from menu, split and toggle behavior and for action versus navigation guidance. It is a pattern reference, not an additional Strata element. |

No Button implementation or Storybook claim is made from this research. Other elements require their own equivalent comparison and benchmark decision.

## Verification executed

All package commands below used Node `v22.23.3`, matching the declared engine range.

| Check | Result |
| --- | --- |
| `node scripts/check-inventory.mjs` | PASS: 111 component directories, 111 stories, 111 tests, six canonical floorplans. |
| `node scripts/check-storybook-standards.mjs` | PASS: 118 story files compile; 111 component stories meet the existing taxonomy/metadata check. |
| Focused Vitest: Input, DataTable, Breadcrumb | PASS: 3 files, 30 tests. |
| `pnpm typecheck` | PASS. |
| `pnpm --dir storybook build-storybook` | PASS: fresh production Storybook build. |
| Visual discovery against `storybook-static/index.json` | PASS: 473 discovered, 473 indexed, zero missing or duplicate IDs. |
| Playwright visual test list | PASS for collection: 5,676 visual cases plus one index parity case. Collection is not screenshot validation. |
| Playwright `Storybook index matches source story exports` | PASS: 1 browser-backed index test. |
| `git diff --check` | PASS after whitespace correction. |
| Full visual, axe, keyboard, screen-reader, responsive/zoom, forced-colour, reduced-motion and consumer matrix | NOT RUN in this cycle; no baseline or final element PASS claim. |

## State and next action

Designed: bounded discovery correction and Button research decision. Implemented: Storybook discovery, ID mapping, canonical matrix enumeration and local snapshot path. Tested: the checks above only. Integrated: NOT VERIFIED in downstream products. Deployed: NO. Released: NO. Knowledge delta: **UPDATED** in this dated evidence record and generated inventory; the owning Design Platform requirement and Strata protocol were inspected and their intended behavior was not changed.

Next: identify the five foundation units authoritatively, close current Input/DataTable/Breadcrumb calibration evidence and consumer gates, then execute element packets in dependency order. For each packet, record the benchmark, applicability of every requested dimension, additive implementation, Storybook usage/interaction examples, focused tests, visual/accessibility observations and downstream checks before declaring PASS.
