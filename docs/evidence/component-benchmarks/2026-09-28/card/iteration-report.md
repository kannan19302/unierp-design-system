# Iteration evidence report — Card — 2026-09-28

## STATUS

**PARTIAL — This is not done.** Card reference and consumer-source evidence are recorded; the component remains NOT VERIFIED. Accepted text-size conformance is contradicted by the 10px fallback, and broader component implementation remains frozen pending the Input/DataTable/Breadcrumb gate.

## CHANGES

- Added the [Card comparison](comparison.md), including direct live shadcn/Storybook comparison, current supplementary references, accepted-requirement conflict, compound spacing risk, and Business Suite callsites.
- Updated the Card row in the 113-row benchmark ledger and appended PLT-DS traceability.
- No implementation, application, published contract, story, or test source was changed.

## VALIDATION EXECUTED

- Inspected local `compositions-card--default` and `compositions-card--anatomy-and-composition` Storybook canvases visually and through the live accessibility tree at 1280×720.
- Inspected the official shadcn Card page live at the same 1280×720 browser viewport; reviewed its slot API, `CardAction`, sizing, spacing variable, image and RTL examples.
- Inspected Fluent 2 guidance and live page; its embedded example reported loading. Reviewed MUI Card action guidance.
- Read the Card source, stories, styles, test source, accepted ADR-0008, PLT-DS requirements, package export barrels and current calibration freeze.
- Searched Business Suite callsites; confirmed import and JSX use in `AnalyticsCockpitClient.tsx`, plus broad route/source uses. `FeatureLinkCard` itself has no active usage found by the search.
- No tests, typecheck, density check, or build was run, as no implementation changed and the workspace instruction says not to run tests unless requested.

## RESULTS

- Card anatomy is structurally aligned with shadcn’s header/title/description/content/footer composition and uses restrained separator-led styling.
- CSS defines a 10px fallback for ultra-compact Card text, conflicting with ADR-0008 and `DS-NFR-006`’s 11px minimum.
- Root default padding can compound the built-in padding of compound slots; the anatomy sample avoids this by choosing `padding="none"`. The effective runtime spacing token was not measured.
- Business Suite source has live callsites, but no current package build or rendered route journey was established by this packet.
- Cross-theme/density/reflow/direction/zoom/accessibility verification is incomplete; screenshots were not retained.

## ACCEPTANCE CRITERIA

1. Compare local Card against the current online equivalent and Storybook: **PARTIAL** — direct 1280×720 views inspected; screenshots and theme/state matrix not retained.
2. Record source-backed parity and requirement gaps: **PASS** — slot match, stacked spacing risk, 10px conflict, interaction boundary, and scope limits recorded.
3. Prove relevant Business Suite usage: **PARTIAL** — direct import/JSX callsites exist, but app build and rendered route journey are unverified.
4. Preserve accepted authorities and calibration freeze: **PASS** — no implementation, contract changes, or test runs.
5. Prove 100% end-to-end readiness: **NOT VERIFIED** — density requirement conflict and all required visual, package, accessibility, and route evidence remain.

## REMAINING WORK

- Bring every Card text fallback into conformance with the 11px minimum and prove effective token values in all supported themes.
- Resolve compound spacing so callers do not get doubled root and slot insets.
- Decide parity additions from observed consumers, then prove the actual Business Suite card render and full visual/accessibility matrix after the calibration freeze lifts.
- Continue through all remaining inventory rows; a completed Card packet does not close the full design-system objective.

## NEXT ACTION

Continue with `compositions/data-grid`, the next unreviewed alphabetical composition row after Card, preserving the same reference-first evidence process. Keep the separate Input/DataTable/Breadcrumb calibration gate visible as a cross-component checkpoint.

## Knowledge delta

**UPDATED** — Added current dated Card evidence to the component ledger and PLT-DS traceability. Normative requirements were not changed; the observed 10px mismatch is tracked against existing ADR/requirement authority.

## R2 correction follow-up — 2026-09-28

The accepted authority is ADR-0009 (ADR-0008 is superseded). Card ultra-compact root and description now use `var(--type-micro, 11px)`. `scripts/check-density.mjs` now checks both required selectors and fails if either fallback is absent or below 11px. The R2 contract is `docs/changes/strata-card-ultra-compact-type-floor-2026-09-28.md`.

Designed: retain the existing Card API and enforce the accepted typography minimum. Implemented: two token fallback corrections plus a Card-specific density gate. Tested: Card tests pass 6/6; full suite passes 136 files/831 tests; Node 22.23.3 density, lint, typecheck, inventory (116/116), Storybook standards (123 source stories/116 component stories), and package build pass. Integrated: Business Suite use sites exist, but a package-resolved rendered route is not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full Card matrix and Business Suite journey evidence remain `REQUIRED-BUT-INCOMPLETE`. Status: `PARTIAL`; this is not done.
