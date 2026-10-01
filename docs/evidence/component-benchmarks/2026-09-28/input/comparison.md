# Strata Input comparison and density recalibration — 2026-09-28

## Scope and sources

- Local Strata default: [Storybook `Inputs / Input / Default`](http://localhost:6006/iframe.html?id=inputs-input--default&viewMode=story)
- Local state gallery: [Storybook `Inputs / Input / All States Gallery`](http://localhost:6006/iframe.html?id=inputs-input--all-states-gallery&viewMode=story)
- Primary live reference: [shadcn Base Input, Basic](https://ui.shadcn.com/docs/components/base/input#basic)
- Current component source: `src/inputs/text-field/`; shared token source: `src/foundation/tokens/density.css`.
- Prior persisted side-by-side capture files are listed in `docs/evidence/strata-component-benchmarks.csv`. The matrix below is fresh browser DOM/computed-style observation; new matrix screenshots were not persisted.

## Baseline comparison

At the previously matched 1046×714 CSS-pixel browser viewport, shadcn Basic and Strata Default both measured 320×32px in standard density. Strata retains its Inter typography, 13px standard input type, 6px radius and semantic colors. These are intentional Strata differences; the shadcn docs' 320px width includes its own page frame. The 320px local comparison retains 16px side gutters and no document overflow.

## Density defect and result

The live matrix at 1707px viewport width initially showed the Strata md input at 24/28/32/32px for ultra-compact/compact/standard/comfortable. `data-density="comfortable"` declared a 40px token, but the later standard rule's `:root` arm had equal specificity and reset the token to 32px. The root arm now uses zero-specificity `:where(:root)`, leaving each explicit density selector in control. The density gate also previously inspected obsolete `src/core/...` paths and treated a missing source as a skipped check; it now checks the current token files and fails when they are absent.

After the correction, the live default Input measured:

| Theme | Ultra-compact | Compact | Standard | Comfortable | Document/body width |
| --- | ---: | ---: | ---: | ---: | ---: |
| Strata light | 24px | 28px | 32px | 40px | 1707/1707px |
| Strata dark | 24px | 28px | 32px | 40px | 1707/1707px |
| Strata high contrast | 24px | 28px | 32px | 40px | 1707/1707px |

The all-states gallery retained all five fields in 12/12 theme × density samples: default, left-icon search, invalid email, disabled fiscal identifier and read-only posted invoice. All five followed the respective mode height in each sample. No document overflow was observed. This does not establish true 200% browser zoom, operating-system forced-colour/reduced-motion behavior, live screen-reader output, or consuming-app route behavior.

The `Inputs / Input / Sizes` story was also measured in every theme × density combination. The small/medium/large tuples were identical across all three themes:

| Density | Small | Medium | Large |
| --- | ---: | ---: | ---: |
| Ultra-compact | 20px | 24px | 28px |
| Compact | 24px | 28px | 32px |
| Standard | 28px | 32px | 40px |
| Comfortable | 32px | 40px | 48px |

All 12 samples retained all three sizes and stayed within a 1707px document/body width. This closes the provider-side size geometry axis at desktop width; consuming-app rendering is still unverified.

## Evidence limits

- Existing paired screenshots represent the standard-density baseline only; the new live matrix is recorded as computed DOM geometry and was not saved as screenshots.
- Direction and narrow-width states were not rerun in this correction packet; prior 320px local reflow evidence remains applicable to width behavior, not to a full density × direction matrix.
- The browser reference remains the current official shadcn page; exact visual crop alignment is limited by the reference's docs shell.
- Overall Input remains `NOT VERIFIED` under the frozen Strata elevation protocol.

## Input theme × density capture follow-up — 2026-09-28

The [visual matrix URL correction packet](../../../../changes/strata-visual-matrix-global-url-2026-09-28.md) fixes comma-separated Storybook globals: the live preview had warned `Omitted potentially unsafe URL args` and fallen back to Strata light/standard. Generated visual test URLs now use Storybook's semicolon separator, and the visual regression suite asserts that requested theme and density were actually applied before snapshot capture. A regression test passes all 12 canonical theme × density URL combinations. In the Input all-states story, the leading-icon field now opts into the existing `fullWidth` prop so the five comparison states use one geometry. Fresh 1280×800 browser runs confirmed each of 12 requested modes, five 312px fields at density heights 24/28/32/40px, document/body width 1280px, and no page errors. Screenshots and row measurements are linked in [matrix-captures.md](matrix-captures.md). This is provider evidence only; missing consumer and accessibility proof remains open and Input stays `NOT VERIFIED`.
