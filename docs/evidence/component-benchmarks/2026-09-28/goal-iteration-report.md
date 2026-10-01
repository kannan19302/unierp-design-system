# Strata design-system goal iteration — 2026-09-28

## STATUS

`PARTIAL` — concrete browser evidence was added for Breadcrumb theme/density/direction, and the Business Suite DataTable consumer-proof gap was narrowed. The requested 116-component and shell end-to-end design-system goal remains open; this is not done.

## CHANGES

- Breadcrumb: inspected the existing collapsed-path Storybook story in four pairwise browser combinations and updated its dated evidence packet, ledger row and PLT-DS traceability.
- DataTable: mapped `DynamicFormRenderer`'s schema-driven custom-record Table field and corrected the earlier subpath-only scope: `rg -l 'DataTable' app src --glob '*.tsx'` finds 397 non-test Business Suite TSX source files referencing DataTable. Added an R2 consumer-proof contract after confirming the existing Checkbox suite mocks DataTable. This text-reference count is not a route/import inventory or integration proof.
- The direct consumer integration test and Vitest resolution experiments failed on duplicate React and were removed. No Business Suite runtime/config change remains.
- The Business Suite production build was attempted and failed at webpack resolution because three existing shell files import `@kannan19302/ui/platforms/business-suite`, which is absent from the current Design System package exports/source. This run also used Node 24.14.0 although Business Suite declares Node 22 only. The imports were pre-existing and were not edited.

## VALIDATION EXECUTED

| Evidence | Result |
| --- | --- |
| DataTable Business Suite consumer test, Node 22.23.3 | FAIL — `Cannot read properties of null (reading 'useContext')`; linked design-system code resolved its React copy while the renderer used Business Suite React DOM. Dedupe, alias and inline-resolution variants did not fix the Vite/Vitest harness. |
| Business Suite Next config | Read-only inspection confirms `@kannan19302/ui` is in `transpilePackages`; the config comments explain the duplicate-React reason. This is configuration rationale, not runtime proof. |
| Business Suite `pnpm build`, Node 24.14.0 | FAIL — webpack reports the `./platforms/business-suite` package path is not exported from the linked `@kannan19302/ui`; failures originate in `KeyboardShortcutsHelp.tsx`, `StrataAppGrid.tsx`, and `TabContextMenu.tsx`. The supported Node 22 build remains unrun. |
| Breadcrumb Storybook at 1280×720 | PASS — pairwise cases: Strata/ultra-compact/LTR; Strata dark/compact/LTR; Strata high contrast/standard/RTL; Strata/comfortable/RTL. AX retained the named disclosure and text current page. |
| Breadcrumb prior matched evidence | PASS — saved reference/local desktop at 1046×714 and narrow reference/Strata at 320×714; expanded disclosure and RTL captures retained. |
| Source/build/test gates | NOT RUN in this iteration. Prior provider test/build evidence is linked from the component contracts; the only retained changes this turn are documentation/evidence. |

## RESULTS

Breadcrumb now has pairwise evidence for all three canonical themes, all four density tiers, and both directions, but not their full cross-product. Its overall row remains `NOT VERIFIED` because screen-reader, true 200% zoom/OS modes, complete matrix and consumer integration are open. DataTable remains `NOT VERIFIED`; its consumer path is identified, but a real Next-bundled/authenticated route journey has not been exercised. The overall 113-component denominator, shells, and Business Suite readiness are not certified.

## ACCEPTANCE CRITERIA

| Criterion | State |
| --- | --- |
| Side-by-side online reference and Storybook comparison for each component/shell | `NOT VERIFIED` — only a subset of the 113-row ledger has saved matched comparisons. |
| Strata theme/density/direction/responsive/accessibility coverage | `PARTIAL` — new Breadcrumb pairwise evidence; broad matrices remain incomplete. |
| Business Suite package compatibility and end-to-end journeys | `FAIL` on the current local package/consumer state — Vitest hits duplicate React and Next webpack cannot resolve `./platforms/business-suite`; supported Node 22 build and authenticated routes remain untested. |
| Goal-level readiness | `NOT VERIFIED` — many components, shells, package consumers and release gates remain open. |

