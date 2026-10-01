# DataTable density inheritance — iteration evidence report

Date: 2026-09-28. Owner: PLT-DS. Consumer: PLT-ERP Business Suite. Reference: [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table). Local story: `http://localhost:6006/iframe.html?id=compositions-table--enterprise-workbench&viewMode=story`.

## STATUS

`PARTIAL` — the density inheritance gap is implemented and validated locally. This is not done: frozen DataTable calibration and Business Suite end-to-end readiness still have required evidence open.

## CHANGES

- Added a written R2 change contract at `docs/changes/strata-datatable-density-inheritance-2026-09-28.md` before shared runtime edits.
- DataTable now inherits density from the nearest `data-density` scope, then ThemeProvider/root density, when the `density` prop is omitted. Explicit density and `rowHeight` overrides remain supported.
- Non-virtualized rows now consume the Foundation `--density-table-row-height` token instead of receiving an inline standard-density override. Virtualized rows use the resolved density to keep windowing math aligned.
- Added regression cases for scoped inheritance, explicit override, and virtualized row-size calculation.

## VALIDATION EXECUTED

| Check | Result |
| --- | --- |
| Live local Storybook matrix, `1280×720`, Enterprise Workbench | PASS — 3 canonical themes × 4 densities, LTR; eight rows present and document width remained 1280px. |
| Observed local row heights | `strata`: 26.3 / 33.0 / 44.8 / 52.8px; `strata-dark`: 26.3 / 33.0 / 44.8 / 52.8px; `strata-high-contrast`: 27.1 / 33.8 / 45.6 / 53.6px, ordered ultra-compact / compact / standard / comfortable. Theme and density attributes were confirmed on every navigation. Heights reflect content and control minimums as well as density tokens. |
| `pnpm exec vitest run src/compositions/table/table.test.tsx` | PASS — 21/21 tests, including the two new inheritance/override cases. |
| `pnpm typecheck` | PASS. |
| `pnpm check:storybook` | PASS — all 120 story files parsed; 113 component stories conform. |
| `pnpm lint` | PASS — foundations 11/11, inventory 113/113, density/token/contrast/logical-property/governance gates passed. |
| `pnpm build` | PASS — package build and inventory generation completed. |
| `pnpm --dir storybook build-storybook` | PASS — production Storybook preview built in 1.08 minutes. Upstream Storybook emitted its existing `eval` advisory for its preview runtime. |
| Live reference and accessibility tree | PASS for the reference sample inspection; local table AX tree exposes a named table, header cells, labeled row checkboxes and per-row actions. |
| `compositions-table--all-states-gallery` | PARTIAL — live screenshot and AX exposed populated, empty and loading/skeleton states. No error state is present in this gallery; the capture was inspected in-session and was not persisted. |
| Business Suite consumer build, `pnpm build` in `business-suite` | FAIL — under Node 24.14.0 (the app requires Node 22), Next webpack cannot resolve three existing imports of the absent `@kannan19302/ui/platforms/business-suite` export. The Design System package currently has no matching source module or export. This is a consumer build blocker and prevents route-level DataTable proof. |

The package commands reported the configured engine range as Node `>=22 <23` while the shell resolved Node `24.14.0`; commands completed successfully, but this runtime mismatch remains a verification limitation.

## RESULTS

Before the change, the Storybook root density changed across the matrix while the omitted DataTable density prop forced standard sizing: every theme-density combination measured 44.8px (45.6px in high contrast). After the change, each selected density produces a distinct row geometry in all three themes, and the page has no horizontal overflow at the measured desktop viewport. The prior matched desktop screenshot pair and keyboard row-action result remain in `comparison.html` and the paired PNGs. The new matrix was inspected in the live browser; no twelve-image screenshot set was persisted.

The live `AllStatesGallery` shows populated, empty, and loading/skeleton presentations. It does not show an error state, and its selection/edit examples live in separate stories; reference parity and full browser accessibility checks for those state transitions remain open.

