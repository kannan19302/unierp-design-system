# AppShell-4 top-navigation calibration — R2 change contract — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — shared shell presentation and Storybook consumer`. Owner: PLT-DS. Business Suite journey owner: PLT-ERP. Scope: the AppShell-4 Storybook composition and its comparison evidence; no public component API or consumer route change.

## Human outcome

Make the documented AppShell `topbar` story demonstrate a genuine horizontal application-navigation layout with a separate workspace-navigation row, comparable to the selected community implementation, while retaining Strata tokens and application-owned route semantics.

## Authority and boundaries

- Workspace `AGENTS.md`, accepted ADR-0009, DS-FR-010, DS-NFR-004/007/009, the frozen Strata Elevation Protocol, and the current component benchmark program apply.
- PLT-DS owns shared shell presentation and Storybook fixtures. PLT-ERP owns module visibility, authorization, route destinations, and real Business Suite journey proof.
- AppShell already exposes `topNav` and `topNavigation`; this packet composes those existing slots. No shared runtime API, package contract, data, identity, permissions, persistence, dependency, deployment, publication, or release changes.
- The specific Application Shell 4 live preview endpoint returned HTTP 403; the published static reference preview remains accessible. The comparison must disclose this interaction-evidence limitation.

## Acceptance criteria

1. **AC-01 — Variant fidelity:** AppShell-4 Storybook uses a horizontal global navigation row and a distinct secondary workspace-navigation row; it does not display a left sidebar that contradicts the chosen top-navigation reference.
2. **AC-02 — Native semantics:** both rows expose uniquely named navigation landmarks and native anchor destinations within the illustrative story; the active location is identified with `aria-current`.
3. **AC-03 — Reference evidence:** retain exact reference URL, viewport/capture limitation, current Storybook story URL, visual differences, and a side-by-side browser artifact. Do not claim interactive reference verification while its preview endpoint is inaccessible.
4. **AC-04 — Provider evidence:** focused AppShell tests, Storybook standards, typecheck, lint, and package build pass on supported Node 22; browser inspection confirms both rows and no horizontal document overflow at the selected desktop viewport.
5. **AC-05 — Honest readiness:** keep the AppShell ledger row `NOT VERIFIED` until state, theme, density, direction, keyboard/screen-reader, responsive/zoom, and Business Suite route evidence is complete.

## Rollback

Restore only the AppShell-4 story composition, its story-only navigation styles, comparison artifact, and this contract's evidence updates. No consumer migration or runtime package change is part of this packet.

## Verification plan

- Inspect Shadcnblocks Application Shell 4 preview and official shadcn Sidebar guidance; record access limitations.
- Run focused AppShell tests, `pnpm check:storybook`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and visually inspect the local Storybook story at the matched comparison frame.
- Verify semantic names and anchor destinations in the browser accessibility tree; inspect responsive behavior at a narrow viewport as an evidence sample, not a full matrix.
- Review the full diff and preserve unrelated dirty worktree changes.

## Knowledge delta

`UPDATED` — the AppShell-4 Storybook fixture now represents the existing top-navigation slots explicitly, and its comparison packet records the selected pattern and limits. No product requirement or package contract changes. Full shell/consumer readiness remains `REQUIRED-BUT-INCOMPLETE`.

## Results — 2026-09-28

- **AC-01/02: PASS at the Storybook composition boundary.** Browser inspection at approximately 1274 × 718 shows two horizontal navigation rows without a left rail. The accessibility tree reports `Module navigation` and `Workspace views`; the workspace links target the overview, recent-work, and report sections.
- **AC-03: PARTIAL.** The exact published 668 × 501 reference image and the updated local story were inspected separately. The local HTML side-by-side artifact was authored, but browser security policy rejected opening its `file:` URL; the paired artifact itself was not visually validated. The shadcnblocks live preview endpoint returned 403, so no reference interaction claims are made.
- **AC-04: PARTIAL.** On Node 22.23.3, AppShell tests pass 21/21, full suite 136 files / 831 tests, `check:storybook` (123 files / 116 component stories), `check:inventory` (116 components), `typecheck`, `lint`, and `build` pass. `check:storybook` and `typecheck` were rerun after the final title/breadcrumb story edit and passed. A formal horizontal-overflow measurement was not captured.
- **AC-05: PASS as a status rule.** The ledger row remains `NOT VERIFIED`; themes, densities, direction, keyboard/screen-reader matrix, responsive/zoom, full visual pairing, and Business Suite journey remain open.

Designed: horizontal module navigation plus distinct workspace views. Implemented: AppShell-4 Storybook composition and tokenized link styling only. Tested: provider checks above pass. Integrated: not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full AppShell and Business Suite readiness remains `REQUIRED-BUT-INCOMPLETE`. Status: `PARTIAL`; this is not done.
