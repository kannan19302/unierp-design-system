# Strata Business Suite consumer alignment contract — 2026-09-28

Status: `PARTIAL`. Risk: R2 coordinated shared-package and downstream-consumer alignment. Accountable platforms: PLT-DS (shared package) and PLT-ERP (Business Suite experience and migration). Contract owner: `@kannan19302/ui`. Repositories: `design-system`, `business-suite`, `platform`. No publication, lockfile/version mutation, deployment, release, production/staging mutation, or SCM mutation is authorized by this contract.

## 1. Request and business outcome

Prepare Business Suite to consume the supported Strata package across real tenant workflows, with public exports and component behavior that match the app's intended use. A typecheck alone is insufficient: the outcome requires verified package compatibility, route behavior, accessibility, and representative end-to-end business journeys.

**Scope for this packet:** classify current consumer failures, map owners and public alternatives, agree a dependency-ordered implementation sequence, and establish acceptance evidence. This packet does not itself authorize adding app-specific APIs to L1 or changing ERP navigation intent.

**Out of scope:** package publication or version/lockfile changes; product or API/data/auth changes; release/deployment; unreviewed broad replacement of Business Suite UI; changing accepted ADRs.

## 2. Authority and dependency map

- Workspace: `AGENTS.md`, AI Agent Development Protocol 1.1.0, AI Knowledge Lifecycle.
- PLT-DS: ADR-0009 (Strata), ADR-0012 (package layers), design-system requirements and traceability, and `platform/docs/platforms/design-system/STRATA_ELEVATION_PROTOCOL.md`.
- PLT-ERP: `platform/docs/platforms/tenant-apps/REQUIREMENTS.md`, `ANALYTICS_EXPERIENCE_ARCHITECTURE.md`, and Business Suite `AGENTS.md`.
- Current implementation package graph: Business Suite directly links `@kannan19302/ui` to `../design-system`; `@kannan19302/framework@0.1.4` separately brings transitive UI `1.0.15`. This proves the tested local-source graph only, not published-package compatibility.
- Dependency sequence: requirements/ownership decision → PLT-DS generic package exports and provider proof → PLT-ERP route migration → cross-repository compatibility and journey proof.

Requirements: `DS-FR-002`, `DS-FR-005`, `DS-FR-010`, `DS-NFR-009`, `ERP-FR-001` through `ERP-FR-008` as applicable to selected workflows, `ERP-NFR-001`, `ERP-NFR-005`, `ERP-NFR-006`, and `ERP-NFR-007`. The analytics experience authority explicitly retires `ModuleTabLayout` when it duplicates sidebar navigation; that restriction applies to its governed Analytics experience and must be checked before any wider adoption.

## 3. Current observed failure and ownership triage

Initial supported Node `v22.23.3` Business Suite `pnpm typecheck` observation failed with 746 diagnostics (335 TS2305, 325 TS2322, 83 TS2724, 3 TS2307). The latest check after two consumer import corrections and the public `StatusBadge` export failed with 656 diagnostics (331 TS2305, 325 TS2322); the prior missing-subpath diagnostics are cleared. `pnpm check:tokens` was previously observed failing on 161 hard-coded pixel-length violations in six app files. The app has unrelated user-owned modifications; preserve them.

| Failing symbol/shape | Initial ownership decision | Required resolution |
| --- | --- | --- |
| `StatusBadge` | Generic status presentation exists in `src/primitives/badge/status-badge.tsx`, but `src/primitives/badge/index.ts` does not export it | PLT-DS confirm the public API and add a focused public-export test before the additive root export |
| `StatCardItem`, `StatCardRow` | Generic composition is already publicly exported from root/`compositions`; failing app imports use `@kannan19302/ui/layout`, which resolves to templates | PLT-ERP correct the consumer import to a valid public root or `compositions` path; do not add these names to `layout` |
| `DashboardChart`, `DashboardKPICard` | These legacy names are absent from DS source. DS has chart-specific public components and KPI/stat-card compositions | PLT-ERP inspect every usage and select the matching generic chart or KPI; add a new generic contract only when existing APIs cannot express the use and PLT-DS accepts ownership |
| `SubTabBar`, `SubTab`, `SubTabBarProps`, `ModuleTab`, `ModuleTabLayout`, `ModuleTabLayoutProps` | Navigation composition; consumer already wraps/aliases several names. Not automatically DS-owned. Analytics has explicit prohibition on tabs duplicating sidebar navigation | PLT-ERP classify each use as local in-page view state or redundant module navigation; migrate/retire at consumer level where required |
| `ChangeHistory`, `TransactionWorkspace`, `DrillDownModal`, `DemoBanner`, `TabbedConsole`, `TransactionSummaryItem`, `TrialCountdown` | Appears app/domain or workflow specific; absent DS source definitions | Keep in Business Suite unless ownership and generic reusable behavior are demonstrated; do not add app-specific L1 shims |
| `@kannan19302/ui/platforms/business-suite` | Current export/source is absent. The workspace L1 rule disallows app-specific authority, while `design-system/docs/platforms/PLATFORM_UI_SPECIFICATION.md` explicitly assigns pure Business Suite visual components, including `StrataAppGrid`, to the shared package. | Bounded resolution in [the shell-components contract](strata-business-suite-shell-components-2026-09-28.md): provide only reusable presentation and callback contracts; keep app catalog, route policy, shortcut definitions, permissions and tab state/actions in Business Suite. Do not add application data/authority to L1. |
| Input prop mismatches (`label`, `hint`) and remaining TS2322/TS2724 | Consumer/public-contract drift; repetitive diagnostics do not establish desired API | Inspect component usage in context, correct semantic labels/hints and value types using public `FormField`/`Input` contracts; avoid weakening types to silence errors |

