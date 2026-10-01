# Strata Breadcrumb collapsed-path calibration

Status: `PARTIAL`. Risk: R2 coordinated shared UI calibration. Owner: PLT-DS. Contract owner: `@kannan19302/ui`.
Implementation repository: `design-system`. Direct preview consumer: Storybook. Downstream consumers:
Business Suite, Tenant Admin, Provider Admin, Developer Platform, and other package consumers.
No consumer migration, package publication, deployment, or release is in scope.

## Outcome and authority

Compare the current Breadcrumb story with the current official shadcn Breadcrumb reference and close
the observed long-path gap with a backward-compatible opt-in. The current public component takes
`items` or compound children; default rendering wraps and displays every item. Its current API has
no collapse behavior. The live reference at
https://ui.shadcn.com/docs/components/base/breadcrumb (inspected 2026-09-28) shows an ellipsis
between the root and recent/current path. The existing Strata calibration contract and protocol
remain authoritative for scope and evidence requirements. Relevant requirement mapping: DS-FR-004,
DS-FR-002, DS-FR-005, DS-FR-007, DS-NFR-004, DS-NFR-009, DS-UX-009. The owning `DS-FR-002`
requirement now states the opt-in collapsed long-path behavior and default compatibility rule.

## Acceptance criteria

- **AC-01 — Compatibility:** `maxVisibleItems` is optional, applies only to the `items` API, and
  default rendering remains byte-for-byte equivalent in structure/behavior where feasible. Existing
  item links, callbacks, custom separators, and terminal-current semantics remain intact.
- **AC-02 — Long path:** when the item count exceeds the configured threshold, retain the root and
  most recent items, and expose omitted ancestors behind a visible ellipsis disclosure.
- **AC-03 — Accessibility:** the disclosure is native keyboard-operable HTML with a meaningful
  accessible name; all omitted destinations remain reachable, separators are hidden from assistive
  technology, and current-page semantics remain unique.
- **AC-04 — Responsive and direction:** use logical CSS and confirm narrow and desktop widths plus
  LTR/RTL in Storybook without horizontal page overflow.
- **AC-05 — Evidence:** compare the local story and official reference at a matched desktop viewport;
  capture the local and reference views and record the observed difference and remaining unverified
  matrix dimensions.
- **AC-06 — Provider gates:** run focused Breadcrumb tests, typecheck, Storybook standards, and a
  fresh static Storybook build. Record exact results; no consumer integration claim without consumer
  validation.

## Contract, impact, and recovery

This is an additive, presentational navigation API in L1 with an L4 Storybook preview. It does not
fetch data, authorize navigation, or change route state. Consumers remain responsible for destination
authority. No dependency is added. Existing default behavior is the rollback path: omit the new prop.
Rollback is a local component/story/test/doc revert; no data migration or deployment is needed.

## Evidence and knowledge

Research already recorded in `platform/docs/platforms/design-system/STRATA_ELEVATION_PROTOCOL.md`
compares official shadcn, 21st.dev coss, and Shadcn Space Breadcrumb patterns. Current local source
and Storybook are in `src/navigation/breadcrumb/`. This packet adds current-tree, current-browser
evidence without promoting the calibration row to PASS. Knowledge delta: UPDATED, as the component's
supported long-path behavior and limits are made explicit in the owning calibration packet and ledger.

## Implementation and verification

`src/navigation/breadcrumb/breadcrumb.tsx` adds opt-in `maxVisibleItems` for the `items` API. With
at least two retained path segments and a longer input path, the component keeps the root and recent
segments visible, then exposes hidden ancestors through a native `<details>/<summary>` disclosure.
The summary has the explicit button role/name needed by the browser accessibility tree. Existing
default paths retain their existing rendering branch. Logical CSS positions the disclosure and
mirrors the chevron in RTL. `CollapsedLongPath` is the browser-comparison story.

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 Compatibility | PASS | Focused default/terminal-link tests pass; no-prop branch continues rendering all items. |
| AC-02 Long path | PASS | Desktop live Storybook snapshot shows Home → disclosure → Journal Entries → current invoice; omitted Finance and General Ledger remain reachable. |
| AC-03 Accessibility | PARTIAL | Browser AX tree exposes a named button; Tab then Enter opens the disclosure and exposes both ancestor links. Axe passes in both collapsed and expanded unit-test states. Screen-reader behavior is NOT VERIFIED. |
| AC-04 Responsive/direction | PARTIAL | At 320×714 CSS px nav is 288px wide at x=16px, wraps to 59.5px height, and document/body widths remain 320px. RTL chevrons mirror and page width stays 320px. True 200% zoom remains NOT VERIFIED. |
| AC-05 Comparison | PASS | Live reference and Storybook were inspected at 1046×714; narrow sample at 320×714. Current captures and a side-by-side page are in `docs/evidence/component-benchmarks/2026-09-28/breadcrumb/`. |
| AC-06 Provider gates | PASS | Node 22.23.3: full `pnpm test` 132 files / 819 tests PASS; Breadcrumb-focused test 8/8 PASS; `pnpm typecheck`, `pnpm check:storybook` (120 source story files / 113 component stories), `pnpm check:logical-properties`, `pnpm build`, `pnpm lint`, and fresh Storybook production build PASS. `meridian-bar.module.css` token violations were removed using `--density-row-height` with fallback; `pnpm check:tokens` reports 155 existing violations in 19 baselined files with no new violations. |

The final required checks used the supported Node v22.23.3 runtime. Preliminary Node v24 attempts are superseded. No consumer build, screen-reader check, true zoom/OS-mode matrix, package publication, deployment or release was completed. The live visual match is a calibration sample, not an element PASS under the frozen protocol. Overall Breadcrumb remains `NOT VERIFIED`.

Knowledge delta: `UPDATED`. Downstream handoff: the component is implemented and locally tested, but is not published or integrated. Business Suite and other consuming applications must validate the public package before they claim integration.

### Provider gate correction — 2026-09-28

The earlier AC-06 failure statement above was superseded after resolving the two Meridian compatibility-bar token violations. Current supported-runtime provider build and lint pass; see the current gate row above and `strata-shell-responsive-a11y-remediation-2026-09-28.md`. This correction does not alter the Breadcrumb's remaining screen-reader, zoom, consumer-integration, and full calibration gaps.

### Pairwise theme/density browser follow-up — 2026-09-28

The `Collapsed Long Path` story was inspected live at 1280×720 in four pairwise combinations: Strata/ultra-compact/LTR, Strata dark/compact/LTR, Strata high-contrast/standard/RTL, and Strata/comfortable/RTL. Each canonical theme, density tier, and direction is represented; the accessible disclosure name and noninteractive current page persist. Previous 1046×714 and 320×714 reference/local captures remain the persisted comparison. The new browser observations were not saved as additional screenshots. See `docs/evidence/component-benchmarks/2026-09-28/breadcrumb/iteration-report.md`. This improves matrix coverage but does not prove the full cross-product, true 200% zoom, OS modes, screen-reader behavior, or Business Suite integration; overall Breadcrumb stays `NOT VERIFIED`.
