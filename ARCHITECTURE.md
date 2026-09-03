# Architecture Specification: UniERP Strata Workbench Design System (`design-system`)

- **Layer**: Layer L1 (Foundation)
- **Package Identity**: `@kannan19302/ui`
- **Owning ADR**: [ADR-0010: UniERP Master Platform Goal and Polyrepo Architecture Boundaries](../unierp-platform/docs/adr/ADR-0010-platform-north-star-and-polyrepo-boundaries.md)
- **Status**: Authoritative & Production-Active

---

## 1. Executive Summary & Purpose

Authoritative enterprise UI library, Strata Workbench design tokens, 4-tier density scale, and 5-file uniform component anatomy.

This repository is one delivery unit in the UniERP 31-repository polyrepo estate, anchored by the **UniERP Master Platform North Star Goal**:
> "Build the world's premier autonomous, multi-tenant Enterprise SaaS Operating System: delivering 100% Zero-Trust Multi-Tenant Isolation with PostgreSQL Row-Level Security on every tenant table, Absolute Decimal(19,4) Numeric Precision across all ledgers, Atomic Durable Audit Logging, Sub-100ms P99 Transaction Latency, and a Unified High-Density Strata Workbench Design Language across all 1,198 web routes, native mobile, and desktop clients."

---

## 2. System Context & Architectural Boundaries

```mermaid
graph TD
  Tokens["Design Language 2.0 Tokens<br/>(themes/strata.css, density.css)"] --> Primitives["UI Primitives<br/>(button, input, badge)"]
  Primitives --> Layout["Layout & Shell Components<br/>(StrataBar, TabbedConsole, SplitViewShell)"]
  Layout --> DataDisplay["Data Display Grids<br/>(data-grid, table, metrics-card)"]
  
  Tokens --> Storybook["Storybook Workshop (:4006)"]
  Layout --> Storybook
  
  Tokens -.-> FlutterTokens["tokens.g.dart (Mobile)"]
  Tokens -.-> DesktopTokens["tokens.g.css (Desktop)"]

  classDef main fill:#052e16,stroke:#22c55e,stroke-width:2px,color:#fff;
  classDef tok fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff;
  class Layout,DataDisplay,Primitives main;
  class Tokens,FlutterTokens,DesktopTokens,Storybook tok;
```

### Boundary Contract
- **Allowed Inbound Consumers**: L4 (Presentation), L5 (Clients), L1 (Storybook)
- **Allowed Outbound Dependencies**: @kannan19302/contracts (L0)
- **Strictly Forbidden Dependencies**:
  - ❌ Layers L2-L7
  - ❌ Database ORM
  - ❌ Server actions
  - ❌ Backend fetch orchestration

---

## 3. Technology Stack & Key Primitives

- **Core Runtime & Languages**: React 18/19, CSS Modules, Vitest, vitest-axe, TypeScript
- **Primary Interface**: `@kannan19302/ui`
- **Verification Harness**: `pnpm test && pnpm build`

---

## 4. Quality Engineering & Verification Gates

To maintain institutional reliability, this repository is governed by the following continuous quality gates:
1. **Type Safety Gate**: Zero TypeScript/type-checker errors under strict mode.
2. **Layer Boundary Gate**: Verified by `scripts/check-layer.mjs` in `unierp-workspace` to prevent illegal upward or sideways coupling.
3. **Automated Test Suite**: Must execute cleanly with 100% pass rate before branch integration.

---

## 5. Associated AI Skills & Governance Links

- **Project Skill**: [`.agents/skills/design-system-standards/SKILL.md`](.agents/skills/design-system-standards/SKILL.md)
- **Workspace Governance**: [`../unierp-workspace/governance/UNIERP_MASTER_PLATFORM_GOAL.md`](../unierp-workspace/governance/UNIERP_MASTER_PLATFORM_GOAL.md)
- **Canonical Protocol**: [`../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md`](../unierp-platform/docs/standards/AI_AGENT_DEVELOPMENT_PROTOCOL.md)