### Labeled text field follow-up — 2026-09-28

The pre-migration supported-runtime typecheck had 316 repeated `label` prop diagnostics. Source inspection found the required labeled behavior already implemented by the form-level `TextField` in `src/inputs/form-control`; the root `TextField` continues to alias the lower-level primitive and must not be changed. The bounded provider/consumer contract is [Strata labeled text field alignment](strata-form-labeled-text-field-business-suite-2026-09-28.md). It exposes the existing composite as `LabeledTextField` only from `@kannan19302/ui/forms`, then migrates labeled/hinted form usages in Business Suite.

The completed local migration covers 325 controls in 61 files. Provider tests pass 8/8 and the Node 22 Design System typecheck/lint/build/Storybook gates pass. A fresh Business Suite typecheck now reports only 331 TS2305 missing-export diagnostics; all 325 TS2322 prop errors and all `label`/`hint` prop diagnostics are cleared. Business Suite lint could not execute because the `eslint` binary is absent. The overall consumer-alignment ACs remain open: missing generic/app-owned exports, the 161-pixel token gate, route journeys and package distribution compatibility remain unresolved.

The package export map and generated declarations confirm root/`compositions` stat-card exports and `layout` resolving to templates. The rows above are still triage, not a final API decision. Before provider implementation, inspect every usage shape and relevant route requirement; update this contract with exact per-symbol resolutions. Avoid treating wrong consumer subpaths as missing provider APIs.

### Analytics tab navigation resolution — 2026-09-28

The Analytics authority in `platform/docs/platforms/tenant-apps/ANALYTICS_EXPERIENCE_ARCHITECTURE.md` assigns global route navigation to the Analytics sidebar and explicitly retires duplicate `ModuleTabLayout` strips. A repository-wide source search found no consumer of `AnalyticsTabLayout` or `ANALYTICS_TABS`; this stale file is a redundant route registry and will be removed. `AnalyticsCockpitClient`'s four dashboard views are distinct page-local modes selected by `?subtab=`, so they remain and will use the public `Tabs` primitive from `@kannan19302/ui/navigation`, controlled by the existing query parameter. No provider API change is required.

- **AC-07 — Analytics navigation ownership:** remove the unused duplicate route registry; prove zero remaining source references to `AnalyticsTabLayout` and `ANALYTICS_TABS`. State: `IN PROGRESS`.
- **AC-08 — Dashboard view toggle:** preserve the four dashboard view IDs and URL state while using Strata `Tabs` with an accessible name and query updates. State: `IN PROGRESS`.
- **AC-09 — Diagnostic closure:** fresh Business Suite typecheck has no TS2305 diagnostics from the retired Analytics registry or dashboard view toggle; report the remaining diagnostic families separately. State: `NOT VERIFIED`.

Rollback is limited to restoring the unused Analytics registry or its consumer-level tab wrapper. Existing navigation ownership and data behavior remain unchanged.

## 4. Numbered acceptance criteria

