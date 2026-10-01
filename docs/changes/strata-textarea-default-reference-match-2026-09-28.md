# Textarea default Storybook reference match — 2026-09-28

Status: `PARTIAL`. Risk: `R1 — Storybook fixture presentation only`. Owner: PLT-DS. Preview consumer: Storybook. This packet is scoped to the Default story frame/content; it does not change the Textarea component API or runtime behavior.

## Acceptance criteria

1. **AC-01 — Equivalent examples:** compare the local Textarea Default story with the official shadcn Textarea examples, identify the exact rendering engine, URL, viewport, and state.
2. **AC-02 — Matched benchmark frame:** render the Strata default in a 320px frame with a 2-row empty textarea, reflowing to available width at narrow viewports without document overflow.
3. **AC-03 — Strata contract:** retain Strata Inter typography, semantic tokens, 6px radius, and existing runtime control sizing and resize behavior; do not import another palette, font, theme, or package.
4. **AC-04 — Story accessibility:** give the example an accessible name and retain a visible focus indicator.
5. **AC-05 — Proof:** compare the actual Storybook build and live reference at matched 1280×720 viewport, retain both screenshots and exact measurements, and run focused Textarea tests, typecheck, Storybook standards, and a fresh Storybook build.
6. **AC-06 — Honest scope:** record unresolved disabled-state contrast, all-theme/density/direction, true zoom, OS-mode, screen-reader, and consumer checks; Textarea remains `NOT VERIFIED` overall until those axes pass.

## Authority, ownership, and research

- Governing sources: workspace `AGENTS.md`; ADR-0009 and ADR-0012; `platform/docs/platforms/design-system/STRATA_ELEVATION_PROTOCOL.md`; Design Platform requirements and UI package contract; `design-system/AGENTS.md`.
- Owner: PLT-DS / `@kannan19302/ui`. Layer: L1 provider; Storybook is an L4 consumer. Business Suite owns workflow composition and data; no app route or domain behavior is changed here.
- Local source and preview: `src/inputs/text-area/`, story ID `inputs-textarea--default`.
- Primary: [official shadcn Textarea — Base UI](https://ui.shadcn.com/docs/components/base/textarea), inspected live 2026-09-28. Its empty default is a native textarea with visible placeholder, 320×64px at the matched viewport; documented examples include a labeled/described field, disabled, invalid, button-composed, and RTL states. Resize affordance is visible.
- Supplemental 1: [official shadcn Textarea — React Aria](https://ui.shadcn.com/docs/components/aria/textarea), inspected live. The same native textarea/form composition remains, with a React Aria implementation and accessible field patterns.
- Supplemental 2: [official shadcn Textarea — Radix UI](https://ui.shadcn.com/docs/components/radix/textarea), inspected live. It preserves the same textarea task and demonstrates field, disabled, invalid, submit-button, and RTL compositions.
- Benchmark decision: Base UI wins as primary because it is the selected default reference implementation and its exact empty native entry example can be compared directly. React Aria and Radix confirm the cross-implementation semantic/state pattern. Their typography, palette, and component source are not copy targets.

## Current observation and intended change

The local Storybook and online reference were opened at a 1280×720 CSS-pixel browser window. Browser accessibility/layout inspection measured the local textarea at 185×80px (`x=548`, `y=317`) against the Base UI example at 320×64px (`x=472`, `y=379`). The local Default story currently inherits three rows and `Enter internal audit notes...`; the reference uses a two-row empty message field with a 320px width. The local centered Storybook fixture provides no width context, so its textarea renders at intrinsic content width.

The scoped correction is to wrap only the Default story in `min(320px, calc(100vw - 32px))`, set `fullWidth`, use two rows, and use the reference placeholder with a meaningful accessible name. This keeps the public component's 3-row default and all runtime CSS unchanged. At narrow width, the fixture should keep 16px gutters and stay within the viewport.

Source findings for later component calibration (not changed here): disabled text uses muted color plus 50% opacity, which may reduce contrast; error styles include a literal red fallback. These and theme/density/direction, keyboard, contrast, zoom, OS modes, screen-reader, and consumer gates remain open. The Input/DataTable/Breadcrumb elevation gate still governs broad component implementation.

## Verification and acceptance state

| Criterion | Current state | Evidence |
| --- | --- | --- |
| AC-01 — live equivalents | PASS | Actual Base UI, React Aria, and Radix Textarea pages inspected; primary example selected. |
| AC-02 — frame match | PARTIAL | Width now matches at 320px. Current height is 80px vs 64px because Strata's standard-density minimum remains in force. Narrow story is 288px with 16px margins and no page overflow. |
| AC-03 — Strata contract | PASS | The planned edit touches only Storybook Default; no public API/runtime style change. |
| AC-04 — accessibility | PASS for story sample | AX exposes a native multiline textbox named `Message`; Tab focuses it and the visible focus treatment is present. Screen-reader behavior is still unverified. |
| AC-05 — matched screenshots and provider gates | PASS for scoped checks | Matched 1280×720 reference/Storybook screenshots saved; focused test 4/4, typecheck, token gate (no new violations; 155 baselined), Storybook standards (120 stories/113 components), and fresh Storybook build pass on Node 22.23.3. Height comparison remains open under AC-02. |
| AC-06 — full readiness | NOT VERIFIED | Full matrix and downstream consumer evidence remain required. |

## Implementation and verification

Only the Storybook `Default` fixture changed. It now uses a `min(320px, calc(100vw - 32px))` frame, `fullWidth`, two rows, the reference placeholder, and `aria-label="Message"`. Public exports and runtime component code are unchanged.

| Check | Result |
| --- | --- |
| Focused Textarea tests | PASS — Node `v22.23.3`, 4/4. |
| `pnpm typecheck` | PASS — Node `v22.23.3`. |
| `pnpm check:storybook` | PASS — 120 source story files parsed; all 113 component stories conform. |
| `pnpm check:tokens` | PASS — no new violations; 155 existing violations in 19 baselined files remain. |
| `pnpm --dir storybook build-storybook` | PASS — fresh Node 22 build, 2,316 modules transformed. |
| Matched live comparison | PARTIAL — at 1280×720, local after-fix is 320×80px vs Base UI 320×64px. Width is aligned; 16px height difference remains. |
| Narrow layout | PASS — at 320×720, local field is 288×80px at x=16; document and body stay 320px wide. |
| Accessibility sample | PARTIAL — textbox has AX name `Message`, receives Tab focus and visible focus; no screen-reader test. |

Persisted comparison and screenshots: [`comparison.md`](../evidence/component-benchmarks/2026-09-28/text-area/comparison.md), reference screenshot, and Storybook before/after/focus/narrow captures. Textarea is not elevated: theme/density/direction/state matrix, contrast, true zoom, OS modes, screen reader, published package and Business Suite journey proof remain open.

Designed: direct reference comparison and Storybook frame. Implemented: story-only default example correction. Tested: focused test, typecheck, Storybook standards and fresh build; browser measurements and focus sample recorded. Integrated: Storybook only; no Business Suite route integration. Deployed: no. Released/published: no.

Knowledge delta: `UPDATED` — the actual local/reference geometry mismatch, selected reference, and next scoped correction are now recorded. **This is not done.**
