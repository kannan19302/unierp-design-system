# Input visual matrix captures — 2026-09-28

Status: `PARTIAL`. This supplements the [live shadcn Input comparison](comparison.md) and scoped R2 [visual matrix URL correction contract](../../../../changes/strata-visual-matrix-global-url-2026-09-28.md). It closes only local provider theme/density capture and geometry; Input remains `NOT VERIFIED` overall.

## Exact browser run

- Local story: `inputs-input--all-states-gallery` at `http://localhost:6006/iframe.html`.
- Reference: [official shadcn Base Input](https://ui.shadcn.com/docs/components/base/input#basic); matched Default captures remain in [comparison.html](comparison.html). The official docs shell is not viewport-equivalent to the local Storybook canvas.
- Runtime: Chromium headless, Node 22.23.3, viewport 1280×800 CSS px, Storybook live preview.
- Generated URLs use `theme:<value>;density:<value>`. The matrix test verifies requested `html[data-theme]` and `html[data-density]` to catch default fallback.
- Each screenshot shows the same five labeled states: empty, leading search icon, invalid, disabled and read-only.
- Every sample measured document and body width 1280px, five input controls at 312px, and row heights matching the selected density: ultra-compact 24px, compact 28px, standard 32px, comfortable 40px. No browser page errors were observed.

## Retained samples

| Theme | Ultra-compact | Compact | Standard | Comfortable |
|---|---|---|---|---|
| Strata | [24px](matrix-strata-ultra-compact.png) | [28px](matrix-strata-compact.png) | [32px](matrix-strata-standard.png) | [40px](matrix-strata-comfortable.png) |
| Strata dark | [24px](matrix-strata-dark-ultra-compact.png) | [28px](matrix-strata-dark-compact.png) | [32px](matrix-strata-dark-standard.png) | [40px](matrix-strata-dark-comfortable.png) |
| Strata high contrast | [24px](matrix-strata-high-contrast-ultra-compact.png) | [28px](matrix-strata-high-contrast-compact.png) | [32px](matrix-strata-high-contrast-standard.png) | [40px](matrix-strata-high-contrast-comfortable.png) |

The leading-icon wrapper originally shrink-wrapped to a narrower width in the gallery because the example omitted the existing `fullWidth` prop. The gallery now opts into `fullWidth`; all five controls align at 312px in the current capture. This is a story-only comparison correction; no Input runtime API or CSS changed.

## Remaining proof

The capture does not prove determinate automated contrast across the full matrix, live assistive-technology output, true browser 200% zoom, operating-system forced-colour/reduced-motion modes, consuming-app route behavior, or published package compatibility. Input remains `NOT VERIFIED` and the frozen Input/DataTable/Breadcrumb elevation gate remains open.

Designed: `PARTIAL`; Implemented: Storybook fixture and comparison-tooling correction; Tested: focused URL regression plus 12 real-browser theme/density samples; Integrated: `NOT VERIFIED`; Deployed: `NO`; Released: `NO`. Knowledge delta: `UPDATED`; overall readiness remains `REQUIRED-BUT-INCOMPLETE`.
