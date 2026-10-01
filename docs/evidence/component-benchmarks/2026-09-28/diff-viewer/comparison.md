# DiffViewer benchmark — 2026-09-28

Status: `PARTIAL`; ledger overall remains `NOT VERIFIED`. Risk: `R2` evidence packet for a shared UI composition. Component owner: PLT-DS. Candidate product workflow/consumer owner: PLT-ERP. No component source/API/story/test, product route, published contract, test, package, runtime, or release changed. Research and ledger update only.

## Acceptance criteria

- AC-01 — Verify component identity, API, exports, stories, current working tree, and direct consumer scope: `PASS`; no direct Business Suite import/use found in source search.
- AC-02 — Inspect one task-fit contract redline reference and two trait references, including shadcn community: `PASS`.
- AC-03 — Inspect actual local/reference browser views and record viewport/state evidence: `PARTIAL`; local split and 21st code diff previews were both inspected at 1280×720; the code diff is an adjacent task. Ironclad/Word were official interactive product documentation with product screenshots/guidance, not live authenticated applications. No screenshots were retained.
- AC-04 — Evaluate business task, semantics, interaction, state, responsive, theme, density, direction, accessibility and Business Suite integration: `PARTIAL`; substantial source-confirmed gaps remain.
- AC-05 — Respect current frozen implementation gate, retain honest ledger status, update traceability: `PASS`; no source code changed and overall stays `NOT VERIFIED`.

## Authority, owner and component identity

- Inspected workspace and `design-system/AGENTS.md`, enterprise-brain skill, development protocol, knowledge lifecycle, ADR-0008, ADR-0012, Design Platform requirements/contracts/traceability, frozen Strata Elevation Protocol, benchmark program, package source, styles, stories, test and export.
- `@kannan19302/ui` component and Storybook ownership: PLT-DS. Product workflow definition/data authority and any consumer: PLT-ERP. No data, identity, L0 contract, API, or application authority is owned by the L1 component.
- Export: `RedlineDiffViewer`, aliased `DiffViewer`; props accept entire original/revised strings, optional split/unified default, title, density, and optional synchronous `onAcceptChange(changeId)` / `onRejectChange(changeId)` callbacks. No external diff representation, annotations, authorship, rich-document revisions, or state/result contract is exposed.
- Stories: `compositions-redlinediffviewer--split-screen-redline`, `--unified-inline-markup`, `--density-gallery`, `--anatomy-and-composition`, `--all-states-gallery`.
- `rg` search for `DiffViewer`, `RedlineDiffViewer`, and `RedlineDiff` under `business-suite` returned no direct matches. This does not prove no runtime/indirect use and does not establish a Business Suite contract review requirement.

## Reference selection and scoring

Scoring is 0–3 per trait. Task fit and semantics have weight 2; interaction, states, density/responsive, visual discipline, portability and maintenance have weight 1. Maximum 30; benchmark usefulness is not a local quality score.

