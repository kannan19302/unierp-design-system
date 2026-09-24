# @kannan19302/ui

This repository delivers the shared UniERP design-system package and Storybook.
It owns reusable components, tokens, interaction patterns and accessibility
behavior. It does not own Business Suite workflows or app authorization.

The [Design Platform suite](../platform/docs/platforms/design-system/README.md)
and accepted [design ADRs](../platform/docs/adr/README.md) own intended behavior.
The [platform catalog](../platform/docs/PLATFORM_CATALOG.md) assigns boundaries;
[AGENTS.md](AGENTS.md) contains this repository's coding and verification rules.
Repository `docs/` holds implementation notes, migrations and dated evidence.
A document there does not supersede a platform specification or accepted ADR.

## Work in this repository

Use the package exports declared in `package.json`. Extend existing components
and semantic tokens before creating another pattern. Keep the library free of
business data access and app-specific authority. For a shared change, verify
this package first, then migrate and validate its consuming applications.

Run the applicable package checks from this directory:

```powershell
pnpm lint
pnpm check:inventory
pnpm typecheck
pnpm test
pnpm build
pnpm check:storybook
```

These commands are verification steps, not a claim that any current build passed.
The owning evidence must name the exact version, consumers and accessibility
checks before describing a component or release as qualified.