- **AC-01 — Ownership map:** each diagnostic family and the three current shell imports resolve according to the PLT-DS pure-presentation / PLT-ERP data-and-authority boundary, with usage inventory and no unresolved layer violation. State: `NOT VERIFIED`.
- **AC-02 — Provider contract:** all generic APIs required by the approved map are present in the package's public source and generated declarations, with backward-compatible typed props and focused component tests. State: `NOT VERIFIED`.
- **AC-03 — Provider proof:** Node 22 `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, token/contrast/density/logical-property checks and Storybook checks/build pass; inventory confirms expected targets. State: `PARTIAL` (current provider gates pass; approved API delta and end-to-end benchmark are incomplete).
- **AC-04 — Consumer migration:** Business Suite imports only public generic UI contracts; app-specific behavior remains PLT-ERP-owned; zero TypeScript diagnostics and zero token-gate violations. State: `NOT VERIFIED`.
- **AC-05 — Journey/accessibility proof:** selected finance, order-to-cash, procure-to-pay, inventory, and applicable reporting routes work with live tenant-scoped data and required loading/empty/error/forbidden/offline/conflict states; keyboard and WCAG 2.2 AA, screen reader, zoom/reflow, localization and responsive evidence is recorded. State: `NOT VERIFIED`.
- **AC-06 — Cross-root evidence:** PLT-DS and PLT-ERP traceability point to the same verified package revision and consumer evidence; changed and pre-existing files are distinguished. State: `NOT VERIFIED`.

## 5. Impact, invariants, rollout and rollback

- Trust, tenant, persistence, API/event, auth, data lifecycle and privacy impact: none intended; validate that all consumer mutations remain server-authorized and tenant-scoped during route proof.
- UI impact: shared presentation API and L4 adoption; preserve Strata tokens, WCAG 2.2 AA, localization, responsive behavior, and loading/error/recovery states.
- Compatibility: additive package exports only if PLT-DS confirms generic ownership. No incompatible prop changes or lockfile/package version updates in this packet.
- Rollout: local linked-source validation only until a separately authorized, immutable published artifact path is available. Do not claim release compatibility from a local link.
- Rollback: revert only the isolated provider export/component and consumer migration packet; keep unrelated working-tree content. No data rollback is required.
- No feature flag, data migration, deployment, release, external communication, or SCM mutation is part of this authorization.

## 6. Verification plan

| Claim | Proof boundary | Check | Expected |
| --- | --- | --- | --- |
| Provider public package | `design-system` | Node 22 `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm check:storybook`, Storybook build | Pass; nonzero expected targets |
| Export/declaration integrity | built `dist` and package export map | inspect generated `.d.ts`; compile a small consumer fixture using declared public subpaths | Every approved name resolves without private imports |
| Consumer correctness | `business-suite` | Node 22 `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm check:tokens` | Pass, no skipped required gates |
| Journey behavior | Business Suite browser E2E | focused Playwright journeys for finance, O2C, P2P, inventory, reporting | Pass with seeded tenant fixtures and required error/accessibility states |
| Layer and contracts | workspace/platform | `node ../platform/workspace/scripts/check-layer.mjs` from Business Suite; traceability and contract review | No L1-to-L4 coupling or unresolved owner mapping |

Adversarial proof includes no-context/unauthorized views for protected journeys, tenant A/B fixture isolation at the UI/API boundary, empty/error/offline behavior, keyboard operation, screen-reader name/order, 200% zoom/reflow, RTL/localization where applicable, and retry-safe user actions. Provider-only evidence does not satisfy consumer integration.

## 7. Iteration evidence and knowledge delta

Designed: this triage and packet only. Implemented: no consumer or compatibility API migration in this packet. Tested: provider package gates passed in the prior supported-runtime run; Business Suite typecheck and token check failed with the counts above. Integrated: no. Deployed: no. Released: no.

Knowledge delta: `UPDATED` — this contract records the exact local/transitive package graph, observed consumer failure families, ownership hypotheses, dependency sequence, and acceptance proof. Those hypotheses must be confirmed before code changes. Residual risk: published package and lockfile compatibility remain unverified. **This is not done.**

## 8. Cross-consumer Framework/UI dependency recheck — 2026-09-28

Read-only `pnpm why @kannan19302/ui` checks and manifest/lockfile inspection confirm the Framework/UI edge affects multiple consuming roots. This inventory is package-graph evidence only; it does not prove runtime singleton identity, published compatibility, or an approved migration.

| Consumer | Direct UI source | Framework source | Observed graph consequence |
| --- | --- | --- | --- |
| `business-suite` | `file:../design-system` | registry `@kannan19302/framework@0.1.4` | Local UI link and Framework's registry UI `1.0.15` are both resolved. |
| `tenant-admin` | `file:../design-system` | registry `@kannan19302/framework@0.1.4` | Local UI link and Framework's registry UI `1.0.15` are both resolved. |
| `provider-admin` | `file:../design-system` | registry `@kannan19302/framework@0.1.4` | Local UI link and Framework's registry UI `1.0.15` are both resolved. |
| `developer-platform` | registry range `^1.0.15` | registry `@kannan19302/framework@0.1.4` | Both dependency paths resolve UI `1.0.15`; physical deduplication/runtime identity is not established by `pnpm why`. |
| `developer-platform/marketplace` | `file:../../design-system` | `file:../../shared/framework` | Manifest edges point to local packages; `pnpm why` returned no graph detail, so effective nested resolution remains unverified. |
| `marketing-site` | registry range `^1.0.15` | none | Direct published UI dependency only. |
| `design-system/storybook` | registry pin `1.0.15` | none | Direct published UI dependency only; Storybook is an L4 consumer of the package. |
| `tenant-admin`, `provider-admin`, `business-suite` | local UI links as above | Framework imports UI runtime components from its package source | Existing registry Framework code expects UI APIs from 1.0.15; compiling it against the linked 1.1.0 provider is not yet proven. |

The package owner of `@kannan19302/framework` is PLT-OPS (`shared/framework`); PLT-DS owns `@kannan19302/ui`; each L4 app owns its consumer migrations and journey evidence. The Framework source currently declares UI under `dependencies`, and imports UI components in permissions and view modules. Replacing that edge with a peer dependency would alter the Framework package contract and require a coordinated, versioned Framework change plus consumer compatibility proof; it is not an app-only cleanup. No package manifest, lockfile, version, publication, or app source changed in this recheck.

**Required next dependency decision:** PLT-OPS and PLT-DS must choose and document the supported Framework/UI distribution contract (including compatible version ranges, local development graph, published artifact provenance, and rollback). Then PLT-DS verifies provider APIs/declarations; each L4 owner migrates against that exact package revision. The Business Suite local link currently fails typecheck, so it remains unsafe to infer the required public API solely from its diagnostics. This packet does not authorize publishing or changing package versions.

Designed: dependency-owner and consumer map. Implemented: evidence documentation only. Tested: read-only dependency resolution queries; no behavior or runtime singleton test. Integrated: none. Deployed: no. Released/published: no.

Knowledge delta: `UPDATED` — the Framework dependency owner and seven UI consumer package paths are now explicit. No governing dependency contract changed. **This is not done.**

## Shell subpath ownership correction — 2026-09-28

The earlier triage label “invalid L1 app-specific subpath” was too broad. The workspace L1 invariant forbids business orchestration, persistence and app-specific authority; it does not by itself forbid platform-specific pure presentation. The owning `PLATFORM_UI_SPECIFICATION.md` explicitly assigns `StrataAppGrid` to the Design System's Business Suite platform package. The specific missing exports are tracked in the [shell-components contract](strata-business-suite-shell-components-2026-09-28.md): shared package owns the presentation; Business Suite retains catalog data, navigation, shortcut definitions, tab state and effects. This correction does not approve a `DEFAULT_STRATA_APPS` constant or any entitlement/route logic in L1.

## Follow-up implementation and current verification — 2026-09-28

- PLT-DS implemented the three pure-presentation shell components in `@kannan19302/ui/platforms/business-suite`: `StrataAppGrid`, `KeyboardShortcutsHelp`, and `TabContextMenu`. The app catalog remains in Business Suite; shortcut definitions and tab state/actions remain consumer-owned. Public barrel and package export are additive.
- Node 22.23.3 provider evidence: focused shell tests pass 6/6; StatusBadge public-export tests pass 7/7; provider typecheck and package build pass. Build inventory reports 116 components and confirms the provider governance gates. Browser side-by-side reference evidence for the new shell components remains outstanding.
- Business Suite `StrataAppGrid` now imports the shared presentation component; its six existing app entries moved into an app-owned default catalog. `apps/page.tsx` consumes that same app-owned catalog. The two Finance `StatCardRow` consumer imports now use the existing public `@kannan19302/ui/compositions` entry instead of the unrelated `layout` entry.
- Latest supported-runtime Business Suite `pnpm typecheck` failed with 656 diagnostics: 331 TS2305 and 325 TS2322. Remaining missing exports include `SubTabBar`/`SubTab`, `ModuleTabLayout`/`ModuleTab`, `DashboardChart`, `ChangeHistory`, and workflow/domain symbols. They remain owner-triage items; do not create aliases wholesale. The analytics authority's ban on duplicate sidebar navigation applies to its governed experience; the `AnalyticsTabLayout` wrapper carries twelve module destinations and therefore requires a consumer redesign/retirement decision before any shared layout substitution.
- The consumer production build, token gate, lint, complete tests and route journeys have not passed. A prior Node 22 build compiled webpack but then stopped at the missing `StatusBadge` root export; after that additive provider export, full Next build has not been rerun because typecheck still reports 656 errors.

Designed: presentation/consumer boundary and additive APIs. Implemented: provider components/public exports and bounded Business Suite migrations. Tested: Node 22 focused provider suites, provider typecheck/build, and consumer typecheck (failed as above). Integrated: partial local linked-source integration only. Deployed: no. Released: no. Knowledge delta: `UPDATED`; end-to-end readiness remains `REQUIRED-BUT-INCOMPLETE`. **This is not done.**
