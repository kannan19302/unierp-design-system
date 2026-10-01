# Card comparison — 2026-09-28

## Scope and identity

The public Strata `Card` is a neutral surface with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` slots. It is exported by `@kannan19302/ui` through `src/compositions/index.ts` and the root barrel. The accepted authority is ADR-0009: cards are for independent summaries or choices; the workbench uses low-elevation, separator-led surfaces and does not use generic cards as a default page container. This remains a presentation primitive; links, buttons, selection state, and their keyboard semantics belong to the actual interactive child/composition.

The local `compositions-card--anatomy-and-composition` story and official [shadcn Card](https://ui.shadcn.com/docs/components/base/card) were visually inspected live at 1280×720. The local example is 360px wide and shows a finance summary with a separated header, body, and footer action. The shadcn page’s live card preview is a login form; its source/API documents the same named slots, an optional `CardAction`, `default`/`sm` sizes, shared `--card-spacing`, image compositions, and RTL example. These are not identical content examples, but their component anatomy was directly compared at the same viewport. Local default was also inspected: it renders only the title and description in a centered, roughly 400px wide bordered card.

## References and benchmark decision

The primary reference is [shadcn Card](https://ui.shadcn.com/docs/components/base/card) because it is the direct community standard named in the request and matches the slot-composition API. [Fluent 2 Card guidance](https://fluent2.microsoft.design/components/web/react/core/card/usage) is supplemental for structural flexibility, responsive sizing, and the requirement to distinguish selectable/clickable interaction from plain presentation; its live example area displayed a loading label, so product-demo visual behavior is not claimed. [MUI Card](https://mui.com/material-ui/react-card/) is a secondary implementation reference for separating a primary action area from supplemental buttons and for restrained use as an entry point to a larger task.

The references were inspected 2026-09-28. Scores use the protocol’s eight dimensions (0–3 each), weighting task fit and semantics/keyboard twice, for a 30-point maximum. These scores compare reference utility; they do not represent Strata readiness.

| Reference | Task fit | Interaction | States | Density/reflow | Semantics/keyboard | Visual | Portability | Maintenance | Score / 30 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| shadcn Card (primary) | 3 | 2 | 2 | 2 | 2 | 3 | 3 | 2 | 24 |
| Fluent 2 Card (interaction/reflow supplement) | 2 | 3 | 3 | 3 | 3 | 2 | 1 | 2 | 25 |
| MUI Card (action-boundary supplement) | 2 | 2 | 2 | 2 | 2 | 3 | 1 | 1 | 19 |

Retain Strata’s visual identity and spacing tokens instead of copying another system’s theme. Adopt the shadcn slot vocabulary and shared inset behavior as a comparison target; decide explicitly whether the optional header action belongs in the stable API. Do not turn the neutral Card root into an implicit button or anchor.

## Findings

- **11px floor correction (2026-09-28):** Card's ultra-compact root and description now use `var(--type-micro, 11px)`, matching the accepted token and DS-NFR-006 minimum. `scripts/check-density.mjs` now guards both declarations against a missing or sub-11px fallback. This corrects the confirmed source-level gap; it does not prove live computed styles, all Card density axes, or Business Suite readiness. The R2 packet is `docs/changes/strata-card-ultra-compact-type-floor-2026-09-28.md`.

- **The local anatomy aligns well:** the live sample uses the same header/title/description/content/footer order as shadcn and a restrained border with section separators. The 360px story card at this viewport is close to the shadcn login-preview width. The local default story uses a simpler title/description surface, so it does not by itself prove the compound API appearance.
- **Padding can stack:** the `Card` root defaults to `padding="md"`, whose CSS uses `--density-card-padding` with a 16px fallback. The compound Header, Content, and Footer slots also supply their own inset spacing. The anatomy story explicitly sets `padding="none"` to avoid a second outer inset. Compound consumers that omit `padding="none"` can get unintended cumulative spacing; the effective consumer token value was not inspected. `sm` and `md` use the density-card token with different fallbacks; `lg` is a fixed 24px. This API needs one coherent card-spacing contract.
- **Confirmed requirements conflict, corrected in follow-up:** before the R2 correction, `.densityUltraCompact` and its description used `var(--text-2xs, 10px)`, conflicting with accepted ADR-0009 and `DS-NFR-006`. Both now use `var(--type-micro, 11px)`, and `check-density.mjs` guards them. The gate does not prove live computed styles in every supported theme or consumer.
- **Density contract is underspecified:** `Card` offers four variants, but the 24/28/32/40 labels in stories refer to header sizes, not a measured component height. A card is intrinsically content-sized; density should govern spacing/type roles and must not promise fixed card heights. The exact density behavior and effective computed tokens were not inspected across themes.
- **Interaction affordance:** `hover=true` changes the cursor, border, shadow, and transform, but the root is still a `div` with no built-in action or focus treatment. This is reasonable for a caller-composed surface only if caller interaction has a real link/button and visible focus. Do not treat hover or pointer cursor as interaction semantics.
- **Slot completeness:** shadcn currently documents `CardAction` in the header and a shared `--card-spacing`; local API has no `CardAction` slot or equivalent header grid and no image-specific composition guidance. These are candidate parity gaps, not automatic requirements; validate them against actual UniERP card uses before changing the API.
- **Real consuming source:** `business-suite/src/components/analytics/AnalyticsCockpitClient.tsx` imports `Card` from the package root and uses `Card padding="lg"` around chart panels. Business Suite has many other direct `Card` imports and JSX uses, including route files. The static source search proves use sites, not that the current built package, route, or rendered experience works end to end. `FeatureLinkCard` wraps a Card with a Next link, but the search found no use of that helper, so it is not proof of an active consumer journey.
- **Accessible structure:** Card’s root/subslots are generic divs; title is an `h3`, description a `p`, and children retain their own semantics. That is suitable for a neutral container, but heading rank and landmark labelling must be chosen in context. The Storybook AX tree exposes the title as h3 and the footer action as a button. No keyboard, screen-reader, axe, zoom, contrast, RTL, or small-screen accessibility check was performed. The source test has an axe assertion for a plain one-line Card but it was not run and does not cover all compositions.
- **Reference inspection limits:** shadcn and local Storybook screenshots are same-size viewport captures inspected in-session, but screenshots were not saved as artifacts. No matched themes/densities, 320px/200% zoom, high contrast, or Business Suite rendered card were compared. Fluent’s example demo was still loading; only its written behavior/layout guidance was inspected.

## Required follow-up before elevation

1. Bind Card to current `DS-FR-002`, `DS-FR-005`, `DS-FR-007`, `DS-NFR-006`, `DS-NFR-009`, and ADR-0009 in the component evidence matrix; run the applicable density/token checks when implementation work is authorized.
2. Fix the sub-11px fallback before declaring any Card density conformant. Verify computed values for all themes, not only the CSS fallback.
3. Define one compositional spacing model so the standard root inset does not accidentally add to slot insets; document when a caller selects no root padding and when slots manage spacing.
4. Decide whether CardAction/image composition or any selection/action-area wrapper is truly needed from observed UniERP consumers. Preserve native link/button semantics and visible keyboard focus for actionable cards.
5. Capture the full Storybook Card story matrix at matched shadcn comparisons: default, compound, four densities, all padding choices, hover/inert-vs-action context, LTR/RTL, 320px/desktop, all Strata themes, and relevant zoom/accessibility states.
6. Verify an actual Business Suite consumer in a rendered route, with package export/type/build evidence and accessible interactions. A direct source import alone is not end-to-end proof.
7. Keep broader component implementation frozen until Input, DataTable, and Breadcrumb calibration passes.

## Readiness

**Overall: NOT VERIFIED.** Card slot anatomy is close to shadcn, and live Business Suite source uses are present, but the sub-11px fallback contradicts accepted requirements; spacing and density need resolution; route/build/a11y proof is missing. This packet is evidence-only; no component, application, contract, or test changes were made.
