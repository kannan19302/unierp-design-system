# unierp-design-system

**Layer L1** of the UniERP layered repository architecture
(`PLATFORM_ARCHITECTURE.md` § 4.2). Publishes `@unerp/ui (subpath exports)`.

Depends on: nothing in the workspace.

## What lives here

Tokens → theme → components → charts → grid → forms → workflow. Consumed by three frontends and by partner extensions.

## The invariant

The design system has NO dependency on the API or the database. That is what makes "a UI component cannot import a service" structural rather than a lint rule (§ 4.3). It was collapsed from 13 packages into one with subpath exports (§ 7.2) before extraction, deliberately: extracting 14 packages would have created 42 version-coherence problems per release across three frontends.

**A repository may depend only on published artifacts of a strictly lower
layer. Never sideways within a layer. Never upward.** A cycle is not
discouraged here — it is unrepresentable, because the lower layer's package
cannot name the higher one.

## Extraction status

Extracted from the `ERPSys` monorepo as § 14 Phase 3.2.

**The monorepo copy is still authoritative.** Per § 14, consumers switch to the
published package only once that package is publishable, and the monorepo stays
buildable at each extraction tag until they do. Until a registry is available
this repository is the extraction target, not the source of truth.

Rollback is a one-line `pnpm` override pointing consumers back at the
workspace path.