## ACCEPTANCE CRITERIA

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 — inherit nearest supported scope or root density | PASS | ThemeScope regression and 12 live Storybook combinations. |
| AC-02 — preserve explicit density and row-height override | PASS | Existing four-tier test, explicit override test, passing 21-test focused suite. |
| AC-03 — virtualized row calculation follows resolved density | PASS | Virtualized compact scope and explicit ultra-compact override regressions. |
| AC-04 — focused package and Storybook gates | PASS | Typecheck, test, lint, package build, Storybook standards, production Storybook build. |
| AC-05 — validate upstream before consumer migration; keep overall Table status open | NOT VERIFIED | Shared package gates passed; no Business Suite consumer migration or end-to-end journey proof was run. |

## REMAINING WORK

- Matched narrow viewport/reference geometry; LTR/RTL comparison; loading, empty, error, selection, and editing state comparison.
- Browser axe scan, real 200% zoom, screen-reader/OS mode checks, and complete keyboard coverage.
- Business Suite package-consumer validation is blocked by three imports of the invalid app-specific `@kannan19302/ui/platforms/business-suite` subpath. Follow the existing PLT-DS/PLT-ERP alignment contract and migrate these to Business Suite-owned behavior or generic public UI APIs; do not add an app-specific L1 export. Then rebuild under supported Node 22 and validate representative finance/inventory and public-portal journeys. No publish/release has occurred.
- Full DataTable frozen calibration gate and PLT-ERP handoff. These items are required for the component to pass; the enterprise-wide goal also includes remaining Strata components and shells.

## NEXT ACTION

Continue the frozen sequence with the narrow/reflow and state matrix when an explicit viewport control is available, then run the affected Business Suite consumer journey against the validated package before marking DataTable calibration complete.

## STRUCTURED HANDOFF — PLT-DS → PLT-ERP

- **Completed:** density inheritance for omitted DataTable props; explicit density overrides; nearest ThemeScope resolution; virtualized sizing regression coverage; live 12-case Storybook geometry review.
- **Dependencies changed:** none. Package version, lockfiles, and consumer dependency graph are unchanged; no package publication occurred.
- **Contracts changed:** the R2 change contract clarifies the existing optional `density` behavior. No prop or export signature changed.
- **Files changed:** `src/compositions/table/table.tsx`, `table.module.css`, `table.test.tsx`; `docs/changes/strata-datatable-density-inheritance-2026-09-28.md`; the table benchmark ledger/evidence; `platform/docs/platforms/design-system/TRACEABILITY.md`.
- **Validation performed:** 21/21 focused table tests; typecheck; lint; inventory and token/density/contrast/governance gates; package build; Storybook standards and production Storybook build; 3-theme × 4-density LTR browser matrix.
- **Known issues:** narrow viewport, RTL, complete states, real 200% zoom, assistive-technology/OS modes, and consumer journey are not verified. Shell resolved Node 24.14.0 against the app's Node 22-only range; its build failed because the linked package lacks the imported `platforms/business-suite` subpath.
- **Downstream impact:** consumers omitting `density` now inherit their nearest environment density; explicit values retain their previous override behavior. Virtualized consumer behavior requires validation against the built package.
- **Next repository/task:** PLT-ERP consumer alignment against generic PLT-DS exports — remove app-specific `platforms/business-suite` imports per the existing R2 contract, then rerun the Business Suite build on supported Node 22 and validate representative invoice/inventory journeys. Do not add the invalid L1 export or publish, deploy, or release as part of this handoff.
- **Required context:** this packet is only a DataTable calibration increment; the overall table remains `NOT VERIFIED`, and the wider 113-component/shell goal remains open.

## Persisted responsive/theme/density matrix follow-up — 2026-09-28

Fresh Playwright Chromium captures were saved for `compositions-table--enterprise-workbench` at 1280×720 and 320×740 across all 3 canonical themes × 4 density settings (24 captures). Node 22.23.3 confirmed every requested theme/density attribute, eight target table rows, and zero page errors. At desktop, row heights measured 26.5 / 33 / 45 / 53px for Strata and Strata dark, and 27.5 / 34 / 46 / 54px for high contrast. At 320px they measured 38 / 45 / 56 / 63px and 39 / 46 / 57 / 64px respectively. These are fresh-capture values and supplement rather than replace the prior desktop-only measurements above.

