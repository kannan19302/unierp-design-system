# GaugeChart / SLA monitor comparison — 2026-09-28

## Scope and identity

The ledger row `gauge-chart` currently points to `SlaPerformanceGauge` (`GaugeChart` export), a ticket-level SLA monitor with a linear elapsed-time bar and milestone list. It is not a conventional radial gauge. The default story is `charts-slaperformancegauge--default`, viewed at `http://localhost:6006/iframe.html?id=charts-slaperformancegauge--default&viewMode=story`.

The local sample shows incident `INC-88912`, a Mission-Critical Tier 1 / 99.99% availability SLA, 18 minutes remaining, 70% elapsed, and three milestones (first response, workaround, root cause). The live Storybook visual and accessibility tree were inspected in-session. The tree exposed the heading, remaining-time status, a progressbar at 70, elapsed/target context, and milestone status text. The browser viewports were not matched to reference viewports; no captures were retained. This is exploratory comparison evidence, not an elevation packet.

## Reference comparison

| Reference | What was inspected | Task fit / semantics (0–3 each, weighted twice) | Other dimensions (interaction, states, density/reflow, visual, portability, maintenance; 0–3 each) | Total / 30 |
| --- | --- | ---: | ---: | ---: |
| [ServiceNow Horizon SLA Timer](https://horizon.servicenow.com/workspace/components/now-sla-timer?release=brazil) | Exact task family: highlighted timer, SLA states, breach warning and timer accessibility guidance. Search-indexed official page guidance was reviewed; the page’s cookie/upgrade overlays prevented visual inspection. | 3 / 2 | 1, 2, 1, 2, 2, 2 | 20 |
| [MUI X Gauge](https://mui.com/x/react-charts/gauge/) | Official live radial gauge examples and accessibility guidance. Defines a numeric range with min/max/value and recommends a meter name, range values, and useful `aria-valuetext` for actual duration. | 1 / 3 | 2, 2, 2, 2, 2, 3 | 21 |
| [Microsoft Dynamics SLA timer guidance](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/add-timer-control-case-form-track-time-against-sla) | Official timer-on-case guidance: timer indicates time against an SLA KPI; states depend on the configured SLA and actions. Text reference only; no visual implementation inspected. | 3 / 2 | 1, 2, 1, 1, 2, 2 | 19 |

Scoring is provisional research. Horizon is the closest semantic comparator and MUI is useful for meter range/accessibility, but neither yields a verified visual winner under the required evidence gates. The Horizon score reflects accessible official guidance only, not a seen rendered control. Do not combine their patterns mechanically.

## Observed gaps and risks

- **Taxonomy and consumer need:** the exported component is an SLA workflow panel, while `GaugeChart` usually suggests a bounded numeric gauge. A lower-level generic radial `GaugeChart` also exists inside `src/charts/chart/chart.tsx`, but is absent from that subpath barrel; the chart root currently exports the SLA component. Map exact Business Suite consumers and ownership before choosing canonical names or adapters.
- **Clock label contradicts its flag:** `isBusinessHoursOnly` defaults to `true`, while the shown text says “24/7 MISSION-CRITICAL CLOCK”. Derive copy from a defined calendar contract; do not imply 24/7 when the flag means business hours.
- **Milestone selection:** the implementation describes selection as active/highest priority, but prioritizes the first warning/on-track entry in input order and falls back to the first entry. A later breached milestone can therefore be hidden. Define deterministic severity/priority ordering.
- **Invalid bounds and inconsistent data:** negative elapsed values can create a negative progress value/width; `targetMinutes <= 0`, negative targets, elapsed beyond target, and contradictory caller-supplied statuses need defined validation/presentation. Do not infer domain status rules in L1 without an owning contract.
- **Empty and failure states:** an empty milestone list renders a zero meter without a clear empty state. Loading, error, forbidden and stale/offline behavior are not represented; these may belong to the consumer, but consumer composition must prove them.
- **Business data formatting:** penalty is summed only for `breached` milestones, and amounts are formatted with en-US and zero fraction digits. Currency, precision and whether penalties are authoritative must come from a typed consumer-owned money contract.
- **Accessibility/state coverage:** the sampled progressbar exposed 70 but this pass did not verify a useful accessible duration string, all milestone names/statuses under screen reader, keyboard operation, narrow reflow, RTL, themes, densities or all states. No interaction is established by the sampled story.

## Required follow-up before an elevation decision

1. Inspect package exports and exact Business Suite imports; classify the SLA monitor and generic radial gauge separately and resolve naming/ownership without a third implementation.
2. Agree a typed SLA/milestone input contract with the owning API/app team, including clock calendar, authoritative statuses, units, currency and invalid-data handling.
3. Fix the label/status precedence and bounded-progress behaviors through the canonical owner; specify zero-target and empty states. Preserve consumer authority over SLA policy and permissions.
4. Provide task-specific stories for active, warning, breached, achieved, paused, empty, invalid and loading/error/forbidden consumer states as applicable, plus keyboard/screen-reader evidence.
5. Run the protocol’s actual-equivalent research and matched reference/local theme, density, direction, viewport, keyboard and accessibility matrix. The current evidence is not sufficient to mark any quality dimension PASS.

## Readiness

**Overall: NOT VERIFIED.** Research-only record. The Input/DataTable/Breadcrumb calibration gate still withholds broad elevation. No implementation change, test, package build, consumer integration, release or deployment claim is made in this packet.
