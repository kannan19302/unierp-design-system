# DescriptionList benchmark — 2026-09-28

Status: `PARTIAL`; ledger overall remains `NOT VERIFIED`. Risk: `R2` benchmark evidence for shared L1 UI. Accountable component owner: PLT-DS. Business workflow and consumer owner: PLT-ERP. This is an evidence-only packet under the 113-component benchmark program; no component code, contract, package, consumer, test, publish, deploy, or release changed.

## Acceptance criteria

- AC-01 — Establish source identity, public API, stories, layer and direct consumer evidence: `PASS` for package/story identity and public surface; no direct Business Suite consumer found in source search.
- AC-02 — Inspect one direct implementation and up to two trait-specific references, including official shadcn and community discovery: `PASS`.
- AC-03 — Compare actual Storybook and reference render at a comparable viewport and record observations: `NOT VERIFIED`; both rendered, but exact viewport telemetry/content was not matched and screenshots were not retained.
- AC-04 — Reconcile all applicable quality axes and known requirement conflicts: `PARTIAL`; semantic purpose is supported, while density has a requirement conflict and narrow reflow, full theme/direction/accessibility matrices remain open.
- AC-05 — Respect the frozen elevation gate and retain truthful ledger state: `PASS`; no source implementation occurred, and ledger overall remains `NOT VERIFIED`.

## Authority and identity

- Workspace `AGENTS.md`, `AI_AGENT_DEVELOPMENT_PROTOCOL.md`, `AI_KNOWLEDGE_LIFECYCLE.md`, design-system `AGENTS.md`, ADR-0008, ADR-0012, Design Platform `REQUIREMENTS.md` and `TRACEABILITY.md`, `STRATA_ELEVATION_PROTOCOL.md`, and `strata-113-component-benchmark-program-2026-09-28.md` inspected.
- `@kannan19302/ui`, L1 presentation owner PLT-DS; Storybook is an L4 consumer. Product workflows and use cases remain PLT-ERP-owned.
- Current export is `DescriptionList`, aliased as `KeyValueList`; items are `{label: ReactNode, value: ReactNode}`, columns 1–3, density comfortable/standard/compact/ultra-compact. The public composition barrel re-exports it.
- Current stories: `compositions-descriptionlist--default`, `--anatomy-and-composition`, `--density-gallery`, `--all-states-gallery`.
- A repository search for `DescriptionList`, `DescriptionListItem`, and `KeyValueList` under `business-suite` found no direct component use. This source search is not route inventory or runtime proof.
- The official shadcn component inventory has no Description List component. Targeted 21st.dev community searches for “summary list”, “key-value”, and “description list” did not identify an exact list equivalent; adjacent list components are not treated as direct references.

## Reference selection and scoring

Score is 0–3 per trait. Task fit and semantics have weight 2; the remaining six traits have weight 1; maximum is 30. Scores evaluate benchmark usefulness, not local component quality.

