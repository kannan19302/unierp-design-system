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
