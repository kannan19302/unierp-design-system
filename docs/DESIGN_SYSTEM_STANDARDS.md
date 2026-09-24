# UniERP Strata Design Language: The 10 Pillars of Enterprise Design System Excellence

> Repository implementation guidance. The [Design Platform specification](../../platform/docs/platforms/design-system/README.md)
> and accepted design ADRs own intended behavior. This file cannot redefine those
> authorities, prove accessibility, or set product-wide release status.

These component practices apply within `@kannan19302/ui` when they agree with the
owning specification and the current package implementation.

---

## The 10 Inviolable Pillars

1. **Foundations & Tokens**: W3C DTCG 3-tier hierarchy, WCAG 2.2 AA/AAA contrast across 6 themes, typography triad with `tabular-nums` for financials, text truncation with tooltip/title guarantees, 4-tier density scale, standardized z-index scale, dark mode surface elevation tinting.
2. **Component Architecture & API Ergonomics**: 5-file uniform anatomy (`.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, `index.ts`), universal `React.forwardRef`, polymorphic `asChild` composition via `@radix-ui/react-slot`, universal prop enums (`size`, `tone`), controlled/uncontrolled patterns, RSC/SSR safety, and idempotent `useId()` accessibility bindings.
3. **Inclusive Design & a11y**: W3C ARIA APG keyboard matrices, 2px accessible focus ring appearance, Windows High Contrast Mode (`@media (forced-colors: active)`) system colors, vestibular reduced motion collapse, color independence, and automated `vitest-axe` assertions.
4. **BiDi & Localization**: Inviolable CSS Logical Properties law (`margin-inline-start/end`), directional icon mirroring, LTR tabular numbers for enterprise accounting in RTL locales, and zero hardcoded English UI strings.
5. **The 5 Enterprise States (Zero Dead-Ends)**: Explicit implementation and storybook documentation for *Default*, *Loading/Skeleton (CLS < 0.05)*, *Actionable Empty*, *Diagnostic Error (INC-...)*, and *Unauthorized/403 (FLS)*.
6. **Component Lifecycle & Governance**: Formal 4-tier lifecycle (`Experimental` $\rightarrow$ `Beta` $\rightarrow$ `Stable` $\rightarrow$ `Deprecated`), minimum 1-major deprecation grace periods, dev-mode console warnings, and SemVer breaking change rules.
7. **Packaging, Performance & Hygiene**: Mandatory `"sideEffects": ["*.css", "**/*.css"]`, granular subpath exports, component gzip budgets (< 5KB primitives, < 35KB grids), heavy dependency isolation (`@kannan19302/ui/charts`), and Core Web Vitals protections.
8. **Storybook Workshop Standards**: CSF 3.0, Autodocs, Anatomy & Composition story, AllStatesGallery matrix, interactive simulation playgrounds, and pre-commit AST compilation gate.
9. **Automated CI Gate Fleet**: 10 automated CI scripts enforcing token purity, theme contrast, density constraints, logical properties, story compilation, cross-platform tokens, TypeScript typechecking, and axe-core a11y.
10. **Downstream Consuming Polyrepo Application Contract**: Single-source `ContextBar` breadcrumbs, zero-mock production telemetry mandate, and downstream token purity enforcement.

## V1 component elevation: golden reference

The approved [SideNav V1 Storybook reference](../src/core/navigation/sidenav/sidenav.stories.tsx) is the quality and review benchmark for V1 component upgrades. It demonstrates restrained Strata styling, coherent anatomy, meaningful interactive states, accessible controls, deliberate Storybook variants, and user review before broad rollout. Its navigation-specific layout and customization features are examples of appropriate product behavior, not requirements to copy into unrelated controls. V1 remains the release designation until the official V1 release.

The [Strata visual foundations](foundations/STRATA_DL3_FOUNDATIONS.md) own the Nova, neutral, Inter, Lucide, solid-surface and radius decisions. Implement their semantic tokens; do not duplicate raw values from a screenshot or import an external component skin.

For each component family, apply this repeatable standard:

1. **Inventory and preserve contracts.** Identify every registered component, its five-file anatomy, public props, consumers, stories, tests and existing working-tree changes. Record duplicate or obsolete stories before removing them. Keep published APIs additive within a major; a breaking change follows the owning approval and migration policy.
2. **Design the family, then the component.** Define shared typography, spacing, borders, radii, icon sizes and state treatment from approved tokens. Keep each control's native semantics and task-specific interaction. Prefer clean hierarchy and quiet surfaces over decoration.
3. **Complete the interaction.** Implement controlled and uncontrolled behavior where supported, keyboard and pointer operation, visible focus, labels/help/error associations, disabled/readonly behavior, and relevant loading, empty, invalid and recovery states. Persist user preferences only where the component's product role calls for them.
4. **Show a reviewable V1 Storybook sample.** Provide the primary interactive story, meaningful variants and a current `StateMatrix` or `AllStatesGallery`. Show real interactions and responsive behavior with synthetic data. Replace superseded legacy stories after checking incoming story-ID references; retain Autodocs and required state coverage.
5. **Verify at the risk boundary.** Run repository token, logical-property, density, contrast, typecheck, lint, focused behavior/a11y tests, full tests, package build and Storybook build as applicable. Inspect keyboard operation and the Storybook accessibility panel; record any incomplete checks without calling them passes. Review the final diff and affected consumer compatibility before handoff.
6. **Elevate in slices.** Pilot one representative component, collect visual review, then upgrade the remaining family in dependency order. Do not claim family completion from a single polished sample or an automated pass alone.

The reusable execution prompt for the current inputs family is [Core Inputs V1 elevation prompt](CORE_INPUTS_V1_ELEVATION_PROMPT.md). This standard is the durable quality target; the prompt is an implementation aid subordinate to platform requirements and the current human request.
