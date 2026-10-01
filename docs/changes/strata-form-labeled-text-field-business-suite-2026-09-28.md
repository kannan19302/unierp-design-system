# Strata labeled text field Business Suite alignment — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — coordinated public UI export and consumer migration`. Owners: PLT-DS for shared form presentation and package exports; PLT-ERP for Business Suite forms and route behavior. This contract covers one repeated typecheck family and does not authorize package publication, lockfile/version changes, deployment, release, or SCM mutation.

## Observed failure and ownership

Supported Node 22.23.3 Business Suite `pnpm typecheck` currently reports 656 diagnostics (331 TS2305, 325 TS2322). A fresh log contains 316 `Property 'label' does not exist` diagnostics. The existing public root `TextField` name is an alias of the unlabeled primitive Input in `src/inputs/text-field`; the design system separately implements a labeled form-level `TextField` in `src/inputs/form-control`, where it composes `FormField` and `Input` and associates a generated or supplied ID. The root barrel intentionally has an existing `TextField` meaning and must retain it.

The selected public boundary is the existing `@kannan19302/ui/forms` subpath. Export the existing labeled form component there under the explicit alias `LabeledTextField` and export its props type. The alias will generate the associated label/input relationship and preserve `required`, `hint`, `error`, input attributes and ref behavior. Business Suite will use it only for JSX text fields that pass `label` or `hint`; other primitive Inputs remain unchanged. No business rules or domain state move into L1.

## Acceptance criteria

1. **AC-01 — Additive public API:** `@kannan19302/ui/forms` exports `LabeledTextField` and `LabeledTextFieldProps`; the root `TextField` and `Input` declarations retain their current types and behavior.
2. **AC-02 — Consumer migration:** every current Business Suite `Input`/root `TextField` call site using `label` or `hint` uses the labeled form component, with existing values, validation and callbacks preserved; plain inputs remain primitive controls.
3. **AC-03 — Provider proof:** Node 22 provider typecheck, focused form tests, package build and generated declaration inspection pass; the Business Suite consumer typecheck imports the public forms subpath without a module error.
4. **AC-04 — Consumer proof:** Business Suite typecheck is rerun on Node 22 and the labeled-field diagnostics are zero; all remaining diagnostic families are reported separately. This packet does not claim full consumer readiness unless every other gate also passes.
5. **AC-05 — Knowledge and review:** update this contract, the existing consumer-alignment contract, affected traceability and the current iteration report. Review all edited files and scoped whitespace.

## Compatibility, impact and rollback

This is an additive named export under an existing public subpath. No root export is renamed and no package version or lockfile changes. UI behavior only adds the label association already implemented by the form-level component. No data, auth, tenant, API, contract, privacy, or persistence behavior changes. Rollback removes the alias and reverts only corresponding consumer migrations. Consumer migration is local-source integration evidence; published distribution remains unverified.

Knowledge delta: `UPDATED`. Designed: existing form-level component reused. Implemented, tested, integrated, deployed and released remain pending until evidence is recorded below.

## Iteration evidence

| Criterion | State | Evidence |
| --- | --- | --- |
| AC-01 | `PASS` | Node 22 package build and provider typecheck pass; `dist/forms/index.d.ts` exposes the additive alias and props type. The root primitive aliases were unchanged. |
| AC-02 | `PASS` | AST-scoped migration replaced 325 labeled/hinted controls in 61 Business Suite files. Remaining plain Input/TextField usages are unaffected. |
| AC-03 | `PASS` | Focused form-control suite passes 8/8; provider typecheck, lint and build pass; the consumer typecheck resolves `@kannan19302/ui/forms`. |
| AC-04 | `PASS` for this failure family | Fresh Business Suite check has zero TS2322 and zero label/hint prop diagnostics. It still fails with 331 TS2305 missing-export diagnostics. |
| AC-05 | `PASS` for this packet | Consumer-alignment docs and both platform traceability files were updated; scoped `git diff --check` passes. Full repository diff review remains required because the worktrees contain earlier independent changes. |

## Exact verification

| Check | Result |
| --- | --- |
| Design System `pnpm exec vitest run src/inputs/form-control/form-control.test.tsx` (Node 22.23.3) | PASS — 8/8 tests |
| Design System `pnpm typecheck` (Node 22.23.3) | PASS |
| Design System `pnpm lint` (Node 22.23.3) | PASS |
| Design System `pnpm build` (Node 22.23.3) | PASS — gates, TypeScript build and 116-component generated inventory |
| Design System `pnpm check:storybook` (Node 22.23.3) | PASS — 123 story files; 116 component stories |
| Generated `dist/forms/index.d.ts` inspection | PASS — `LabeledTextField` and `LabeledTextFieldProps` resolve from the public forms entry point |
| Business Suite `pnpm typecheck` (Node 22.23.3) | FAIL overall — 331 TS2305 missing exports remain; zero TS2322, label or hint prop diagnostics (reduced from 656 diagnostics before this migration) |
| Business Suite `pnpm lint` | NOT RUN — package script cannot find the `eslint` executable in the current install |
| Scoped Business Suite `git diff --check` | PASS — affected consumer files; Git reports an existing LF-to-CRLF normalization warning in one file |

Designed: existing accessible form composition. Implemented: public `/forms` alias, hint/error description IDs, and 325 consumer tag migrations. Tested: focused provider tests and provider gates pass. Integrated: local-source type resolution passes for the migrated fields; application integration remains partial because 331 missing exports remain. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full package/consumer readiness remains `REQUIRED-BUT-INCOMPLETE`.

This is not done. No publication, deployment, release, or source-control mutation occurred.
