# Command Menu Audit and Elevation Specification

Date: 2026-09-22  
Owner: PLT-DS  
Risk: R2 additive accessibility and interaction refinement  
Knowledge delta: `UPDATED` — implementation evidence only; `DS-FR-002`, `DS-FR-004`, and `DS-NFR-004` remain authoritative.

============================================================
COMPONENT AUDIT & ELEVATION SPECIFICATION
============================================================
1. Current Problem:         `CommandPalette` visually resembles a command menu but lacks a focus trap, combobox/listbox relationships, option semantics, active-descendant state, result counts, and polished Strata 2.0 surface/focus treatment. Result rows are clickable `div` elements rather than native controls.
2. Reference Pattern:       shadcn/ui Command composes a dialog, searchable command input, grouped list, empty state, items, and shortcut affordances. Radix/Base UI dialog patterns reinforce focus containment and restoration.
3. Proposed Improvement:    Preserve the controlled API while composing UniERP `FocusTrap`; expose correct combobox/listbox/option semantics; render native buttons; announce result count; use semantic surface, border, radius, elevation, density, and focus tokens; respect reduced motion.
4. Shared Component(s):     `src/core/navigation/command-palette`, `src/core/overlays/focus-trap` as an existing dependency.
5. Dependent Screens/Repos: All web application shells consuming `@kannan19302/ui/navigation`; no downstream mutation in this upstream iteration.
6. Implementation Plan:     (1) add semantic IDs and focus containment; (2) render native option buttons and synchronize active descendant; (3) add result metadata and robust empty state; (4) update token-only CSS; (5) expand keyboard and accessibility tests; (6) run focused and repository gates plus Storybook visual checks.
============================================================

No third-party code is copied. The reference supplies interaction and composition criteria only.
