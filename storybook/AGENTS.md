<!-- UniERP-Agent-Protocol: 1.1.0 -->
# UniERP Repository Agent Entrypoint — Storybook Workshop (`@kannan19302/storybook`)

This repository is one delivery unit in the UniERP polyrepo. Before analysis, planning, review, or mutation, every
AI agent from every provider MUST read and follow:

1. the workspace entrypoint at [`../AGENTS.md`](../AGENTS.md);
2. the canonical standard at
   [`../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md`](../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md);
3. the owning platform documents selected through
   [`../unierp-platform/docs/PLATFORM_CATALOG.md`](../unierp-platform/docs/PLATFORM_CATALOG.md).

If the workspace entrypoint or canonical standard is unavailable, the protocol bundle is incomplete. The agent
MUST stop before mutation and report the missing dependency. This bootstrap adds no weaker or conflicting rules.
Repository-specific additions may be appended below only when they narrow implementation behavior without
redefining platform ownership, security, contracts, or cross-platform standards.

---

## Storybook Workshop Governance & Quality Standards

### 1. Unified Story Catalog
- Storybook indexes all CSF 3.0 stories directly from `../../design-system/src/**/*.stories.@(ts|tsx)`.
- All stories must adhere to Component Story Format (CSF 3.0) with standard meta declarations (`title`, `component`, `parameters.layout`).
- All JSX text within stories must be well-formed and valid for AST indexers (e.g. Acorn).

### 2. Addons & Quality Tooling
- `@storybook/addon-a11y`: Integrated for continuous interactive accessibility audits in the browser canvas.
- `@storybook/addon-essentials`: Provides controls, actions, docs, and viewport tools.

### 3. Build & CI Verification
- `pnpm build-storybook` must build cleanly with zero compilation errors and produce `storybook-static/`.
- Visual regressions and browser validation must ensure all components render without unhandled exceptions or missing styles.

