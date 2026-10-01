# Strata shell validation correction — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — shared presentation tooling and consumer readiness`. Accountable platform: PLT-DS; Business Suite journey owner: PLT-ERP. Public package owner: `@kannan19302/ui`; validation consumer: Storybook. No package API, app behavior, dependency, data, security, publication, deployment, or release change is in scope.

## Objective and numbered acceptance criteria

Correct the consolidated shell browser validator so its expected Storybook coverage matches the explicit current shell inventory and remains fail-closed.

1. **AC-01 — Required target inventory:** the full run requires the nine inspected shell groups (`app-shell`, `catalog-shell`, `dashboard-shell`, `data-shell`, `editor-shell`, `manifest`, `record-shell`, `settings-shell`, `strata-bar`) and one `--default` story for each.
2. **AC-02 — Target failure behavior:** missing required groups/defaults, unknown requested group, and unexpected discovered groups fail before browsers launch; zero stories remains a failure.
3. **AC-03 — Full consolidated proof:** fresh Storybook build plus validator full matrix passes with nonzero expected targets, axe samples, responsive/theme/density checks, and screenshots as configured.
4. **AC-04 — Consumer readiness remains accurately separated:** Business Suite typecheck and relevant token gate are rerun or their current exact results retained; no consumer integration or package distribution claim is made without evidence.
5. **AC-05 — Knowledge and diff:** Design Platform traceability and dated evidence record this correction, statuses, exact command outcomes, and remaining consumer gaps.

## Authorities and compatibility

Inspected: workspace entrypoint, `design-system/AGENTS.md`, AI Agent Development Protocol, AI Knowledge Lifecycle, PLT-DS Requirements and Traceability, frozen `STRATA_ELEVATION_PROTOCOL.md`, `SHELL_ELEVATION_CHANGE_CONTRACT.md`, existing 2026-09-28 evidence, manifests, current git diffs, and freshly built Storybook index. ADR-0009 and ADR-0012 remain controlling for shared UI ownership and product composition. Business Suite remains an L4 consumer; no app files or package version/lockfiles are changed in this packet.

The current index discovers exactly the nine required group names above. Each is independently required; discovery is not accepted as its own expected inventory. The requested `--shell` option is constrained to this allowlist. Missing defaults and unexpected groups fail closed. Rollback is a one-file script revert; there is no data or deployment rollback.

Knowledge delta: `UPDATED`; traceability and the dated iteration record must be refreshed. Tenant/IAM/data/API/privacy impact: none assessed for this test-tool correction. UX/accessibility scope: validator proof only, not consumer adoption proof. User's current goal instruction authorizes the consolidated validation phase previously deferred by the shell contract. Package publication, release, and source-control mutations remain separately governed and are not performed here.

## Verification plan

- `pnpm check:storybook`
- `pnpm --dir storybook build-storybook`
- Full shell browser matrix against the fresh static build, in an isolated temporary local evidence directory
- Package `pnpm typecheck`, `pnpm test`, and `pnpm build` if changed source/test failure requires them; consumer `pnpm typecheck` and `pnpm check:tokens` to ground readiness

No production-shaped data or real user records are used.

## Iteration evidence

Status: `PARTIAL`. This is not done.

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 | PASS | Fresh index: nine expected groups, 47 shell stories; validator requires all nine canonical default stories. |
| AC-02 | PASS | Explicit allowlist and missing/unexpected/default checks are in place; zero-story guard remains. `node --check` passed. |
| AC-03 | FAIL | 371 scenarios, 92 axe scans, 63 screenshots; 55 failures across Data, Editorial, Manifest and Record groups (36 overflow entries, 22 contrast-involving entries, 4 target-size-involving entries; categories overlap). |
| AC-04 | PARTIAL | Current package run did not rerun Business Suite checks. Same-day prior evidence records Business Suite typecheck FAIL on package `1.0.15` API mismatch and token check PASS; no adoption claim. |
| AC-05 | PASS | This contract, dated readiness evidence, and PLT-DS traceability were updated with exact status and local report path. |

### Exact checks

- `node --check storybook/tests/shell/validate-shells.mjs` — PASS (Node 24.14.0; syntax only).
- `pnpm check:storybook` — PASS: 120 source stories parsed; 113 component story files checked. Runtime emitted unsupported-engine warning (requires Node >=22 <23; actual 24.14.0).
- `pnpm --dir storybook build-storybook` — PASS: static build generated from current working tree, with same unsupported-engine warning.
- `node storybook/tests/shell/validate-shells.mjs` — FAIL: 371 scenarios / 55 failures; current evidence at `test-results/strata-shell-consolidated-2026-09-28/matrix.json` (ignored local output).
- Business Suite route, E2E, typecheck and token checks — NOT RUN in this packet. Prior same-day evidence remains scoped to the earlier checkout and reported typecheck FAIL / token PASS.
- Package full typecheck/test/lint/build — NOT RUN in this packet; current runtime is unsupported and prior same-day Node 22 evidence belongs to the preceding component iteration.

Designed: required group inventory and fail-closed check. Implemented: validator correction. Tested: syntax, story standards, unsupported-runtime Storybook build, consolidated browser matrix (failed as reported). Integrated: Storybook discovery only; Business Suite remains incompatible/unverified. Deployed: no. Released/published: no.

Security, auth, tenant, data, API and privacy impact: none. Consumer compatibility: unchanged; unresolved package `1.0.15` vs working source `1.1.0`. Rollback: revert only the validator inventory assertion; no data migration, feature flag or deployment. Required next actions: fix the shell/example mobile overflow, demo contrast and target size in separately scoped upstream-owned work; rerun complete package and browser proof under Node 22; then resolve exact package compatibility and validate representative Business Suite journeys before any release decision.