## REMAINING WORK

- Continue the PLT-DS/PLT-ERP alignment contract: the pure-presentation `@kannan19302/ui/platforms/business-suite` subpath now resolves locally. Run the Business Suite build on supported Node 22 after resolving the 656 type diagnostics, then exercise representative finance/inventory, public portal and authenticated custom-record journeys.
- Finish the frozen Input/DataTable/Breadcrumb PASS gates, including screen-reader, zoom/OS modes, consumer journey and missing browser dimensions.
- Continue the 113-component side-by-side reference program and all shell comparisons; maintain per-row evidence and exact status.
- Resolve the separately recorded Business Suite package/type/token failures and prove compatibility without treating local symlink success as publication proof.
- No package publication, deployment, release, commit or push occurred.

## NEXT ACTION

Migrate the three existing shell imports according to the consumer-alignment contract before attempting a Next-compatible DataTable harness, then resume the frozen calibration sequence. Continue leaving the overall goal active until every explicit deliverable has direct evidence.

Knowledge delta: Breadcrumb `UPDATED`; Business Suite/DataTable consumer integration `REQUIRED-BUT-INCOMPLETE`.

## Business Suite component migration follow-up — 2026-09-28

The shell import blocker is resolved in the local linked-source graph: pure presentation components `StrataAppGrid`, `KeyboardShortcutsHelp`, and `TabContextMenu` now have public `@kannan19302/ui/platforms/business-suite` exports. The existing six-item app catalog is owned by Business Suite. Node 22.23.3 provider focused tests pass (shell 6/6; StatusBadge export 7/7), provider typecheck and package build pass. Browser comparison against online references for the new shell components remains open.

The two Finance `StatCardRow` imports now use the existing public `compositions` subpath. Latest Business Suite Node 22.23.3 typecheck fails with 656 diagnostics (331 TS2305, 325 TS2322). The successful webpack phase from the prior build did not complete consumer type validation, and a new full build has not been run after the additive StatusBadge export. No Business Suite integration, journey, accessibility, token-gate, or release proof is established by the provider checks. Overall package/consumer readiness remains `PARTIAL`; this is not done.

Designed: shell component contracts. Implemented: shared pure presentation exports and bounded Finance import correction. Tested: focused provider checks/build pass; consumer typecheck fails as recorded. Integrated: partial local linked source. Deployed: no. Released: no. Knowledge delta: `UPDATED`; Business Suite integration remains `REQUIRED-BUT-INCOMPLETE`.

## StrataAppGrid reference calibration — 2026-09-28

A matched browser comparison was completed between the official Salesforce Lightning App Launcher example and the local `navigation-strataappgrid--default` Storybook story. Captures at 1000×605 and the side-by-side artifact are recorded in `design-system/docs/evidence/component-benchmarks/2026-09-28/strata-app-grid/comparison.md`. The first local view exposed Storybook's centered layout shrink-wrapping a page grid; the story now uses a padded canvas and the component is capped at 52rem. Six consumer-style links show as three columns/two rows; tile dimensions are approximately 269×66.6px versus about 262×67px in the official example. The Storybook-only visual fix does not change consumer filtering or authorization.

Tab focus reached the first link and a visible outline was measured (1.6 CSS px at browser scale; authored as 2px). The two-case focused component suite passes 2/2, Storybook standards pass across 123 story files / 116 component stories, and the token gate passes with 0 new violations (155 baselined). The component's overall benchmark remains `NOT VERIFIED`: consumer authorization, route journeys, narrow/reflow, theme/density/direction matrices and screen-reader proof remain open. The CSV ledger now reconciles with the current inventory at 116 rows; new KeyboardShortcutsHelp and TabContextMenu rows remain `NOT VERIFIED`.

