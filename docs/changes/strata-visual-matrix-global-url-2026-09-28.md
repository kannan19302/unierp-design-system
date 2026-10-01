# Storybook visual matrix globals correction — R2 change contract — 2026-09-28

## Status and outcome

- Status: `PARTIAL`; this is not done.
- Risk: `R2` — shared Storybook validation tooling used by the 116-component reference program.
- Accountable platform: PLT-DS. Consumer journey owner remains PLT-ERP. Storybook is an L4 consumer.
- Outcome: make generated theme/density comparison URLs apply the requested Storybook globals and make the matrix fail if Storybook silently falls back to its defaults.
- Scope: `storybook/tests/visual/discover-stories.ts`, its focused regression test, and the visual matrix assertion; a comparison-fixture width correction in the Input all-states story; targeted Input evidence and traceability.
- Out of scope: public UI API, Business Suite source, package version, publication, deployment, release, and all other visual changes.

## Acceptance criteria

1. **AC-01 — Valid global serialization:** generated URLs encode Storybook's actual semicolon-separated `globals=theme:<theme>;density:<density>` format and retain the requested story ID.
2. **AC-02 — Fail-closed visual matrix:** every generated visual matrix sample asserts that the Storybook iframe applied both requested HTML globals before taking a snapshot; a default-theme fallback cannot pass as another matrix sample.
3. **AC-03 — Regression proof:** a focused test covers all 12 canonical theme × density URL combinations and verifies decoded query values.
4. **AC-04 — Comparable fixture geometry:** the icon Input in the all-states gallery uses its existing `fullWidth` prop so all five controls fill their own grid cells consistently; no runtime API or behavior changes.
5. **AC-05 — Real browser evidence:** the current Input all-states gallery applies all 12 requested combinations, retains five consistently sized fields, reports expected density heights and no horizontal overflow, with screenshots saved and measurements recorded.
6. **AC-06 — Honest scope:** update the Input row evidence and PLT-DS traceability without promoting Input or catalog readiness; no consumer, screen-reader, true zoom or OS accessibility-mode claim is inferred.

## Authorities, owners, assumptions

- Inspected authorities: workspace `AGENTS.md`, design-system `AGENTS.md`, AI agent and knowledge lifecycle protocols, accepted ADR-0009/ADR-0012, PLT-DS requirements/experience/traceability, frozen Strata Elevation Protocol, current 116-row benchmark program, and existing Input calibration evidence.
- Requirement mapping: DS-FR-002/005/006/007, DS-NFR-009, DS-UX-004/008/009.
- Current defect observed: direct browser navigation with comma-joined globals was rejected by Storybook (`Omitted potentially unsafe URL args`) and applied `strata`/`standard` instead. Semicolon-separated globals applied each requested theme/density in the live preview.
- Compatibility: no consumer or published package behavior changes. Only the Storybook visual-matrix test infrastructure changes.
- Data, security, privacy and tenant scope: no business data or authorization logic; synthetic component stories only.
- Rollback: revert the URL separator, assertion, focused test and all-states-only `fullWidth` fixture prop; remove the packet's additional evidence. No state migration or runtime rollback.
- No publication, deployment, release, or source-control mutation is in scope.

## Verification plan

| Proof | Command/boundary | Expected result |
|---|---|---|
| URL serialization | `fnm exec --using 22.23.3 -- node --import tsx --test storybook/tests/visual/discover-stories.test.mjs` | 12 exact story/theme/density query combinations pass. |
| Live Storybook globals | Playwright Chromium at `inputs-input--all-states-gallery` with each generated URL | `html[data-theme]` and `html[data-density]` equal requested values; five fields remain; sizes/no-overflow recorded. |
| Captures | 12 local matrix screenshots | One retained screenshot per exact story/theme/density sample. |
| Broader validation | `pnpm check:storybook`; applicable type/lint/package gates if changed sources require | Story source inventory remains valid; no false-green due to fallback. |

