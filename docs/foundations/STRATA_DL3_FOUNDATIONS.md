# Strata Design Language 3.0 — Visual Foundations Specification

> **Status**: Authoritative | **Version**: 3.0.0 | **Effective**: 2026-09-23
>
> This document is the single source of truth for the Strata visual language.
> Every token, component, and consuming application must conform to these foundations.

---

## 1. Visual Philosophy

Strata is an **enterprise business-platform design language** engineered for mission-critical,
data-dense SaaS. The visual philosophy is:

| Principle | Description | Anti-pattern |
|---|---|---|
| **Quiet** | Neutral palettes, restrained color usage | Vibrant consumer-grade gradients |
| **Dense** | Maximize useful information per viewport | Excessive whitespace, large cards |
| **Precise** | Pixel-perfect alignment, tabular numerics | Sloppy alignment, inconsistent spacing |
| **Structured** | Clear hierarchy via borders/surfaces/type | Cards-inside-cards, arbitrary nesting |
| **Professional** | Business-appropriate, trustworthy, credible | Playful illustrations, decorative elements |
| **Premium** | Refined details, considered micro-interactions | Cheap-looking shadows, janky transitions |

### What Strata IS NOT
- A consumer SaaS dashboard theme
- A glassmorphism/neumorphism showcase
- A colorful, illustration-heavy design system
- A Tailwind utility-class dump
- A shadcn skin — shadcn is a reference implementation, Strata is the design language

---

## 2. Locked Visual Baseline

Derived from shadcn/ui Nova preset with enterprise extensions:

| Parameter | Value | Rationale |
|---|---|---|
| **Style** | Nova | Clean, modern, restrained geometric language |
| **Base Color** | Neutral (Zinc scale) | Professional, zero-personality bias |
| **Theme** | Neutral | No warm/cool skew |
| **Chart Color** | Neutral | Enterprise-appropriate data visualization |
| **Font** | Inter | Variable font, excellent tabular numerics |
| **Heading Font** | Inter | Consistent brand, reduce font loading |
| **Monospace Font** | IBM Plex Mono | Identifiers, code blocks, ledger figures |
| **Icon Library** | Lucide | Consistent 24px grid, 2px stroke default |
| **Radius** | Default (6px md, 4px sm) | Subtle rounding, never excessive |
| **Menu** | Default | Standard menu behavior |
| **Appearance** | Solid | Flat/solid surfaces, no glass or gradients |
| **Menu Accent** | Subtle | Restrained active-state highlighting |

---

## 3. Color System

### 3.1 Primitive Color Scales

All primitive colors use the Zinc neutral scale as the base, with semantic colors
mapped from Tailwind's carefully tuned palettes:

| Scale | Usage | Hue |
|---|---|---|
| **Zinc** | Neutral backgrounds, borders, text | 0° (true neutral) |
| **Blue** | Primary/brand, interactive elements | 217° |
| **Emerald** | Success states | 160° |
| **Amber** | Warning states | 38° |
| **Red** | Danger/destructive/error states | 0° |
| **Sky** | Information states | 199° |
| **Violet** | Platform accents (developer, marketplace) | 258° |

Each scale provides steps: 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

### 3.2 Semantic Color Roles