| Reference | Task fit | Interaction | States | Density / responsive | Semantics | Visual discipline | Portability | Maintenance | Weighted score | Selected trait and limit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [Ironclad Editor](https://support.ironcladapp.com/hc/en-us/articles/12274871100055-Use-Ironclad-Editor) | 3 | 3 | 2 | 2 | 2 | 2 | 0 | 3 | 21/30 | Primary task reference: contract-document redlines, click a revision to accept/reject, compare versions, edit-from-redlines, version/comment history, and known unsupported/unrendered revision categories. Official guidance/screenshots, not an authenticated app preview; commercial product is not a code portability source. |
| [Microsoft Word Track Changes](https://support.microsoft.com/en-us/word/training/track-changes-in-word) | 3 | 3 | 3 | 2 | 2 | 2 | 1 | 25/30 | Supplemental review behavior: current-change cards/previews, author filtering, display modes (All Markup/Simple/No Markup/Original), previous/next, per-change and bulk accept/reject. Product-native reference, not reusable package code. |
| [21st.dev Github Inline Diff](https://21st.dev/community/components/jatin-yadav05/github-inline-diff) | 1 | 2 | 1 | 2 | 2 | 3 | 3 | 19/30 | Supplemental adjacent shadcn community pattern: compact aligned line diff with line numbers and inline comment thread/status. It is a software-review diff, not a legal contract-redline equivalent; page’s keyboard claim was not independently exercised. |

The official [shadcn component list](https://ui.shadcn.com/docs/components) has no first-party diff viewer. A 21st.dev community example was inspected because its registry page exposed an actual preview; do not import its dark theme or treat code review interactions as legal approval behavior.

## Browser and source observations

Inspected 2026-09-28. Local Storybook split: `http://localhost:6006/iframe.html?id=compositions-redlinediffviewer--split-screen-redline&viewMode=story`; local unified: `http://localhost:6006/iframe.html?id=compositions-redlinediffviewer--unified-inline-markup&viewMode=story`. Local split screenshot and 21st.dev preview were observed at 1280×720. Exact reference-to-local content/state matching was not performed and screenshots were not retained. Ironclad and Word pages were read-only public documentation; no sign-in or transmission occurred.

- Local split Storybook presents five lines per pane. Its AX tree exposes a region named “Redline Diff Viewer”, toolbar buttons, two generic tables and cells. Pane headings appear as text/divs, not table captions or column headers. Rows expose no changed/deleted/added semantics beyond plain text signs and visual styling; active change uses only outline styling.
- Manual browser transition: Next changed the counter to “Change 2 of 4” and moved the outline to the corresponding row in each split pane; the unified toggle switched to one stacked table and retained change 2. Clicking Accept in the story (no callback supplied) left the AX tree and diff unchanged while focus stayed on the button, confirming the story has no local decision feedback. This does not prove consumer callback behavior.
- The source compares `originalText.split("\\n")` and `revisedText.split("\\n")` at the same indexes and marks any unequal pair `modified`. An insertion/deletion in the middle therefore does not align later unchanged text: corresponding later lines can be falsely shown as replacements and subsequent changes can shift. Current sample has equal line counts, so it does not expose this failure in the rendered story.
- A “modified” row replaces the whole line visually. No word/character diff is rendered, no hunk context collapse or file-level navigation exists, and there is no parser for structured document tracked revisions. The sample indicates contract text, but the prop contract is only two strings.
- Accept/Reject call optional callbacks for the active `id`. The component itself has no pending, rejected, accepted, failure, disabled-while-saving, or updated-diff state; with absent/no-op callbacks, buttons give no result feedback. The UI does not claim server confirmation, but business integration must keep decision authority, audit, and persistence in PLT-ERP/API.
- The active counter is index state without a reset/clamp when changed-line count shrinks after input props update. A stale index can show an out-of-range “Change n of m”, lose active highlighting, and hide decision controls until navigation recovers it.
- Browser AX exposes tables but no `<th>`/caption-derived row/column header associations; pane labels are unassociated `div` text. The generic region label is fixed, so repeated instances do not get distinct names. The counter has no live announcement. The co-located axe test exists but was not run; no screen-reader behavior was independently tested.
- Local CSS includes 10px fallback text for badge, split/unified controls, pane labels and line-number cells; ultra-compact row and action text is explicitly 10px. This conflicts with ADR-0008 and DS-NFR-006’s minimum of 11 CSS px. Ultra-compact row height is 24px; icon nav controls stay 24px even in larger density modes.
- CSS stacks the two panes under 768px, but the mode remains named “Split”; table wrappers scroll horizontally inside a container that clips overflow. No named keyboard-reachable scroll region or other small-screen alternate is implemented. Responsive behavior was not browser-tested.
- Ironclad documentation says tracked edits appear in a document preview, clicking a change opens accept/reject in a side panel, compare can locate version changes, edit-from-redlines can accept/reject/edit then save a new version with an audit comment, and some revision types cannot be handled or may be automatically accepted. These are direct domain requirements that local static line pairs do not cover; the authenticated product itself was not inspected.
- Word guidance supports tracked author identity, markup-display modes, change previews, sequential navigation, individual decisions, bulk decisions, and a reviewing pane. The official shadcn catalog lacks a direct diff component. The 21st inline diff preview is aligned code review with comments and statuses; it has no contract acceptance flow.

## Quality axes

- Task and semantics: `GAP` — UI suggests legal redline review but uses a same-index string comparison; no Business Suite job, contract, or record semantics are established.
- Interaction and keyboard: `NOT VERIFIED` — native buttons are present and Split/Unified expose pressed state; keyboard transitions/focus exit were not exercised. Decision callbacks alone provide no confirmed result state.
- States: `GAP` — only no-differences text exists; missing/unavailable input, pending, accepted/rejected, callback failure, conflict/stale revision, and server-confirmed save states are absent.
- Responsive and reflow: `GAP` — split becomes vertical below 768px, but scroll region is not explicitly named/focusable and no mobile alternative is proven; overflow and 200% zoom not tested.
- Themes: `NOT VERIFIED` — semantic token references exist, but no light/dark/high-contrast render matrix.
- Density: `GAP` — multiple 10px text selectors conflict with the 11px minimum; full row/toolbar synchronization and target evidence absent.
- Direction: `NOT VERIFIED` — many logical CSS properties are used, but RTL rendering and pane/order behavior were not inspected.
- Accessibility: `GAP` — AX inspection found unlabeled tables, no header/caption associations, generic repeated region label, and no live announcement for change navigation. Axe and screen-reader checks were not run.
- Business Suite consumer: `GAP` — no direct source use and no owner-approved customer journey found; legal contracting is not automatically equivalent to ERP workflow.
- Overall: `NOT VERIFIED`.

## Implementation decision and remaining proof

Classification: `KEEP-CANDIDATE`, not confirmed as a Business Suite requirement. Before implementation, PLT-ERP must identify the actual route/task and authoritative API for a business decision; PLT-DS must define the reusable presentation contract. Preserve policy authority and audit on the owning service. A later code packet should evaluate a standards-based line/word alignment engine or an existing approved dependency; do not patch a bespoke text-index heuristic without insertion/deletion evidence. Match the direct contract-review workflow where the user task requires it, while deliberately excluding inaccessible product features and keeping legal decision authority in the application/service.

No tests, package gates, builds, consumer routes, or integration checks were run. The frozen Strata procedure withholds bulk component implementation until Input, DataTable and Breadcrumb calibration each reaches PASS; this packet does not meet those gates. Remaining proof includes a real PLT-ERP user task and route, matched local/reference content and viewport, insertion/deletion/move/formatting edge cases, all required review states and audit outcomes, narrow/200% reflow, themes/densities/RTL, axe and representative assistive technology, provider gates, published package compatibility, and a real integration journey. No source implementation, integration, deployment or release is claimed.

## Evidence change contract

- Request: inspect current local rendering/source against task-fit public patterns and update dated evidence, component ledger and owning traceability only.
- Risk: `R2` shared UI evidence under the active 113-component benchmark program; this cycle changed documentation/ledger, not user-facing behavior.
- Owners: PLT-DS (component, package, Storybook), PLT-ERP (workflow, route, consumer), PLT-OPS (platform traceability governance). Repositories changed: `design-system` (packet and benchmark ledger) and `platform` (traceability). `business-suite` was search-only.
- No L0 contract, provider, downstream consumer, API, data, IAM, operation, deployment or release changed. Invariants: preserve the 11px accepted minimum, accessibility, tenant/product ownership, and current source freeze; external theme/source is evidence only.
- Verification plan executed: source/authority/search, three live online reference pages, local Storybook visual/AX, ledger parse/readback and scoped git whitespace check. Tests/builds and consumer gates were not run.
- Rollback: remove the dated DiffViewer evidence packet and revert only this ledger row and traceability paragraph. No runtime/data rollback.
- Approval: evidence preparation is within the active benchmark program and user goal. Source implementation remains outside this packet and gated by the frozen Input/DataTable/Breadcrumb calibration procedure.

