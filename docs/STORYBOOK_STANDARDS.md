# UniERP Design System: Storybook Enterprise Standards & Best Practices

This guide documents the enterprise Storybook standards required for all components in `@kannan19302/ui`.

## 1. Golden Rules for Storybook Stories

1. **Every Component Must Have Autodocs**:
   - The default export must declare `tags: ["autodocs"]`.
   - All component interface props must be documented with TypeScript JSDocs.
   - Storybook renders an interactive documentation page with full props tables, description, controls, and accessibility guidelines.

2. **Mandatory "All States in One Place" (StateMatrix / AllStatesGallery)**:
   - To avoid navigating through separate tabs to inspect visual states, every component must export an `AllStatesGallery` or `StateMatrix` story.
   - This story renders:
     - **Default** / Normal
     - **Hover** / Focus-Visible
     - **Active** / Selected
     - **Loading** / Submitting
     - **Disabled** / Readonly
     - **Error** / Invalid
     - **Empty** / Initial
     - **Density Tiers** (Ultra-compact, Compact, Standard, Comfortable)

3. **Sub-Elements & Anatomy Breakdown**:
   - Compound components must explicitly visualize their sub-components (e.g., `Card.Header`, `Card.Content`, `AvatarGroup`, `SplitButton` main + menu trigger, `UserChip` avatar + tag).

4. **Taxonomy Standards**:
   - `Primitives/*`
   - `Inputs/*`
   - `DataDisplay/*`
   - `DataGrid/*`
   - `Navigation/*`
   - `Overlays/*`
   - `Blocks/*`
   - `Layout/*`
   - `Shell/*`

5. **Accessibility Verification**:
   - Zero axe-core accessibility violations in the Storybook A11y panel.

6. **Mandatory Compilation & Error-Free Verification Before Handoff**:
   - Every story file MUST compile cleanly through TypeScript AST and JSX transforms with zero syntax, parse, or escaping errors.
   - Raw `>` or `<` inside JSX text nodes is strictly prohibited; use `&gt;`, `&lt;`, or string literals `{"..."}`.
   - Agents MUST execute `node scripts/check-storybook-standards.mjs` (which runs Phase 1 compilation check across all 374 story files) and verify zero errors before claiming completion.

7. **Universal Strata Typography Standards**:
   - All components, stories, and sub-elements must use the authoritative Strata font family:
     `var(--font-sans, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)`.
   - Never rely on default unstyled browser serif fonts; all interactive controls and containers must inherit `--font-sans`.
   - Google Fonts Inter (100-900) and IBM Plex Mono are preloaded globally in `preview-head.html` and `fonts.css`.
