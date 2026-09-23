# UniERP Design System Architecture & Foundations (Strata DL 2.0)

## 1. Executive Summary
The UniERP Design System (`@kannan19302/ui`) is the authoritative design language and presentation engine for the UniERP enterprise SaaS platform. Governed by the **Strata Design Language (DL 2.0)**, the system is engineered for mission-critical, data-dense operations where tabular numerical alignment, keyboard navigation speed, information hierarchy, and zero cognitive fatigue are paramount.

## 2. Core Foundations
1. **Unified Token Hierarchy**:
   - **Colors**: Semantic variables (`var(--color-bg)`, `var(--color-text)`, `var(--color-primary)`, `var(--color-border)`).
   - **Typography**: Display (`Inter`), Sans (`Inter`), Mono (`IBM Plex Mono`).
   - **Numerical Precision**: Tabular numerals (`font-variant-numeric: tabular-nums lining-nums;`) on all monetary, quantity, ledger, and metric displays.
   - **Elevation**: 5-tier elevation system (`var(--shadow-xs)` to `var(--shadow-2xl)`).
   - **Motion**: Purposeful, spring-based easing curves (`var(--ease-spring)`, `var(--ease-default)`) with instant transitions for compact and expert density modes.
2. **4-Tier Ergonomic Density Matrix**:
   - **`ultra-compact` (24px row)**: High-density financial ledgers, trading matrices, and general journals (minimum text size 11px).
   - **`compact` (28px row)**: Operational triage queues, CRM lead boards, and inventory bin allocation.
   - **`standard` (32px row — default)**: Standard ERP forms, detail views, and records.
   - **`comfortable` (40px row)**: Touch-first POS registers, mobile tablets, and onboarding wizards (touch targets >= 44px).
3. **Themes & Platform Accents**:
   - 6 themes: `strata`, `strata-dark`, `strata-high-contrast`, `meridian`, `meridian-dark`, `high-contrast`.
   - 8 platform accents: `developer`, `apps`, `tenant-admin`, `platform-admin`, `ops`, `marketing`, `marketplace`, `website`.
   - All theme/accent pairs meet or exceed WCAG 2.2 AA (>= 4.5:1 text, >= 3:1 graphical elements).
