# Input default Storybook reference match — 2026-09-28

Status: `PARTIAL`. Risk: `R1 — Storybook fixture presentation only`. Owner: PLT-DS. Consumer: local Storybook. This packet changes no component runtime behavior, API, token, dependency, consumer package, data, auth, or deployment.

## Acceptance criteria

1. **AC-01 — Equivalent live examples:** compare the current `Inputs / Input / Default` Storybook story to shadcn's live `Basic` input example at a matched viewport and state; record exact browser dimensions and URLs.
2. **AC-02 — Story frame match:** present the Strata default input in a 320px benchmark field frame and allow it to reflow to the available 288px at a 320px viewport, matching the inspected reference's 320px desktop example without page overflow.
3. **AC-03 — Strata rules:** retain the 32px standard-density control, semantic tokens, Inter font, Strata radius and API; do not copy the shadcn font, 10px radius or theme.
4. **AC-04 — Proof:** rebuild Storybook, inspect comparable screenshots, verify the local input width at desktop and narrow width, and run focused input tests/typecheck. Any other calibration axis remains separately unverified.

## Current source and comparison

Current source: `src/inputs/text-field/`. Local default story: `inputs-input--default`. Primary reference: [shadcn Input Basic](https://ui.shadcn.com/docs/components/base/input#basic), inspected live 2026-09-28. At a 1046×714 CSS-pixel browser viewport the reference Basic input measured 320×32px, Geist 14px and 10px radius. Before the change, Strata measured 205.6×32px in the same viewport because the centered story did not give its input a field container. Strata's standard-density height already matched at 32px; its 6px token radius and 13px type scale intentionally follow the owning design language.

Only the Storybook Default example will gain a 320px max-width container and use the existing `fullWidth` prop. At a 320px viewport the container uses 288px to retain 16px margins. The component API and runtime CSS remain unchanged. Rollback is reverting the local story-only wrapper.

Knowledge delta: `UPDATED` — one current component comparison observation is recorded against the new 113-row benchmark. The visual pair is not a component calibration PASS; keyboard/screen-reader, zoom, forced-colour, reduced-motion and affected consumer proof are outside this packet.

## Implementation and verification

`src/inputs/text-field/text-field.stories.tsx` now gives the Default story a responsive 320px max-width field frame and uses the reference's `Enter text` placeholder. It uses the existing `fullWidth` prop. Runtime CSS, public exports and component behavior did not change.

| Check | Result |
| --- | --- |
| `pnpm exec vitest run src/inputs/text-field/text-field.test.tsx` | PASS — Node 22.23.3, 8/8 tests including axe states. |
| `pnpm typecheck` | PASS — Node 22.23.3. |
| `pnpm --dir storybook build-storybook` | PASS — fresh static output built on Node 22.23.3. |
| Live reference/Storybook desktop comparison | PASS for the default visual sample — at 1046×714, both fields measured 320×32px. |
| Live narrow viewport comparison | PASS for local reflow — at 320×714 the Strata input measured 288×32px with 16px margins; document/body each measured 320px. The reference measured 175.2×32px inside its documentation navigation/content column; its page measured 305px. |
| Keyboard focus sample | PASS for one Tab entry — textbox was `:focus-visible` with a 1.6px primary outline. Focus exit and larger keyboard flow are not covered by this sample. |
| True 200% browser zoom | NOT VERIFIED — the Playwright browser key chord did not change visual viewport scale; viewport resizing is not counted as zoom evidence. |

The persisted evidence set is [`comparison.html`](../evidence/component-benchmarks/2026-09-28/input/comparison.html), with desktop and 320px captures of the online reference and local Storybook. Current-source axis states are recorded in the 113-row CSV. Input overall remains `NOT VERIFIED` pending the full theme/density/direction and states matrix, determinate contrast result, true zoom, OS accessibility modes, screen-reader, affected consumer gates, and final calibration handoff.