Designed: app-link grid visual and consumer-owned data boundary. Implemented: padded Storybook fixture and 52rem grid cap. Tested: focused component suite 2/2, Storybook standards 123 files/116 stories, token gate 0 new violations. Integrated: Business Suite static usage identified at home and app catalog; route journey not tested. Deployed: no. Released: no. Knowledge delta: `UPDATED`; goal status remains `PARTIAL`, this is not done.

## Provider and production Storybook build follow-up — 2026-09-28

For the StrataAppGrid calibration changes, Node 22.23.3 Design System `pnpm build` and `pnpm lint` pass with exit code 0. The production Storybook build also passes (2326 modules transformed; story component asset emitted), and the built static iframe renders the six application links in the 3×2 grid with accessible nav/list/link names. `check:storybook` passes for 123 story files and 116 component stories; focused StrataAppGrid tests pass 2/2; token gate reports no new violations (155 pre-existing baseline). This remains component-level proof only; Business Suite typecheck still has 656 diagnostics, no app route journey is verified, and the remaining 115 ledger rows are not complete. Overall goal status remains `PARTIAL`; this is not done.

Designed: comparison-backed grid boundary. Implemented: corrected story layout and max-width geometry. Tested: provider build/lint/storybook/static-story/focused-test/token checks pass. Integrated: no new route integration claim. Deployed: no. Released: no. Knowledge delta: `UPDATED`; end-to-end readiness remains `REQUIRED-BUT-INCOMPLETE`.

## AppShell-1 benchmark calibration — 2026-09-28

Compared the AppShell-1 standard story with the Shadcnblocks Application Shell 1 preview and saved source/local captures plus a side-by-side artifact at `design-system/docs/evidence/component-benchmarks/2026-09-28/app-shell/comparison.md`. The external page exposes a fixed 668×501 image, so the comparison is scaled for layout review and is not matched-viewport signoff. The first measured local shell preview was 300px wide (20.9% of 1434px); the browser reference proportion is approximately 17%. The width came from the shell Storybook fixture, while the product SideNav default is 240px. The shell preview fixture is now 16rem; browser measurement confirms a 256px width at a 1440px viewport.

Designed: the standard shell frame and sidebar proportion. Implemented: Storybook shell-preview sizing correction; no product default/API change. Tested: AppShell suite 21/21, Storybook standards (123 source stories / 116 component stories), lint, and build pass on Node 22.23.3. Direct Storybook browser measurement confirms 256px desktop sidebar at 1440px and 288px open drawer at 390px with no horizontal overflow. Integrated: Business Suite journey not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; remaining shell variants and full user/consumer evidence are `REQUIRED-BUT-INCOMPLETE`. Status remains `PARTIAL`; this is not done.



## AppShell inset/floating visual comparison — 2026-09-28

Captured Shadcnblocks Application Shell 2 and 5 reference previews alongside AppShell-2 (inset) and AppShell-3 (floating) Storybook stories. Evidence and the combined artifact are in `design-system/docs/evidence/component-benchmarks/2026-09-28/app-shell/comparison.md`. The remote preview assets are fixed 668×501 images; the local stories are 1440×1080 renders scaled into 4:3 panels, not exact viewport matches.

The inset treatment is present in AppShell-2. The Shell 5 preview visibly includes a horizontal module-navigation row; AppShell-3 previously omitted it, so the floating story now uses its existing `TopNavReference` with the same five synthetic nav items. The updated accessibility snapshot identifies the `Module navigation` landmark. This is story-level reference alignment; consumer navigation behavior and authorization remain owned by the consumer and unverified here. `AppShell-4` topbar and `AppShell-5` dual variants are not benchmarked against direct references yet.

