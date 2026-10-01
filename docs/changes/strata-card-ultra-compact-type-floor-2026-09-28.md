# Strata Card ultra-compact text floor — R2 change contract — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — shared UI package behavior and conformance gate`. Owner: PLT-DS. Consumer owner: PLT-ERP (Business Suite). Scope: Card ultra-compact typography fallback and its density regression check. This is a focused correction under the component benchmark program; it does not pass the Card row or the overall readiness gate.

## Human outcome

Keep all supported Card product text at or above the accepted 11 CSS pixel minimum when the canonical typography token is unavailable, while preserving Strata's token-driven styling.

## Authority and boundaries

- Workspace `AGENTS.md`, accepted ADR-0009, design-system `DS-FR-007` and `DS-NFR-006`, and `strata-113-component-benchmark-program-2026-09-28.md` govern this packet.
- ADR-0009 and `DS-NFR-006` set an 11px minimum. The canonical `--type-micro` token is 0.6875rem (11px); the Card stylesheet's previous 10px fallback contradicted that requirement.
- PLT-DS owns the shared Card and provider gate. PLT-ERP owns consumer composition and Business Suite route evidence. No consumer code or API is changed.
- Risk/data/auth/tenant/contract impact: none. No dependencies, package version, data, permission, persistence, deployment, publication, or release changes.

## Acceptance criteria

1. **AC-01 — Typography floor:** Card ultra-compact root and description use the approved micro-text token with a fallback of at least 11px.
2. **AC-02 — Regression evidence:** `check:density` fails if either required Card ultra-compact text fallback is missing or below 11px and passes for the approved 11px token fallback.
3. **AC-03 — Behavior retained:** existing Card structure, density API, other density modes, and native consumer action semantics remain unchanged; focused Card tests pass.
4. **AC-04 — Honest readiness:** update the Card evidence packet, benchmark ledger, PLT-DS traceability, and iteration report. Keep Card and goal readiness `NOT VERIFIED`/`PARTIAL` while other applicable axes and consumer journey evidence remain open.

## Rollback

Revert only the two Card CSS fallback declarations, the Card-specific density assertion, and this packet's evidence updates. The accepted 11px floor remains authoritative; rollback would require a corrected implementation before this packet can be considered complete.

## Verification plan

- Focused Card test file and `pnpm check:density` on supported Node 22.
- Provider `pnpm lint`, `pnpm typecheck`, `pnpm check:inventory`, `pnpm check:storybook`, and `pnpm build` because the shared package and its density gate changed.
- Inspect the complete diff and preserve unrelated workspace changes.
- Browser computed-style, matched reference, full density/theme/direction/reflow/accessibility, package consumer, and Business Suite route proof remain separate open criteria; this patch does not claim them.

## Knowledge delta

`UPDATED` — the existing requirement is now enforced for Card's two ultra-compact text declarations by the provider density gate. No product requirement changes. Evidence is still `REQUIRED-BUT-INCOMPLETE` for the full Card matrix and Business Suite use.

## Validation results — 2026-09-28

On Node 22.23.3, AC-01 and AC-02 pass by source inspection and `pnpm check:density`; AC-03 passes the focused Card suite (6/6) and the full Design System suite (136 files / 831 tests). `pnpm lint`, `pnpm typecheck`, `pnpm check:inventory` (116 components), `pnpm check:storybook` (123 story files / 116 component stories), and `pnpm build` also pass. AC-04 evidence files are updated and readiness remains open as required. Live computed-style matrix, retained matched screenshot pair, and rendered Business Suite route are `NOT VERIFIED`.
