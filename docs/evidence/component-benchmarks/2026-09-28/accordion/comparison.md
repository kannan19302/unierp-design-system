# Accordion reference comparison — 2026-09-28

## Packet and scope

- Packet: `DS-ACCORDION-2026-09-28`
- Component: `Accordion`, `Collapsible`, and `Disclosure` (`design-system/src/compositions/accordion/`)
- Local story: `http://localhost:6006/iframe.html?id=compositions-accordion--default&viewMode=story`
- Review date: 2026-09-28
- Risk: R2 — cross-app disclosure interaction and accessible content grouping; evidence-only this cycle.
- Decision: `KEEP` the Accordion concept. Classify composition `Collapsible` vs primitive `Collapsible` as a convergence/adapter candidate after consumer and export mapping; preserve root exports and the `Disclosure` API in the current major.
- Implementation status: none in this packet.

## User job, API and owner evidence

Accordions let a user scan a long settings or record view and reveal one related group at a time. The Design Platform owns its shared presentation and interaction; applications own the actual data and actions. Current Strata exposes two patterns: a flat `items` array and compound `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent`. It supports single/multiple modes, controlled/uncontrolled values, default-open selection, disabled flat items and four density props. `Collapsible` and `Disclosure` are also exported from the same composition file.

Search found no `<Accordion>` use in Business Suite. Three supply-chain pages import the root `Disclosure` name, but repository-wide JSX search found no `<Disclosure>` usage in Business Suite; those import lines alone are not integration evidence. The finance sidebar E2E scenario titled “Accordion Collapse” clicks a `FinanceSidebarV2` section and checks its AR/AP navigation link; it does not render this Design System Accordion. A Storybook preview therefore remains the only verified direct Accordion consumer in this scope.

The root package also has `src/primitives/collapsible/`: a separate compound Collapsible with controlled/uncontrolled state, disabled behavior, `useId`, `aria-controls`, and an explicit root-level export. `compositions/accordion/` defines a second Collapsible plus the `Disclosure` alias; the root barrel resolves `Collapsible` to the primitive but `Disclosure` to the composition alias. The composition Collapsible/Disclosure lacks a generated panel ID and `aria-controls`. This is a meaningful divergence to reconcile with import/API mapping, not a license to remove either export.

## Live references inspected

All references were opened directly and compared with the local Default story on 2026-09-28. The local Storybook canvas and shadcn reference were captured at 1280×720 with the first item open; the shadcn page was switched to light theme to match the local light canvas. Browser screenshots were visually inspected in-session but not saved as artifacts.