Designed: standard, inset, and floating shell patterns. Implemented: 16rem shared shell-preview sidebar and reference-like module tabs on floating story. Tested: refreshed AppShell tests pass 21/21; `pnpm check:storybook`, `pnpm lint`, and `pnpm build` pass under Node 22.23.3 after the tab addition. Integrated: Business Suite journey not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; end-to-end remains `REQUIRED-BUT-INCOMPLETE`; status `PARTIAL`.

## DashboardShell-1 side-by-side review — 2026-09-28

Compared the standard DashboardShell story against the current Shadcnblocks Dashboard 9 sales overview. Saved the fixed online reference image, full local desktop story capture, and scaled side-by-side artifact at `design-system/docs/evidence/component-benchmarks/2026-09-28/dashboard-shell/comparison.md`. Shared structure includes a three-card metric row and multi-panel analysis area. Differences: the reference pairs recent orders with fulfillment and exposes date/platform/product filters; Strata’s sample uses a full-width transaction table and cohort panel, without a consumer filter flow. DashboardShell remains experimental in its source comments, and the Business Suite route, data authority, and intended customer journey are not proven. No component source was changed based on this sales-specific reference.

Designed: generic dashboard slot composition. Implemented: evidence packet and ledger update only. Tested: direct browser render/structure; code checks not applicable to this evidence-only change. Integrated: not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; goal status remains `PARTIAL`, readiness `REQUIRED-BUT-INCOMPLETE`.

## Card ultra-compact text floor correction — 2026-09-28

The Card root and description fallbacks now use the approved 11px `--type-micro` token fallback. The provider density gate checks both declarations for a present fallback at or above 11px. The focused R2 contract, Card comparison packet, ledger and PLT-DS traceability record this correction. Card remains `NOT VERIFIED` overall: rendered computed styles across themes/densities, the compound spacing decision, complete accessibility/reflow evidence, package compatibility and a Business Suite route journey remain open. Node 22.23.3 validation: Card tests 6/6; full Design System suite 136 files/831 tests; `check:density`, `lint`, `typecheck`, `check:inventory` (116 components), `check:storybook` (123 source stories/116 stories), and `build` pass.

Designed: preserve token-driven Card typography with the accepted floor. Implemented: CSS fallbacks and a source-level regression guard. Tested: all focused and package gates listed above pass on supported Node 22.23.3. Integrated: no route proof. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full Card and Business Suite evidence remains `REQUIRED-BUT-INCOMPLETE`. Goal status: `PARTIAL`; this is not done.

## AppShell-4 top-navigation comparison — 2026-09-28

The current AppShell-4 story showed a left sidebar and no second navigation row, despite representing the `topbar` variant. It now composes the existing horizontal module nav and `topNavigation` workspace-view slot, with named navigation landmarks and native fragment anchors to illustrative sections. The current [comparison packet](app-shell/comparison.md), [R2 contract](../../../../design-system/docs/changes/strata-app-shell-4-topbar-calibration-2026-09-28.md), side-by-side HTML, ledger, and PLT-DS traceability record the change. The primary Shadcnblocks preview shows the matching two-row pattern; its interactive preview returned 403. The local and reference renders were inspected separately. The side-by-side HTML was not opened because browser security policy blocks local `file:` URLs; no alternate route was used. AppShell overall remains `NOT VERIFIED`.

Designed: horizontal module and workspace navigation. Implemented: Storybook-only AppShell-4 composition using existing shell slots. Tested: Node 22.23.3 AppShell tests 21/21; full suite 136 files / 831 tests; lint, typecheck, inventory, Storybook standards and package build pass. After the final title/breadcrumb story edit, `check:storybook` (123 story files / 116 component stories) and `typecheck` were rerun and passed. Integrated: Business Suite route not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full AppShell and Business Suite journey evidence remains `REQUIRED-BUT-INCOMPLETE`. Goal status: `PARTIAL`; this is not done.


## AppShell-5 dual inspector comparison — 2026-09-28

