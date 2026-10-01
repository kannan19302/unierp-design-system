# Strata Business Suite shell components — R2 change contract — 2026-09-28

Status: `PARTIAL`. Risk: `R2 — shared UI package and L4 consumer integration`. Owners: PLT-DS (presentation components/public package), PLT-ERP (app catalog data, shortcut definitions, tab state/actions and routes). Repositories: `design-system`, `business-suite`, `platform`. This packet addresses the three missing shell imports that prevent the Business Suite Next build; it does not complete overall Strata or Business Suite readiness. **This is not done.**

## Human outcome

Allow the Business Suite shell to render its application grid, keyboard shortcut help, and tab context menu through supported Strata package exports while keeping routes, app visibility, shortcut definitions, tab state, and business actions owned by PLT-ERP.

## Authority and conflict resolution

- Workspace `AGENTS.md`, ADR-0009, ADR-0012, design-system `REQUIREMENTS.md`, `ARCHITECTURE.md`, `CONTRACTS.md`, `EXPERIENCE.md`, and the Strata Elevation Protocol apply.
- `design-system/docs/platforms/PLATFORM_UI_SPECIFICATION.md` assigns shared visual components to Design System and explicitly lists `StrataAppGrid` under the Business Suite platform package. The workspace L1 rule prohibits business orchestration, persistence, and app-specific authority; it does not prohibit pure reusable presentation.
- Therefore this packet permits only pure presentation in the additive `@kannan19302/ui/platforms/business-suite` subpath. It MUST NOT export Business Suite route catalogs/default apps, infer entitlements, fetch data, or implement tab/finance behavior. Business Suite owns those values and passes typed data/callbacks.
- The existing consumer-alignment packet's statement that every platform-specific UI subpath is invalid is superseded only for these UI-only exports; its no-app-data/no-business-authority boundary remains binding. Any ownership conflict beyond that bounded decision returns to the platform owners.

## Current evidence and dependency graph