| Role | Light Value | Dark Value | Usage |
|---|---|---|---|
| **Background** | `zinc-50` (#fafafa) | `zinc-950` (#09090b) | App canvas |
| **Background Elevated** | `white` (#ffffff) | `zinc-900` (#18181b) | Cards, modals, elevated panels |
| **Background Sunken** | `zinc-100` (#f4f4f5) | `zinc-925` (#0c0e12) | Wells, table headers, filter bars |
| **Background Hover** | `zinc-100` (#f4f4f5) | `zinc-800` (#27272a) | Interactive row hover |
| **Background Active** | `zinc-200` (#e4e4e7) | `zinc-700` (#3f3f46) | Active/pressed state |
| **Background Overlay** | `black/50%` | `black/75%` | Modal backdrops |
| **Foreground** | `zinc-950` (#09090b) | `zinc-50` (#fafafa) | Primary text |
| **Foreground Secondary** | `zinc-600` (#52525b) | `zinc-400` (#a1a1aa) | Secondary text |
| **Foreground Tertiary** | `zinc-500` (#71717a) | `zinc-500` (#71717a) | Muted/tertiary text |
| **Foreground Inverse** | `white` (#ffffff) | `zinc-950` (#09090b) | Text on filled surfaces |
| **Foreground Link** | `blue-700` (#1d4ed8) | `sky-400` (#38bdf8) | Hyperlinks |
| **Border** | `zinc-200` (#e4e4e7) | `zinc-800` (#27272a) | Standard borders |
| **Border Strong** | `zinc-400` (#a1a1aa) | `zinc-600` (#52525b) | Input outlines, focus boundaries |
| **Border Focus** | `blue-600` (#2563eb) | `sky-400` (#38bdf8) | Keyboard focus rings |
| **Primary** | `blue-700` (#1d4ed8) | `sky-400` (#38bdf8) | Brand/CTA/interactive |
| **Primary Hover** | `blue-800` (#1e40af) | `sky-500` (#0ea5e9) | Primary hover |
| **Primary Foreground** | `white` (#ffffff) | `zinc-950` (#09090b) | Text on primary |
| **Success** | `emerald-700` (#15803d) | `emerald-400` (#4ade80) | Positive feedback |
| **Warning** | `amber-600` (#d97706) | `amber-400` (#fbbf24) | Caution signals |
| **Danger** | `red-700` (#b91c1c) | `red-400` (#f87171) | Errors, destructive |
| **Info** | `sky-700` (#0369a1) | `sky-400` (#60a5fa) | Informational |

### 3.3 State Colors (each status has 4 sub-tokens)

For each of `success`, `warning`, `danger`, `info`:
- `--color-{status}`: Main status color
- `--color-{status}-hover`: Darker/lighter on interaction
- `--color-{status}-light`: Tinted background (badges, alerts)
- `--color-{status}-text`: High-contrast text variant

---

## 4. Typography

### 4.1 Font Families

| Role | Family | CSS Variable |
|---|---|---|
| Display / Heading | Inter (SemiBold 600, Bold 700) | `--font-display` |
| Body / UI | Inter (Regular 400, Medium 500) | `--font-sans` |
| Monospace / Code | IBM Plex Mono | `--font-mono` |

### 4.2 Type Scale (Enterprise Hierarchy)

| Token | Size | Use Case |
|---|---|---|
| `--type-micro` | 11px / 0.6875rem | Timestamps, record IDs, metadata |
| `--type-caption` | 12px / 0.75rem | Table secondary data, captions |
| `--type-label` | 11px / 0.6875rem | Field labels (SemiBold, slight tracking) |
| `--type-dense` | 13px / 0.8125rem | Dense tables, compact controls |
| `--type-body` | 13px / 0.8125rem | Primary application UI |
| `--type-body-lg` | 14px / 0.875rem | Comfortable body, longer text |
| `--type-section` | 16px / 1rem | Section titles, group headers |
| `--type-workspace` | 18px / 1.125rem | Workspace/module titles |
| `--type-page` | 22px / 1.375rem | Page titles |
| `--type-display` | 28px / 1.75rem | Major KPI numbers |
| `--type-display-lg` | 32px / 2rem | Hero KPI, display numbers |

### 4.3 Font Weights

| Token | Value | Usage |
|---|---|---|
| `--weight-light` | 300 | Decorative display text only |
| `--weight-normal` | 400 | Body text, table data |
| `--weight-medium` | 500 | Interactive labels, buttons |
| `--weight-semibold` | 600 | Section headings, field labels |
| `--weight-bold` | 700 | Page titles, emphasis |

### 4.4 Line Heights (per scale step)

| Token | Value | Paired With |
|---|---|---|
| `--leading-micro` | 1.2 | micro (11px) |
| `--leading-caption` | 1.3 | caption (12px) |
| `--leading-dense` | 1.35 | dense (13px) |
| `--leading-body` | 1.45 | body (13-14px) |
| `--leading-section` | 1.35 | section (16px) |
| `--leading-workspace` | 1.3 | workspace (18px) |
| `--leading-page` | 1.25 | page (22px) |
| `--leading-display` | 1.15 | display (28-32px) |

### 4.5 Letter Spacing

| Token | Value | Rule |
|---|---|---|
| `--tracking-micro` | +0.02em | Loosen at smallest sizes |
| `--tracking-caption` | +0.01em | Slight loosening |
| `--tracking-body` | 0 | Neutral |
| `--tracking-section` | -0.005em | Begin tightening |
| `--tracking-workspace` | -0.01em | Tighter |
| `--tracking-page` | -0.015em | Tight |
| `--tracking-display` | -0.025em | Display reads as signage |

### 4.6 Tabular Numerics

All monetary values, quantities, percentages, dates, and aligned column data:
```css
font-variant-numeric: tabular-nums lining-nums;
font-feature-settings: "tnum" 1, "lnum" 1;
```

---

## 5. Spacing & Sizing

### 5.1 Spacing Scale (4px base grid)

| Token | Value | Pixels |
|---|---|---|
| `--space-0` | 0 | 0px |
| `--space-0-5` | 0.125rem | 2px |
| `--space-1` | 0.25rem | 4px |
| `--space-1-5` | 0.375rem | 6px |
| `--space-2` | 0.5rem | 8px |
| `--space-2-5` | 0.625rem | 10px |
| `--space-3` | 0.75rem | 12px |
| `--space-3-5` | 0.875rem | 14px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-7` | 1.75rem | 28px |
| `--space-8` | 2rem | 32px |
| `--space-9` | 2.25rem | 36px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

### 5.2 T-Shirt Aliases

| Token | Maps To | Pixels |
|---|---|---|
| `--space-xs` | `--space-1` | 4px |
| `--space-sm` | `--space-2` | 8px |
| `--space-md` | `--space-4` | 16px |
| `--space-lg` | `--space-6` | 24px |
| `--space-xl` | `--space-8` | 32px |

---

## 6. Border Radius

Nova-aligned, enterprise-restrained:

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | 0 | Sharp corners (tables, code blocks) |
| `--radius-xs` | 2px / 0.125rem | Tiny elements (badges inline) |
| `--radius-sm` | 4px / 0.25rem | Small controls, chips |
| `--radius` | 6px / 0.375rem | **Default component radius** |
| `--radius-md` | 6px / 0.375rem | Alias of default |
| `--radius-lg` | 8px / 0.5rem | Cards, dialogs |
| `--radius-xl` | 12px / 0.75rem | Large panels, modals |
| `--radius-2xl` | 16px / 1rem | Marketing surfaces only |
| `--radius-full` | 9999px | Circular elements (avatars, pills) |

---

## 7. Elevation & Shadows

Restrained elevation — prefer borders over shadows for structure:

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.04)` | Subtle lift |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)` | Buttons, inputs |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04)` | Dropdowns, popovers |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.04)` | Dialogs, modals |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.04)` | Command palette |
| `--elevation-1` through `--elevation-5` | Layered shadows | Surface depth scale |

### Surface Depth Hierarchy

| Level | Background | Border | Shadow | Usage |
|---|---|---|---|---|
| **Surface 0** | Canvas ground | None | None | App background |
| **Surface 1** | Elevated | Hairline border | None | Cards (flat) |
| **Surface 2** | Elevated | Hairline border | `elevation-1` | Raised cards |
| **Surface 3** | Elevated | Strong border | `shadow-lg` | Dialogs, modals |
| **Surface 4** | Overlay bg | None | None | Backdrop overlay |
| **Surface Sunken** | Sunken | Hairline border | None | Wells, headers |

---

## 8. Density Modes

Four orthogonal density tiers, applied via `[data-density]` on `<html>` or container:

| Mode | Row Height | Control Height | Body Text | Min Touch Target | Use Case |
|---|---|---|---|---|---|
| **Ultra-Compact** | 24px | 24px | 11px | 24px | Finance ledgers, trading matrices |
| **Compact** | 28px | 28px | 12px | 28px | Operations, CRM lists, inventory |
| **Standard** ★ | 32px | 32px | 13px | 32px | Default ERP experience |
| **Comfortable** | 40px | 40px | 14px | 44px | Touch/tablet, onboarding, POS |

★ = System default

---

## 9. Borders & Dividers

| Token | Value | Usage |
|---|---|---|
| `--border-width-thin` | 1px | Standard borders, hairlines |
| `--border-width-thick` | 2px | Focus rings, emphasis borders |
| `--border-width-accent` | 3px | Platform scope edges |
| `--separator-weight` | 1px | Standard dividers |
| `--separator-weight-heavy` | 2px | Section dividers |

---

## 10. Focus & Selection

| Token | Value | Usage |
|---|---|---|
| `--focus-ring-width` | 2px | Keyboard focus indicator |
| `--focus-ring-offset` | 2px | Gap between element and ring |
| `--focus-ring-color` | `--color-border-focus` | Blue/sky per theme |
| Selection bg | `--color-primary-light` | Selected row background |
| Selection hover | `--color-primary-subtle` | Selected row hover |

---

## 11. Opacity

| Token | Value | Usage |
|---|---|---|
| `--opacity-disabled` | 0.5 | Disabled controls |
| `--opacity-muted` | 0.7 | Muted/secondary elements |
| `--opacity-subtle` | 0.15 | Tinted backgrounds |
| `--opacity-overlay` | 0.5 (light) / 0.75 (dark) | Modal backdrops |
| `--opacity-hover` | 0.08 | Hover tint overlays |

---

## 12. Motion & Animation

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 0ms | No animation |
| `--duration-fast` | 100ms | Hover, focus transitions |
| `--duration-normal` | 180ms | Standard transitions |
| `--duration-slow` | 300ms | Panel slides, theme changes |
| `--duration-slower` | 450ms | Complex animations |
| `--ease-default` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | General purpose |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | Elements entering |
| `--ease-out` | `cubic-bezier(0, 0.55, 0.45, 1)` | Elements leaving |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | Symmetric transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy micro-interactions |

### Density-Aware Duration
Compact and ultra-compact modes compress durations to near-instantaneous
to eliminate perceived drag in expert workflows.

### Reduced Motion
All motion tokens collapse to 0ms under `prefers-reduced-motion: reduce`.

---

## 13. Z-Index Layering

| Token | Value | Usage |
|---|---|---|
| `--z-base` | 0 | Default stacking context |
| `--z-dropdown` | 50 | Dropdown menus |
| `--z-sticky` | 100 | Sticky headers, toolbars |
| `--z-header` | 150 | App header bar |
| `--z-overlay` | 200 | Backdrop overlays |
| `--z-drawer` | 250 | Side drawers, panels |
| `--z-modal` | 300 | Modal dialogs |
| `--z-popover` | 400 | Popovers, tooltips |
| `--z-toast` | 500 | Toast notifications |
| `--z-max` | 9999 | Emergency/debug overlay |

---

## 14. Icons

| Parameter | Value |
|---|---|
| **Library** | Lucide React |
| **Default Size** | 18px (density-standard), 16px (compact), 14px (ultra-compact), 20px (comfortable) |
| **Default Stroke** | 2px (standard), 1.5px below 16px |
| **Size Tokens** | `--icon-xs` (12px), `--icon-sm` (14px), `--icon-md` (18px), `--icon-lg` (22px), `--icon-xl` (24px) |

---

## 15. Charts & Data Visualization

Neutral palette, accessible, density-aware:

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--chart-1` | `#2563eb` | `#60a5fa` | Primary series |
| `--chart-2` | `#16a34a` | `#4ade80` | Secondary series |
| `--chart-3` | `#d97706` | `#fbbf24` | Tertiary series |
| `--chart-4` | `#dc2626` | `#f87171` | Quaternary series |
| `--chart-5` | `#7c3aed` | `#a78bfa` | Quinary series |
| `--chart-6` | `#0891b2` | `#22d3ee` | Series 6 |
| `--chart-7` | `#c026d3` | `#e879f9` | Series 7 |
| `--chart-8` | `#db2777` | `#f472b6` | Series 8 |
| `--chart-9` | `#059669` | `#34d399` | Series 9 |
| `--chart-10` | `#4f46e5` | `#a5b4fc` | Series 10 |
| `--chart-grid` | `var(--color-border)` | `var(--color-border)` | Grid lines |
| `--chart-axis-text` | `var(--color-text-secondary)` | `var(--color-text-secondary)` | Axis labels |
| `--chart-contrast` | `#ffffff` | `#09090b` | Text on chart fills |

---

## 16. Layout & Shell

| Token | Value | Usage |
|---|---|---|
| `--sidebar-width` | 260px | Main navigation sidebar |
| `--sidebar-collapsed-width` | 64px | Collapsed sidebar (icons only) |
| `--header-height` | 56px | Top navigation bar |
| `--content-max-width` | 1400px | Content area max width |
| `--nav-rail-width` | 56px | Global navigation rail |
| `--nav-panel-width` | 240px | Navigation panel |
| `--nav-topbar-height` | 48px | Top bar in workspaces |

### Responsive Breakpoints

| Token | Value | Description |
|---|---|---|
| `--bp-mobile` | 640px | Phone portrait → landscape |
| `--bp-tablet` | 768px | Tablet portrait |
| `--bp-laptop` | 1024px | Small laptop |
| `--bp-desktop` | 1280px | Standard desktop |
| `--bp-wide` | 1536px | Wide monitor |
| `--bp-ultrawide` | 1920px | Ultra-wide / dual monitor |

---

## 17. Accessibility

- **WCAG Level**: 2.2 AA minimum, AAA preferred for body text
- **Contrast Ratios**: ≥ 4.5:1 for normal text, ≥ 3:1 for large text, ≥ 3:1 for UI components
- **Focus Indicators**: 2px solid ring with 2px offset, always visible on keyboard focus
- **Touch Targets**: ≥ 44px on comfortable density, ≥ 32px on standard
- **Minimum Text Size**: 11px at any density tier
- **High Contrast Theme**: `strata-high-contrast` provides maximum contrast override
- **Reduced Motion**: All animations collapse to 0ms under user preference
- **Keyboard Navigation**: All interactive components fully keyboard-accessible
- **Screen Reader**: Semantic HTML, ARIA attributes, live regions where applicable

---

## 18. Token Naming Convention

```
--{namespace}-{category}-{element}-{property}-{variant}-{state}
```

| Segment | Examples |
|---|---|
| **namespace** | `color`, `space`, `type`, `density`, `radius`, `shadow`, `z` |
| **category** | `bg`, `text`, `border`, `surface`, `control` |
| **element** | `primary`, `sidebar`, `card`, `popover`, `chart` |
| **property** | `width`, `height`, `size`, `weight` |
| **variant** | `subtle`, `strong`, `light`, `muted` |
| **state** | `hover`, `active`, `focus`, `disabled` |

### Backward Compatibility
V3 tokens layer over V2 over V1. Aliases preserve all existing token names.
New code should prefer V3 semantic tokens; V1/V2 tokens are never removed.

---

## 19. Governance

- **Token Purity**: Zero raw hex, rgb, or px values in component CSS — enforced by `check-tokens.mjs`
- **Contrast Gate**: All theme combinations pass WCAG 2.2 AA — enforced by `check-contrast.mjs`
- **Density Gate**: All density tiers enforce min-size constraints — enforced by `check-density.mjs`
- **Logical Properties**: Zero physical directional CSS (margin-left, etc.) — enforced by `check-logical-properties.mjs`
- **Component Anatomy**: Every component follows 5-file uniform anatomy (TSX + CSS Module + Story + Test + Index)
- **Platform Accents**: All accent colors pass AA contrast — enforced by `check-platform-accents.mjs`