The AppShell-5 dual shell packet and reference comparison are recorded in `docs/changes/strata-app-shell-5-inspector-calibration-2026-09-28.md` and `docs/evidence/component-benchmarks/2026-09-28/app-shell/comparison.md`. Storybook now connects selection to a labelled illustrative inspector with close/focus return, and the dual layout reflows below 1200px. Browser geometry at 1440/1200/1024/390 CSS px reports no horizontal document overflow. AppShell suite 21/21, package suite 136 files/831 tests, Storybook standards/inventory, typecheck, lint, package build and production Storybook build pass. This remains provider/story proof only: screen-reader and complete mode matrices plus Business Suite journey are unverified. AppShell overall remains `NOT VERIFIED`; goal status remains `PARTIAL`, this is not done. Designed: `PARTIAL`; Implemented: scoped; Tested: provider and browser checks pass; Integrated: not verified; Deployed: no; Released: no. Knowledge delta: `UPDATED` for AppShell-5; overall readiness `REQUIRED-BUT-INCOMPLETE`.

## Visual matrix serializer correction and retained Input screenshots — 2026-09-28

The visual matrix discovery helper joined Storybook globals with a comma. A live browser test showed Storybook rejecting that query and silently applying `strata`/`standard`; such screenshots would be mislabeled. The helper now serializes the documented semicolon-separated globals, and `visual-regression.spec.ts` asserts both requested document attributes before taking a snapshot. A dedicated regression test passes 12 query combinations. The Input all-states story uses its existing `fullWidth` prop on the leading-icon example, which had previously shrink-wrapped; this is Storybook-only. Chromium under Node 22.23.3 applied all 12 combinations at 1280×800; five fields measure 312px wide and 24/28/32/40px tall according to density, with no horizontal overflow or page errors. All 12 screenshot files and exact measurements are retained at `design-system/docs/evidence/component-benchmarks/2026-09-28/input/matrix-captures.md`.

Designed: `PARTIAL`; Implemented: matrix global serialization/assertion and comparison story fixture; Tested: 12 URL regression cases and 12 live browser modes; Integrated: not verified; Deployed: no; Released: no. Input's screen reader, true zoom, OS modes, consumer compatibility and journey remain open; the 116-row catalog stays `NOT VERIFIED`. Knowledge delta: `UPDATED`; this is not done.

## DataTable persisted 24-case capture matrix — 2026-09-28

Saved Chromium Storybook captures for DataTable at desktop (1280×720) and narrow (320×740) across all three canonical themes and four density tiers. All 24 requested modes applied correctly, showed eight target rows, and had no page errors. Body/document widths remained within viewport; at 320px overflow is contained by a named focusable horizontal-scroll region. Identifiers and customer labels wrap substantially on narrow ultra-compact layouts, so mobile financial-record scanability remains unresolved. Exact dimensions and screenshots are in [the matrix packet](table/matrix-captures.md), with the online reference and limits in [the comparison packet](table/comparison.md). This expands visual evidence; it does not establish accessible scroll behavior, consumer integration, or DataTable calibration PASS.

Fresh Business Suite checks in this cycle remain failing: `pnpm typecheck` reports 656 diagnostics (331 TS2305, 325 TS2322); `pnpm check:tokens` reports 161 new hard-coded-pixel violations across six files. No Business Suite changes were made. Status remains `PARTIAL`; overall readiness is `NOT VERIFIED` and this is not done.

Designed: no DataTable design decision was made. Implemented: evidence documentation and captures only. Tested: 24 local Storybook browser configurations and geometry observations; Business Suite typecheck/token gates fail as above. Integrated: no new consumer integration. Deployed: no. Released: no. Knowledge delta: `UPDATED` for DataTable responsive evidence; `REQUIRED-BUT-INCOMPLETE` for end-to-end readiness.

## DataTable accessible small-screen presentation — 2026-09-28