- Business Suite's `KeyboardShortcutsHelp.tsx`, `StrataAppGrid.tsx`, and `TabContextMenu.tsx` import `@kannan19302/ui/platforms/business-suite`.
- Current package `exports`, `src`, and `dist` do not provide that subpath. Business Suite's production build under Node 24.14.0 consequently fails at webpack module resolution; the app declares Node `>=22 <23`. The supported-runtime build remains unrun.
- The generic Design System already provides `Modal`, `AppLauncherWaffleGrid`, and `DropdownMenu`; new code must reuse them where their semantics fit and must not create redundant primitives.
- App tile data and `FINANCE_SHORTCUTS` are authored by Business Suite. Existing Finance `TabContextMenu` behavior is callback driven and app state remains consumer authoritative.
- Primary references for this bounded UI packet: [Salesforce App Launcher](https://help.salesforce.com/s/articleView?id=sf.basics_app_launcher_lex.htm&language=en_US&type=5), [Salesforce App Launcher access policy](https://help.salesforce.com/s/articleView?id=sf.identity_app_launcher.htm&language=en_US&type=5), [shadcn Context Menu](https://ui.shadcn.com/docs/components/base/context-menu), [shadcn Kbd](https://ui.shadcn.com/docs/components/base/kbd), and [Windows line-of-business navigation guidance](https://learn.microsoft.com/en-us/windows/apps/get-started/line-of-business/design-for-lob). Research was inspected on 2026-09-28; it is design input, not a copy target or accessibility certification.

## Acceptance criteria

| ID | Criterion | Initial state |
| --- | --- | --- |
| AC-01 | Provide typed, reusable, presentation-only Business Suite platform exports required by the three existing imports; preserve the five-file component anatomy and reuse existing generic primitives where appropriate. | `NOT VERIFIED` |
| AC-02 | Keep app catalog/default tiles, router/link policy, Finance shortcut definitions, tab state, permission checks, and all action effects in PLT-ERP. | `NOT VERIFIED` |
| AC-03 | Record matched Storybook/reference observations, interaction states, responsive behavior, themes/densities/direction as applicable, plus keyboard and accessibility proof for each new/changed UI surface. | `NOT VERIFIED` |
| AC-04 | Pass Design System gates on supported Node 22, including inventory/export checks, focused tests, typecheck, lint and production Storybook build. | `NOT VERIFIED` |
| AC-05 | Pass Business Suite focused component coverage and production build on supported Node 22; do not infer a user journey or release from module resolution alone. | `NOT VERIFIED` |
| AC-06 | Update PLT-DS and PLT-ERP traceability, ledger, package compatibility evidence, rollback notes and knowledge delta without losing unrelated dirty files. | `NOT VERIFIED` |

## Invariants and compatibility

- Additive current-major API only; no existing export, prop, token or theme meaning is removed.
- Package components render supplied data and emit supplied callbacks. They do not own a Business Suite catalog, route, user entitlement, persisted preference, or business mutation.
- No API, database, identity, permission, tenant, audit, persistence, contract-schema, dependency-version, lockfile, publish, deployment, or release change.
- Roll back only this packet's package source/export/story/tests, app adapters authored under this packet, and associated evidence. Preserve unrelated work.

## Verification plan

Run provider validation before consumer validation. Use the workspace's Node 22 runtime. Record exact commands, target counts, failure output, and any pre-existing diagnostics. Then build/serve the affected Storybook stories at matched online references and validate a real Business Suite route without using fallback credentials or changing business data. Authenticated E2E requires the repository's approved seeded fixture and must not use printed fallback credentials.

## Knowledge delta

`UPDATED` if implemented: public package architecture will document the supported platform subpath and the boundary that its component data/actions remain application owned. `REQUIRED-BUT-INCOMPLETE` until provider and consumer evidence pass. Deployment and release remain separate states and are outside this packet.

## Follow-up implementation evidence — 2026-09-28

| ID | Current state | Evidence / remaining gap |
| --- | --- | --- |
| AC-01 | `VERIFIED` for the three shell imports | Shared pure-presentation components, public barrels and additive package subpath are implemented. Provider build inventory discovers the resulting component set. |
| AC-02 | `VERIFIED` for the bounded packet | Business Suite retains the existing app catalog, link policy, shortcut definitions, and consumer-owned tab state/actions; shared props receive data and callbacks. |
| AC-03 | `NOT VERIFIED` | Online matched browser captures, interaction matrix, screen reader, responsive and accessibility evidence for the new shell surfaces remain open. |
| AC-04 | `PARTIAL` | On Node 22.23.3, focused shell tests pass 6/6, StatusBadge public-export tests pass 7/7, provider typecheck and package build pass. Provider lint/full tests and production Storybook verification remain outstanding for this packet. |
| AC-05 | `NOT VERIFIED` | Business Suite typecheck fails with 656 diagnostics (331 TS2305, 325 TS2322). The full supported-runtime Next build has not been rerun after the public StatusBadge export; no focused route journey is proven. |
| AC-06 | `PARTIAL` | PLT-DS traceability, benchmark report and consumer alignment contract updated. Consumer journey, browser reference, and package artifact compatibility are open. |

Designed: pure-presentation contracts. Implemented: three shared shell components and local consumer adaptation. Tested: focused provider suites, provider typecheck/build, consumer typecheck failure. Integrated: local linked source only. Deployed: no. Released: no. Knowledge delta: `UPDATED`, with consumer journey evidence `REQUIRED-BUT-INCOMPLETE`. **This is not done.**

The 2026-09-28 StrataAppGrid comparison follow-up adds provider gates: Node 22.23.3 package `build` and `lint` pass, production Storybook build passes, Storybook standards pass (123 files / 116 component stories), focused grid tests pass 2/2, and the token gate reports zero new violations. The production static story loads with the expected six named app links. AC-03 remains `NOT VERIFIED` for the full shell-reference and accessibility matrix; AC-04 remains `PARTIAL` pending the complete provider test suite; AC-05 and AC-06 remain incomplete for Business Suite routes and integration evidence.