The frozen calibration PASS gate still requires actual equivalents, representative accessibility/consumer evidence and every other applicable axis. This packet repairs only the matrix URL/check boundary and adds Input provider evidence; overall Input and all 116 benchmark rows remain `NOT VERIFIED` unless independently proven.

## Completion evidence

Status: `PARTIAL`; this is not done.

| Criterion | State | Evidence |
|---|---|---|
| AC-01 | `PASS` | Direct browser probe established semicolon-separated globals are applied; generated URL regression verifies every decoded URL. |
| AC-02 | `PASS` | `visual-regression.spec.ts` asserts both HTML globals before snapshots. The direct 12-sample browser matrix used the same URL generator and failed if either global mismatched. The full catalog snapshot suite was not run. |
| AC-03 | `PASS` | Node 22.23.3 `node --import tsx --test tests/visual/discover-stories.test.mjs`: 1 test, all 12 canonical combinations pass. |
| AC-04 | `PASS` | The leading-icon gallery input now uses `fullWidth`; all five controls measure 312px in every captured theme/density mode. No Input runtime source changed. |
| AC-05 | `PASS` | Ledger and PLT-DS traceability updated; Input and catalog remain `NOT VERIFIED`. No consumer/AT/zoom/OS-mode claim added. |
| AC-06 | `PASS` | Scope and evidence remain honest; no consumer, screen-reader, true zoom or OS-mode completion inferred. |

### Verification run

| Status | Working directory | Command / boundary | Result |
|---|---|---|---|
| `PASS` | `design-system/storybook` | `fnm exec --using 22.23.3 -- node --import tsx --test tests/visual/discover-stories.test.mjs` | 1 test passes; asserts all 12 theme × density URLs. |
| `PASS` | `design-system` | Node 22.23.3 `pnpm check:storybook` | 123 story files parsed; 116 component story files conform. |
| `PASS` | `design-system` | Node 22.23.3 `pnpm typecheck` | Exit code 0. |
| `PASS` | `design-system` | Node 22.23.3 `pnpm test -- src/inputs/text-field/text-field.test.tsx` | 1 file, 8 tests pass. |
| `PASS` | `design-system` | Node 22.23.3 `pnpm lint` | All foundation, inventory, token, logical CSS, UI governance, layer, density, contrast, platform accent and type gates pass. |
| `PASS` | `design-system` | Node 22.23.3 `pnpm build` | Gates pass; generated package inventory contains 116 components. No new token violations (155 baseline). |
| `PASS` | `design-system` | Node 22.23.3 `pnpm --dir storybook run build-storybook` | Production Storybook build passes (2326 modules; upstream Storybook `eval` warnings). |
| `PASS` | live Storybook browser | AppShell generator used with Input gallery, 1280×800, 3 themes × 4 densities | 12/12 globals applied; five 312px fields at expected 24/28/32/40px height; no horizontal overflow or page errors. 12 captures saved. |
| `PASS — DISCOVERY ONLY` | `design-system/storybook` | `fnm exec --using 22.23.3 -- node C:\Users\kanna\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs exec playwright test tests/visual/visual-regression.spec.ts --list` | Test source parses and discovers 546 exported stories / 6,553 tests. Listing is not execution evidence. |
| `NOT RUN` | `design-system` | Full visual-regression snapshot suite | Not run: it spans 6,553 matrix tests and compares against repository snapshot baselines; the direct targeted browser matrix exercised the affected serializer and Input story. |
| `NOT RUN` | `design-system` | Full `pnpm test` suite | Focused Input tests pass; the full suite was not run on this exact revision. |
| `NOT RUN` | Business Suite | Published package typecheck and authenticated route journey | Outside this packet; no consumer integration is claimed. |

Knowledge delta: `UPDATED` for repeatable visual matrix verification; overall Strata and Business Suite readiness remains `REQUIRED-BUT-INCOMPLETE`.