| Reference | Task fit | Interaction | States | Density / responsive | Semantics | Visual discipline | Portability | Maintenance | Weighted score | Use |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [GOV.UK Summary list](https://design-system.service.gov.uk/components/summary-list/) | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 3 | 28/30 | Primary: direct definition-list composition for key facts, row boundaries, contextual row actions and missing-information guidance. |
| [Adobe React Spectrum LabeledValue](https://react-spectrum.adobe.com/v3/LabeledValue.html) | 2 | 1 | 2 | 2 | 2 | 2 | 1 | 3 | 19/30 | Supplemental: typed number/date/list localization and side/top label positioning with RTL-aware alignment; singleton primitive, not a multi-row list. Do not move domain formatting into Strata L1. |
| [SAP Fiori Object Page](https://experience.sap.com/fiori-design-web/object-page/) | 2 | 1 | 1 | 3 | 2 | 2 | 2 | 2 | 19/30 | Supplemental context: key-value header facet and flexible wrapping at an object workspace boundary; not an equivalent `<dl>` implementation. |

## Browser and source observations

Inspected 2026-09-28. Local Storybook URL: `http://localhost:6006/iframe.html?id=compositions-descriptionlist--default&viewMode=story`; density URL: `http://localhost:6006/iframe.html?id=compositions-descriptionlist--density-gallery&viewMode=story`. Reference URL: GOV.UK Summary list above. The local browser screenshot was 1280×720. The GOV.UK browser screenshot was approximately 1250×712; exact reference viewport telemetry was not captured, so this is a comparable visual inspection, not a pixel-matched capture. Screenshots were inspected in-session and not retained.

- Local default renders six business metadata pairs in two side-by-side label/value pairs per line. The browser accessibility tree exposes a definition list, labels and values, including all six sample pairs.
- Local density gallery names ultra-compact as “10px font”; source CSS sets both label and value to `--text-2xs` with `10px` fallback. This conflicts directly with ADR-0008 and `DS-NFR-006` (supported product text minimum 11 CSS px). This is a confirmed implementation gap.
- The local component CSS defines fixed two/three-pair grid tracks, `white-space: nowrap` labels, and no responsive breakpoint. Narrow-width reflow was not browser-tested. Treat this as a source-inspected responsive risk/gap, not a measured overflow result.
- GOV.UK’s rendered summary-list example is a semantic definition list with key/value rows and contextual “Change” links. Its guidance says use it for facts with keys and values, not tabular data or simple lists; row separators help associate row actions and aid zoom/magnification. It includes examples for no actions, mixed actions, missing information, and summary cards. Strata currently has no action slot, row separators, explicit empty/missing-value state, or action-context labeling API.
- Adobe’s LabeledValue demonstrates a useful primitive behavior: locale-aware number/date/list formatting and a label that can move above or beside the value, with RTL-aware start/end alignment. Strata’s generic `ReactNode` API intentionally leaves business-value formatting to the consumer; this reference does not justify adding domain formatting at L1.
- SAP Fiori documents a larger key-value facet for object-page header context and flexible inline wrapping. It is an adjacent workspace pattern, not a direct component comparison.

## Quality axes

- Task and semantics: `PASS` for rendering keyed factual metadata with `<dl>`, `<dt>`, and `<dd>`; real Business Suite task necessity remains unestablished.
- Interaction and keyboard: `NOT APPLICABLE` for the presentational primitive; any links/buttons passed as ReactNode remain consumer-owned. No keyboard interaction was claimed.
- States: `NOT VERIFIED`; no empty, missing-value, loading, error, or forbidden examples are provided. Those may be application-level states where appropriate.
- Responsive and reflow: `GAP`; fixed 2/3-column templates and nowrap labels lack component-level narrow behavior. Browser narrow/200% zoom evidence is still absent.
- Themes: `NOT VERIFIED`; no Strata light/dark/high-contrast matrix inspected.
- Density: `GAP`; ultra-compact 10px is below the accepted 11px floor. Other density modes exist in source/stories, but full themed measurement evidence is absent.
- Direction: `NOT VERIFIED`; CSS uses logical properties, but no RTL render evidence.
- Accessibility: `NOT VERIFIED`; Storybook AX observation confirms the definition-list role and terms/values. The co-located axe test exists but was not run; no screen-reader, zoom, or full contrast evidence in this packet.
- Business Suite consumer: `GAP`; no direct import was found and no rendered route/journey was verified.
- Overall: `NOT VERIFIED`.

## Implementation decision and remaining proof

Classification: `KEEP` as a generic key/value composition, conditional on an actual consumer/task being established; do not use it as a table. Primary convergence trait is GOV.UK’s visible row grouping/separators and fact-vs-table boundary. Consider responsive stacking/wrapping and missing-value presentation only in a separate approved implementation packet after the freeze lifts and PLT-ERP confirms a real task. Preserve consumer ownership of date, currency, unit and locale semantics.

No tests or package checks were run. The frozen procedure withholds mass component implementation until Input, DataTable and Breadcrumb calibration packets each meet PASS; this packet does not satisfy those gates. Remaining proof includes matched retained reference/local screenshots, narrow and 200% reflow, light/dark/high-contrast, all applicable densities, LTR/RTL, axe and representative assistive technology, provider package gates, published artifact compatibility, and a PLT-ERP-owned rendered journey. No integration, deployment, or release claim.

## Evidence change contract

- Request: compare the existing DescriptionList against task-fit references and update the dated evidence ledger and owner traceability, with no source behavior change.
- Risk: `R2` shared UI evidence packet under the active benchmark program; this individual cycle changed only evidence/docs.
- Owners: PLT-DS owns component/source, package and Storybook; PLT-ERP owns business task and consumer journey; PLT-OPS owns cross-root governance/traceability location. No data, IAM, API, contract, or operations behavior changed.
- Repositories/files: `design-system` owns this packet and component ledger; `platform` owns Design Platform traceability. Business Suite was search-only and not modified. No L0 contract/provider API or downstream consumer was changed.
- Invariants: preserve ADR-0008’s 11px minimum, semantic and keyboard accessibility requirements, tenant/product ownership, and the current freeze. External styles are evidence only and are not copied.
- Verification: source and browser review plus CSV parse/readback and scoped git whitespace check. No tests/builds or consumer/package gates are claimed.
- Rollback: remove this dated DescriptionList packet and its single DescriptionList ledger/traceability entries; no migration or runtime rollback is needed.
- Approval: bounded evidence preparation is covered by the active 113-component benchmark program and user goal. Source changes remain unauthorized by this packet and gated by the frozen Input/DataTable/Breadcrumb calibration protocol.
