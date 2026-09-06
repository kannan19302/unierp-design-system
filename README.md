# UniERP Strata Workbench (`@kannan19302/ui`)

> **Accountable Platform:** PLT-DS — Design Platform  
> **Standard:** ADR-0009 (Strata Enterprise Design Language 2.0)  
> **Package:** `@kannan19302/ui`  
> **Version:** `1.1.0`

The official enterprise design system and UI component library powering the UniERP polyrepo ecosystem across web, desktop, and mobile surfaces.

---

## Architecture & Principles

`@kannan19302/ui` is an L1 foundational presentation package built on zero-runtime CSS Modules and Design Language (DL) 2.0 design tokens. It enforces strict architectural layering:

1. **Pure Presentation & UI Primitives:** Encapsulates design tokens, layout primitives, high-density data grids, form engines, workflow builders, and application shells. Contains zero database connections, server actions, or business domain orchestration.
2. **5-File Uniform Anatomy (165/165 Conformance):** Every UI component directory co-locates `.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, and `index.ts`.
3. **Zero-Debt Token Governance:** 100% token gate purity enforced by CI (`scripts/check-tokens.mjs`). Zero un-tokenized raw pixel lengths or hex codes outside token source declarations.
4. **WCAG 2.2 AA & AAA Compliance:** All shipped themes pass $\ge 4.5:1$ contrast (standard text) and $\ge 3.0:1$ (graphical elements), verified by automated CI gates.
5. **Universal Subpath Exports:** Distributed as 34 modular subpath exports for tree-shaking and zero bloat.

---

## Installation & Consumption

```bash
pnpm add @kannan19302/ui
```

### Global Styles & Tokens Setup

In your root layout or application entry point (e.g. Next.js `app/layout.tsx` or Vite `main.tsx`):

```tsx
import "@kannan19302/ui/tokens/index.css";
import "@kannan19302/ui/tokens/v2/index.css";
import "@kannan19302/ui/styles/fonts.css";
import "@kannan19302/ui/styles/globals.css";
```

### Importing Components

Import components directly from their dedicated subpath exports:

```tsx
import { Button, Badge, Avatar } from "@kannan19302/ui/primitives";
import { FormControl, Combobox, DatePicker } from "@kannan19302/ui/inputs";
import { Modal, Drawer, Popover } from "@kannan19302/ui/overlays";
import { Tabs, Sidenav, Breadcrumb } from "@kannan19302/ui/navigation";
import { Card, StatCard, DocumentAnnotator } from "@kannan19302/ui/data-display";
import { Table, VirtualizedTable, QueryBuilder } from "@kannan19302/ui/data-grid";
import { DataWorkspace, TransactionWorkspace, RecordShell } from "@kannan19302/ui/shell";
import { WorkflowGraph, ApprovalChain } from "@kannan19302/ui/workflow";
import { SchemaForm, FormWizard } from "@kannan19302/ui/form-engine";
```

---

## Design Language (DL) 2.0 Token Architecture

### 1. The 4-Tier Density Matrix

Controlled by the `data-density` attribute on the root or component container:

| Density Tier | Attribute | Canonical Row Height | Target Workloads |
| :--- | :--- | :--- | :--- |
| **Ultra-Compact** | `data-density="ultra-compact"` | `24px` | Financial ledgers, high-density telemetry, trading desks |
| **Compact** | `data-density="compact"` | `28px` | ERP records, logistics grids, transactional queues |
| **Standard** | `data-density="standard"` | `32px` | Enterprise management, administrative workflows (Default) |
| **Comfortable** | `data-density="comfortable"` | `40px` | Touch interfaces, mobile viewports, executive dashboards |

### 2. The 6 Semantic Themes

Controlled by the `data-theme` attribute:

| Theme Name | Description | Verified Contrast |
| :--- | :--- | :--- |
| `strata` | Flagship Enterprise Light | WCAG 2.2 AA ($\ge 4.5:1$) |
| `strata-dark` | Obsidian Tactical Dark | WCAG 2.2 AA ($\ge 4.5:1$) |
| `strata-high-contrast` | Maximum Accessibility Theme | WCAG 2.2 AAA ($\ge 21:1$) |
| `meridian` | Legacy Enterprise Light | WCAG 2.2 AA ($\ge 4.5:1$) |
| `meridian-dark` | Legacy Tactical Dark | WCAG 2.2 AA ($\ge 4.5:1$) |
| `high-contrast` | Legacy High Contrast | WCAG 2.2 AA ($\ge 7:1$) |

### 3. The 8 Platform Identity Accents

Controlled by the `data-platform` attribute:

| Platform Code | Application Surface | Accent Tone | Light AA | Dark AA |
| :--- | :--- | :--- | :--- | :--- |
| `apps` | Tenant Enterprise Applications | Emerald | 5.08:1 | 8.53:1 |
| `tenant-admin` | Tenant Administration Console | Royal Blue | 6.20:1 | 6.45:1 |
| `platform-admin` | UniERP Provider Admin OS | Deep Purple | 6.47:1 | 6.21:1 |
| `developer` | Developer Console & API Portal | Indigo | 6.58:1 | 6.03:1 |
| `ops` | Infrastructure & Operations OS | Rust / Amber | 4.79:1 | 7.25:1 |
| `marketing` | Corporate Marketing Site | Teal | 5.07:1 | 8.81:1 |
| `marketplace` | Extension & App Marketplace | Violet | 8.32:1 | 6.03:1 |
| `website` | UniERP Web Studio | Cobalt | 7.32:1 | 5.50:1 |

---

## Canonical Floorplans

Strata provides 7 formalized application floorplans engineered for enterprise workflows:

1. **`DataWorkspace`** (`@kannan19302/ui/shell`): High-density data grid layout with multi-stage filter bars, saved-view switchers, pagination, and bulk operation bars.
2. **`RecordWorkspace` / `RecordShell`** (`@kannan19302/ui/shell`): 2-pane / 3-pane record inspection layout with activity timeline, metadata sidebar, and contextual actions.
3. **`TransactionWorkspace`** (`@kannan19302/ui/shell`): Double-entry ledgers, reconciliation consoles, and audit trails with strict error demarcation.
4. **`OperationalWorkspace` / `OpsShell`** (`@kannan19302/ui/shell`): Tactical operations control center with real-time health scores, KPI cards, and progress HUDs.
5. **`PlanningWorkspace`** (`@kannan19302/ui/shell`): Resource allocation, Gantt scheduling, and timeline management.
6. **`SettingsWorkspace` / `SettingsShell`** (`@kannan19302/ui/shell`): Categorized configuration console with instant search and schema-driven settings forms.
7. **`StudioWorkspace` / `StudioShell`** (`@kannan19302/ui/studio`): Visual low-code canvas with component palette, tree view, and live property inspector.

---

## Verification & Quality Gates

The package is protected by fail-closed automated verification gates:

```bash
# Unified all-in-one repository health check (runs all gates below)
pnpm lint

# 1. Architectural conformance & 5-file uniform anatomy audit (165/165)
pnpm check:inventory

# 2. Permanent zero-debt token governance gate
pnpm check:tokens

# 3. WCAG 2.2 AA contrast gate across all 6 themes
pnpm check:contrast

# 4. Platform identity accent contrast gate (all 8 platforms)
pnpm check:platform-accents

# 5. 4-tier density scale verification (+ negative deviation proof)
pnpm check:density

# 6. Cross-platform mobile token generator and drift gate
pnpm check:mobile-tokens

# 7. Static TypeScript typing
pnpm typecheck

# 8. Full Vitest unit & vitest-axe a11y suite (177 test suites, 622 tests)
pnpm test

# 9. Production distribution build
pnpm build
```

---

## Storybook Workshop

An interactive Storybook workshop (`@kannan19302/storybook`) is co-located in `../storybook`:

```bash
# Start local Storybook workshop
pnpm --filter @kannan19302/storybook storybook

# Build production Storybook static distribution
pnpm --filter @kannan19302/storybook build-storybook
```

---

## License

UniERP Proprietary Enterprise License. All rights reserved.