The DataTable scroll-only mobile layout caused invoice identifiers and customer labels to wrap heavily. Existing `DS-NFR-007` requires an accessible small-screen alternative for complex grids. An R2 contract now adds an optional, caller-owned `mobileAlternative` slot to DataTable and a 48rem container-query switch; consumers without an alternative keep the existing named/focusable scroll table. The Storybook invoice workbench uses a labeled card list that shares filter, pagination, selection and action state.

Provider verification on Node 22.23.3: DataTable tests 22/22; typecheck, lint, inventory, token/density/contrast/logical-property/governance gates, package build, Storybook standards (123 story files/116 component stories) and static Storybook build pass. Chromium rendered 24/24 combinations: 3 themes × 4 densities at 320×740 and 1280×720; expected alternative/table visibility, eight records, zero page errors and no viewport overflow. axe returned zero violations in all 12 narrow cases. Keyboard Space selection plus Enter → ArrowDown → Enter row action passed. The live shadcn Base Table reference at 320px showed a 327px table in a 190px scroll viewport; screenshot comparison is retained in `table/comparison.html`.

Current Business Suite gates were rerun under Node 22.23.3. Typecheck FAIL: 656 diagnostics (331 TS2305, 325 TS2322). Token gate FAIL: 161 new pixel violations across six files. No consumer source or route was changed, and no Business Suite route uses the new slot. The full output for the current typecheck is retained outside the repository at `%TEMP%/unierp-business-suite-typecheck-current.log`.

Acceptance: AC-01 through AC-05 of the mobile alternative contract PASS for provider/Storybook scope; AC-06 PARTIAL. Designed: `PARTIAL`; Implemented: optional provider slot and synthetic story; Tested: provider plus browser/axe/keyboard passes; Integrated: Storybook only, Business Suite not verified; Deployed: no; Released: no. Knowledge delta: `UPDATED` for DataTable's small-screen presentation; `REQUIRED-BUT-INCOMPLETE` for consumer/end-to-end readiness. Goal status: `PARTIAL`; this is not done.

## Labeled form control consumer alignment — 2026-09-28

The Business Suite had 325 labeled/hinted fields typed as the primitive root Input/TextField, producing 325 TS2322 diagnostics (316 explicitly reported a missing label property). The design system already contained a form-level TextField composition; it is now exported as LabeledTextField from the public /forms entry point without changing root primitive behavior. The consumer migration updates 325 JSX controls across 61 files. The form composition now links hint/error text through aria-describedby while preserving caller-provided descriptions.

Verification: Node 22.23.3 provider form tests 8/8, typecheck, lint and build pass; generated forms declarations include the additive alias; Storybook standards pass (123 files/116 component stories); scoped Business Suite diff check passes. The latest Business Suite typecheck falls from 656 to 331 errors, all remaining TS2305 missing exports; TS2322/label/hint diagnostics are zero. Business Suite lint is unavailable because the eslint executable is missing. No app route journey, Business Suite production build, token-gate remediation or package publication was completed by this slice.

Acceptance: labeled-field API/export/migration criteria PASS; overall Business Suite integration remains PARTIAL pending 331 missing exports, 161 existing pixel-token violations, route journeys and accessibility proof. Designed: reuse existing FormField composition. Implemented: additive /forms export, hint/error association and consumer adoption. Tested: focused test and provider gates pass; consumer typecheck still fails on separate exports. Integrated: local source typing only; full application build not verified. Deployed: no. Released: no. Knowledge delta: UPDATED; goal status: PARTIAL; this is not done.

NEXT ACTION: Classify the remaining 331 Business Suite TS2305 diagnostics by owner and semantic use. Start with the repeated ModuleTab/SubTab family, distinguish page-local state from duplicate global navigation, and migrate to existing public UI or consumer-owned composition where appropriate. Resolve DashboardChart/KPI and workflow/domain symbols individually; do not add app-specific or duplicate navigation exports wholesale. Then address the token gate and prove representative Business Suite journeys. Keep the 116-component benchmark and frozen Input/DataTable/Breadcrumb gate open until their full evidence requirements pass.
