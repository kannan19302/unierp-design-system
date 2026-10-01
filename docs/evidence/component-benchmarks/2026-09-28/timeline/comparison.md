# Timeline direct comparison — 2026-09-28

## Scope and change contract

R2 evidence-only packet within the 113-component benchmark program. PLT-DS owns the shared Timeline, package evidence and ledger. PLT-ERP owns Analytics Cockpit data, filtering, audit claims and any app-level convergence. PLT-OPS owns cross-platform traceability. Roots touched: `design-system` evidence/ledger and `platform` traceability. Business Suite source was searched and reviewed, not changed. Rollback: remove this packet and revert its Timeline ledger row and traceability paragraph. Implementation is still held by the Input/DataTable/Breadcrumb calibration gate.

## Live side-by-side comparison

- Strata Storybook [AuditHistory](http://localhost:6006/iframe.html?id=compositions-timeline--audit-history&viewMode=story): four vertical events, semantic-color nodes, title and timestamp on one row, optional description under it. At the live 1280×720 browser viewport, the centered rail is relatively narrow and carries no activity header, actor avatar or group divider. AX exposes a list with four entries and their title/timestamp/description.
- 21st.dev [Activity Timeline by 7ovr](https://21st.dev/@7ovr/components/timeline-3): inspected at the same 1280×720 browser viewport. The live preview groups recent activity under TODAY/YESTERDAY, shows actor avatars, actor/action/target copy and relative times, and exposes a heading and list. It is a closer visual analogue for the Business Suite activity feed, but its values are community demo data and do not prove ERP audit integrity. The page identifies an MIT-0 license.
- Official [SAP Fiori Timeline guideline](https://www.sap.com/design-system/fiori-design-web/v1-151/ui-elements/timeline): live guideline inspection describes a chronological object/event history with newest entries first, who/what/when entry content, optional header/filter/group/actions, responsive single/double sided and vertical/horizontal variants, search for long lists, and “show more” when users only need recent events. SAP also distinguishes timeline posts from notes and recommends semantic-only color. This is design guidance; no SAP runtime component was used as an implementation target.
- 21st.dev [Milestone Timeline by 7ovr](https://21st.dev/@7ovr/components/timeline-1): live preview for dated milestones with Shipped/In Progress/Planned badges, title and copy. Useful as a state/label reference, not an event-audit equivalent.
- 21st.dev [Interactive Timeline by ShadcnSpace](https://21st.dev/@shadcnspace/components/timeline-02): live preview uses year-selection buttons to switch horizontal product-history content. It is rejected as the primary because its task is narrative product evolution, not a vertical audit/activity feed; dependencies include `motion` and `lucide-react`.
- The current official [shadcn component inventory](https://ui.shadcn.com/docs/components) has no Timeline component. I therefore used actual shadcn-community examples plus SAP's direct enterprise timeline guidance instead of pretending an official shadcn primitive exists.

The Strata and 7ovr preview screenshots were visually inspected in-session at the same viewport but not retained. Theme, Storybook build revision, zoom, width matrix and pixel-level token comparison were not bound to saved captures.

## Weighted benchmark screen (provisional)

Score order: task fit / interaction / states / density-responsive / semantics-keyboard / visual discipline / portability / maintenance (0–3); task fit and semantics count twice; maximum 30. Scores apply to observed evidence and do not certify packages.

| Reference | Score | Decision |
| --- | ---: | --- |
| SAP Fiori Timeline guideline | 25/30 (`3/3/3/3/2/3/1/2`) | Primary enterprise behavior and responsive guidance. Keep SAP-specific runtime/model dependencies out of Strata. |
| 21st.dev 7ovr Activity Timeline | 22/30 (`3/1/2/1/2/3/3/2`) | Primary live visual analogue for a recent activity stream; day grouping and actor/action/target detail beat the local story for feed context. Static preview; no keyboard behavior verified. |
| 21st.dev 7ovr Milestone Timeline | 20/30 (`2/0/3/1/2/3/3/2`) | Supplemental status-label and milestone-state reference; not the audit-feed primary. |
| 21st.dev ShadcnSpace Interactive Timeline | 16/30 (`1/2/2/1/2/2/2/1`) | Rejected as direct business-feed pattern; useful only for selectable horizontal product history. |

## Strata implementation and consumer findings

- `Timeline` is a presentational list of caller-ordered entries with ReactNode title/timestamp/description/icon and `complete/current/pending/danger` status. It does not sort or validate chronology; the caller controls newest-first order and timestamp formatting.
- Status is rendered through node CSS classes. Local AX exposes event copy, but it does not expose the node status as text/state. In the danger example, the red marker does not itself convey an accessible “danger/flagged” label. Timestamps render in a span, not a semantic `time` element.
- Empty `items` renders an empty list without an empty/loading/error state; those must be supplied by the consuming view. There is no built-in search, filtering, grouping, pagination or load-more control.
- Ultra-compact CSS sets timeline metadata to 10px, below the workspace 11px minimum. Other theme/density contrast remains unverified. CSS positions the rail with logical inline properties, but live RTL was not inspected.
- Story AuditHistory uses a fixed time-ordered example and includes a named-actor/email-shaped detail plus a cryptographic-signature claim; fixture provenance is not established by this visual review. Treat it as synthetic demo content only after confirming provenance, and do not interpret it as evidence that the displayed audit claim is true.
- Business Suite `AnalyticsCockpitClient` contains a private “Live Audit Activity Stream” pattern. Source maps recent invoice and audit-log telemetry into actorless domain/event rows and adds domain filter chips. Search found no Strata `Timeline` JSX/import in Business Suite. This is a potential L4 consumer/convergence candidate, not proof of shared-component adoption, correct server authorization, live deployment or end-to-end truthfulness.

## Comparison decision

Keep the L1 primitive as a caller-ordered, read-only chronological sequence. Preserve application ownership of event sourcing, permission checks, filtering and navigation. Before adoption in the Business Suite feed, PLT-ERP should define a typed event model and confirm the source/action/time fields and audit claims; PLT-DS should then evaluate accessible status text, semantic timestamps, empty-state composition, 11px density floor and whether event grouping belongs in a higher-level composition. Avoid adding a second private feed component or moving audit authority into shared UI. Use 21st.dev for activity visual traits and SAP Fiori for enterprise chronology/responsiveness rules; keep Strata tokens, fonts and dependency policy.

## Not verified / next gates

Not verified: responsive reflow across wide/narrow widths, all themes/densities, RTL, actual 200% zoom, forced colors, reduced motion, live screen-reader output, keyboard behavior for caller-provided nodes, status announcement, chronology from API, filtering/loading/error/empty states in runtime, permission/isolation correctness, Business Suite consumer route, package checks and deployment/release. No automated tests or builds were run; source implementation and integration remain unclaimed.