No document/body horizontal overflow occurred. At 320px the named focusable scroll region contains a wider table (297 / 340 / 408 / 467px by density). Visual inspection found significant wrapping of invoice identifiers and customer labels even at ultra-compact density. Thus overflow containment is verified, but narrow-screen financial-record scanability is unresolved; responsive/reflow remains `PARTIAL`, with no column policy or card conversion inferred. See [comparison packet](comparison.md) and [all captures and limitations](matrix-captures.md). This run did not test RTL, horizontal-scroll keyboard interaction, axe, screen reader, zoom/OS modes, non-default states or a Business Suite route. Overall remains `NOT VERIFIED`.

## Small-screen alternative calibration follow-up — 2026-09-28

The scroll-only mobile captures above exposed a narrow-screen scanability gap under `DS-NFR-007`. An additive R2 contract now lets DataTable callers provide `mobileAlternative`; a container query renders that caller-owned presentation instead of the table at widths <=48rem. Existing consumers that omit the prop keep the scrollable table. Enterprise Workbench demonstrates labeled invoice cards, selection and row actions wired to the story's filtering, paging, selection and action state. No business authority was moved into L1.

### Validation executed

| Check | Result |
| --- | --- |
| `pnpm exec vitest run src/compositions/table/table.test.tsx` | PASS — Node 22.23.3; 22/22. |
| `pnpm typecheck` | PASS — Node 22.23.3. |
| `pnpm lint` | PASS — Node 22.23.3; foundation/inventory/token/logical-property/governance/layer/density/contrast/accent gates and TypeScript completed. |
| `pnpm check:storybook` | PASS — Node 22.23.3; 123 source story files and 116 component stories. |
| `pnpm build` | PASS — Node 22.23.3; inventory, contrast, accents, density, token, logical-property, governance, generated tokens and package build completed. |
| `pnpm --dir storybook build-storybook` | PASS — Node 22.23.3; fresh production Storybook output. Existing upstream Storybook `eval` advisory remains. |
| Chromium Storybook matrix | PASS — 24/24 combinations: 320×740 (card alternative) and 1280×720 (table), 3 themes × 4 densities, correct globals, eight displayed records, no page errors, and document/body within viewport. All 24 screenshots and exact result JSON are retained in this directory. |
| axe-core | PASS — 12/12 narrow theme/density samples; zero violations for WCAG 2.0 A/AA, 2.1 A/AA and 2.2 AA tags. |
| Keyboard journey | PASS — Space selects INV-001; Enter opens its row actions, ArrowDown moves to “View invoice,” Enter activates it and updates the live story status. |
| Live online reference at 320×740 | PASS for observation — official shadcn Base Table page returned HTTP 200; its first invoice table measured 327px in a 190px scroll viewport, with document/body at 320px. Screenshot: `reference-shadcn-table-region-320.png`. |

The first matrix harness attempt timed out on the hidden mobile slot at desktop width because it awaited visibility for a mode expected to be hidden; the assertion was corrected to wait for attachment. A later keyboard assertion omitted the menu's ArrowDown navigation; a targeted run confirmed the intended sequence, and the full 24-case run then completed with aggregate failure count zero. These were harness corrections, not product defects.

### Updated acceptance state

| Criterion | State |
| --- | --- |
| Optional caller-owned small-screen presentation and backward-compatible fallback | PASS for provider and Storybook fixture. |
| Tested responsive/theme/density behavior | PASS for 320px and 1280px, all canonical themes/densities; intermediate widths, true zoom and OS modes remain open. |
| Narrow accessible tree/axe/keyboard | PASS for axe samples and the synthetic selection/action path; manual screen-reader use remains open. |
| Business Suite integration and package-version journey | NOT VERIFIED — no Business Suite route consumes the new prop; package publication and authenticated journey were not attempted. |
| DataTable overall calibration | NOT VERIFIED — RTL, 200% zoom, OS modes, manual screen reader, full state coverage and consumer proof remain open. |

Designed: `PARTIAL` — optional caller-owned mobile view follows existing DS-NFR-007 and SAP Fiori label/value guidance; no mandatory mobile transformation was imposed. Implemented: additive DataTable slot, container query, Storybook invoice-list alternative and focused regression. Tested: provider gates and the described browser checks pass. Integrated: Storybook fixture only; Business Suite is not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; end-to-end readiness remains `REQUIRED-BUT-INCOMPLETE`.
