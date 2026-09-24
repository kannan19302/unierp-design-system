    <!-- UniERP-Agent-Protocol: 1.1.0 -->
    # design-system agent rules

    This is the only repository agent instruction file. Read [the workspace entrypoint](../AGENTS.md),
    the [canonical protocol](../platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md),
    the enterprise brain, applicable accepted ADRs and the owning platform requirements before
    material work. Follow authority precedence; this file narrows implementation behavior only.
    If a required authority is missing, stop before mutation.

    **Layer:** L1 UI; Storybook L4. **Accountable platform:** PLT-DS. **Scope:** Shared components, tokens and accessibility.
    Resolve actual dependencies, packages and scripts from current manifests and the platform catalog.
    Preserve unrelated changes. Define numbered acceptance criteria and a knowledge delta before editing.
    For coordinated changes, publish the change contract, validate upstream first, and hand off
    to downstream consumers with exact evidence.

    ## Repository rules

    - Keep @kannan19302/ui free of business data fetching, persistence and application authority. Storybook consumes UI, never the reverse.
- Use existing approved tokens and component anatomy. Add co-located component, style, story, test and export files where that convention applies.
- Verify keyboard, screen-reader semantics, contrast, zoom/reflow and all relevant interaction states. Publish and validate the package before consumer migration.

    ## Verification

    Run applicable commands from this repository, plus risk-specific contract, security, data,
    accessibility, integration, migration or release gates required by the canonical protocol:
    pnpm lint; pnpm check:inventory; pnpm typecheck; pnpm test; pnpm build; pnpm check:storybook

    A command's presence here is not proof that it ran. Report exact results, failures and NOT RUN
    reasons; review the diff; then follow the canonical status and source-control procedure.
