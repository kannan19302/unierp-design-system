---
name: design-system-standards
description: Authoritative standards, architectural boundaries, coding anatomy, and verification gates for design-system.
version: 1.0.0
author: UniERP Architecture Governance
---

# UniERP Strata Workbench Design System — AI Agent Guidance & Project Skill

This skill governs all code modification, analysis, and testing within `design-system` (**Layer L1: Foundation**). Every AI agent and software engineer working in this repository MUST follow these rules without exception.

---

## 🏛️ 1. Architectural Position & Boundary Rules

- **Repository**: `design-system`
- **Layer**: **L1 (Foundation)**
- **Package Identity**: `@kannan19302/ui`
- **Allowed Inbound Callers**: L4 (Presentation), L5 (Clients), L1 (Storybook)
- **Allowed Outbound Dependencies**: @kannan19302/contracts (L0)
- **STRICTLY FORBIDDEN DEPENDENCIES**:
  - ❌ Layers L2-L7
  - ❌ Database ORM
  - ❌ Server actions
  - ❌ Backend fetch orchestration

> **Unidirectional Rule**: You may ONLY import published artifacts from strictly lower layers. Sibling imports within the same layer are prohibited unless mediated through L0 contracts.

---

## 🎯 2. The Platform Goal & Repository Mandate

> **Platform North Star Goal**:  
> "Build the world's premier autonomous, multi-tenant Enterprise SaaS Operating System: 100% Zero-Trust Multi-Tenant Isolation, Absolute Decimal(19,4) Numeric Precision, Atomic Durable Audit Logging, Sub-100ms P99 Latency, and Strata Workbench High-Density UI."

### Repository Responsibility Mandate
Authoritative enterprise UI library, Strata Workbench design tokens, 4-tier density scale, and 5-file uniform component anatomy.

---

## 📐 3. Repository-Specific Coding Standards

### Mandatory 5-File Uniform Component Anatomy
Every component under `src/<category>/<component-name>/` MUST contain exactly 5 files:
1. `<name>.tsx`: Component logic, strict TypeScript interfaces.
2. `<name>.module.css`: Scoped styles referencing Strata tokens (NO hardcoded pixels/hex).
3. `<name>.stories.tsx`: Storybook CSF 3.0 story.
4. `<name>.test.tsx`: Vitest + `vitest-axe` test with zero accessibility violations.
5. `index.ts`: Encapsulated barrel re-export.

---

## 🛡️ 4. Mandatory Pre-Commit Verification Gate

Before submitting or reporting completion on any change in this repository, run and verify:

```bash
pnpm test && pnpm build
```

All tests must pass with 0 failures and 0 type errors.