| Candidate | Relevant pattern observed | Portability, cost, and limitation | Score / 30 |
| --- | --- | --- | ---: |
| [Official shadcn Accordion](https://ui.shadcn.com/docs/components/base/accordion) — primary | Compound `Accordion`/`Item`/`Trigger`/`Content`; first-open single example; multiple and disabled examples; border and card compositions; RTL sample. The rendered tree exposes each trigger as a heading containing a button and the open content as a related panel. Current page offers Base UI, React Aria, and Radix UI variants. | CLI/copy-source model fits the visual reference workflow; selected behavior backend and package dependencies vary with the chosen tab. Copying its generated code wholesale would bypass Strata's API/tokens and package ownership. | 28 |
| [Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) — supplemental | Actual live example demonstrates controlled single/collapsible behavior; docs specify full keyboard navigation, vertical/horizontal orientation, RTL, single/multiple, controlled/uncontrolled, open/closed and disabled states. Exposes explicit header, trigger, content parts and WAI-ARIA pattern. | Headless behavior benchmark; component reference reports Radix Accordion 1.2.17 at 5.67 kB. Importing Radix would introduce a dependency and would not provide Strata styling; do not add it during an evidence packet. | 27 |
| [MUI Accordion](https://mui.com/material-ui/react-accordion/) — supplemental | Live examples include expandable, default-expanded, disabled, controlled and one-at-a-time variants; heading-level API; summary/details/actions; documented `aria-controls`/`aria-labelledby` relationships and a panel region. It keeps content mounted by default and offers `unmountOnExit`. | Reference is the MUI React component package and theme model; a new package/theme layer is not justified for Strata. MUI says the Accordion is no longer in current Material Design guidelines but remains supported. | 25 |
| [ShadcnSpace Accordion Space on 21st.dev](https://21st.dev/community/components/shadcnspace/accordion-space) — supplemental community design | Actual live preview displays four grouped rows with icon, title and subtitle; source shows nested sub-disclosures, Lucide icons and open/closed styling. | Preview/source lists `lucide-react`; Tailwind/shadcn utility assumptions remain. Palette-rich icon tiles and decorative colors are not appropriate as a blanket Strata treatment. License was not established on the inspected page; no code was copied. | 22 |

Score dimensions are 0–3 each: task fit ×2, interaction completeness, state coverage, density/responsive behavior, semantics/keyboard ×2, visual discipline, portability, and maintenance. Scores estimate reference usefulness only. No critical failure is inferred from a score. The official shadcn page is primary for composition and restrained styling; Radix supplements keyboard/ARIA behavior; MUI supplements region/heading/content-lifecycle semantics; 21st.dev offers a consumer-style icon/subtitle composition to assess, not copy.

## Side-by-side local result

The Storybook Default and official shadcn basic example were viewed at the same 1280×720 viewport, in light appearance, with the first panel open. Local Strata renders a 500px centered bordered container, gray/sunken trigger rows, semibold titles, chevron state icons, and expanded text on a white surface. The reference uses simpler transparent trigger rows and separator-led expanded content with less-filled headers. Both render readable text and a visible open/closed indicator; the Strata surface has a denser, more boxed hierarchy. Preserve Strata's restrained token contract and tune row/header/content treatment against actual business routes rather than copying the docs page chrome.

The local AX tree exposes each trigger as a button with expanded/collapsed state and exposes open content as text, but no heading role, `aria-controls`, content ID, or region relationship is present. shadcn, Radix, MUI, and the community Radix-based preview expose heading/button structures; the live MUI API describes panel labeling/controls and a region. Manual local interaction confirmed clicking a closed second item moves the open state, and Enter toggles the focused button closed. The current local tree does not show Arrow/Home/End movement among triggers. Native button keyboard activation works, but Radix's documented roving accordion navigation was not verified in Strata.

## Source gaps and implementation follow-up

1. Add stable item/panel IDs and correct trigger/content relationships (`aria-controls`/labeling); choose heading levels through safe composition while preserving current public API. Verify correct open-state exposure and no duplicate IDs with repeated component instances.
2. Decide whether the accordion content should be a named region according to content size and page structure. Preserve native button semantics; check heading nesting with actual Business Suite page outline.
3. Define arrow/Home/End keyboard movement, focus wrapping, and disabled-item rules or explicitly justify native-button Tab-only navigation against the chosen accessible interaction standard. Preserve Enter/Space behavior.
4. Reconcile the separate composition and primitive `Collapsible` implementations. Keep old imports valid; map `Disclosure` to a canonical adapter only after exact consumer/source usage and package export checks. Keep sidebar and FormSection disclosure ownership separate unless a real equivalence map supports convergence.
5. Review uncontrolled default selection, controlled value normalization, `single` close behavior (empty string callback), `multiple`, disabled item, no-item/empty, long/multiline title, nested interactive content, and child state when closed content unmounts. Add focused stories/tests only after implementation gate opens.
6. Verify all Strata themes, four densities (including effective minimum type size), LTR/RTL, narrow/wide reflow, 200% zoom, forced colours, reduced motion, focus indicator/contrast, keyboard and representative screen reader; inspect relevant matrices at app-level composition too.
7. Prove published subpath and root export behavior, then prove a real Business Suite settings/record task. Current package and UI inventory are not integration proof.

## Evidence limits

Browser reference snapshots were not retained as files. The shadcn/local first-open comparison uses the same 1280×720 canvas and light appearance, but the documentation chrome differs; the component extents were not pixel-aligned. Local click and Enter state changes were observed; no automated test was run. The current Input/DataTable/Breadcrumb calibration gate remains open, so this research does not authorize broad implementation. Neither implementation nor Business Suite integration, deployment, nor release is claimed.
