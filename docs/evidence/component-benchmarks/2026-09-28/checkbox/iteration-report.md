# Checkbox iteration report — 2026-09-28

Status: `PARTIAL`

## Objective and acceptance criteria

1. Matched 1280×720 Strata Default and official shadcn Base UI comparison, with retained captures: `PASS`.
2. Inspect three actual equivalents and record a benchmark decision: `PASS` (Base UI, React Aria, Radix).
3. Correct and verify mixed native/accessibility state while preserving keyboard and forwarded-ref behavior: `PASS` for the sampled native and browser accessibility states.
4. Run provider package checks and record scope limits: `PASS` for the executed design-system gates.
5. Record the evidence and implementation in the single Checkbox ledger row and PLT-DS traceability: `PASS`.
6. Prove complete component readiness, Business Suite integration and customer journey: `NOT VERIFIED`.

## Changes and findings

- `Checkbox` now maps its existing `indeterminate` prop to `HTMLInputElement.indeterminate` before paint and reasserts it after native activation. It retains the public API and forwards the native input ref.
- Focused tests cover `true → false → true` prop updates, activation while mixed, and ref forwarding. The existing controlled checked, disabled, invalid and axe cases remain.
- Before the fix, visual mixed state and native accessibility state diverged. After the fix, Storybook's AX snapshot reports `[checked=mixed]` both before and after Tab + Space. Post-Space DOM reports `checked=true`, `indeterminate=true`, and visual `data-state=indeterminate`.
- The 16×16px control still matches the measured official Base UI control. Other shadcn implementation variants were inspected; no reference code or dependency was copied.
- Business Suite source inventory found six native checkbox callsites and no shared Strata Checkbox import/JSX. No route or journey was rendered.

## Validation executed

All package commands ran with Node `v22.23.3`.

| Check | Result |
| --- | --- |
| `pnpm exec vitest run src/inputs/checkbox/checkbox.test.tsx` | PASS — final run 1 file / 9 tests, including React 19 callback-ref cleanup |
| `pnpm test` | PASS — 132 files / 820 tests after the mixed-state correction and before the final React 19 ref-cleanup refinement; the final 9-test Checkbox suite and full typecheck/lint/build gates pass after that refinement |
| `pnpm typecheck` | PASS — exit 0, including final test-file change |
| `pnpm lint` | PASS — foundation, inventory, token, logical CSS, governance, layer, density, contrast, platform accents and typecheck gates; run after runtime correction |
| `pnpm check:storybook` | PASS — 120 story files parsed; 113 component stories conform |
| `pnpm build` | PASS — package build, built-in gates, 113-component inventory generated |
| `pnpm --dir storybook build-storybook` | PASS — production Storybook build, 2,316 modules transformed |
| Live Storybook browser | PASS for sample — 1280×720; native `indeterminate=true`; AX `[checked=mixed]`; Tab + Space preserves mixed state and visible focus |
| Business Suite integration | NOT VERIFIED — no shared Checkbox consumer; no route journey |
| Full visual/accessibility matrix | NOT VERIFIED — all theme/density combinations, narrow/zoom, RTL, forced colors, reduced motion and live screen reader remain open |

## Evidence and status

- Primary reference: https://ui.shadcn.com/docs/components/base/checkbox
- Supplemental references: https://ui.shadcn.com/docs/components/aria/checkbox and https://ui.shadcn.com/docs/components/radix/checkbox
- Local Storybook mixed-state story: `http://127.0.0.1:6006/iframe.html?id=inputs-checkbox--indeterminate&viewMode=story`
- Source baseline: HEAD `8b9354b1cb05f7b4413fb10c72fad605d3038eb6`; final source blob `64452fa732e8d07e583eb4cd6d24a7677d00d182`; final test blob `6d60c17d1213d5430a64e257654b56386c6a016a`. Storybook was rebuilt from this working tree.
- Captures and detailed findings: [comparison packet](comparison.md).
- Cross-root contract: [STRATA_CHECKBOX_MIXED_STATE_CHANGE_CONTRACT_2026-09-28.md](../../../../../../platform/docs/platforms/design-system/STRATA_CHECKBOX_MIXED_STATE_CHANGE_CONTRACT_2026-09-28.md).

Designed: correction contract and benchmark evidence. Implemented: mixed native-state synchronization and regression tests. Tested: focused and full package suites, typecheck, lint, package build, Storybook gates/build and live browser state. Integrated: Storybook preview only; Business Suite not integrated. Deployed: no. Released/published: no.

Knowledge delta: `UPDATED`. The local mixed-state defect is corrected, but Checkbox remains `NOT VERIFIED` overall and the full Strata goal remains active. **This is not done.**
