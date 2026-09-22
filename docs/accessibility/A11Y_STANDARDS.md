# Accessibility Standards (WCAG 2.2 Level AA / AAA)

## 1. Non-Negotiable Accessibility Laws
1. **Automated `vitest-axe` Audit**:
   Every single UI component test suite in `@kannan19302/ui` must execute an automated accessibility audit using `vitest-axe` with zero violations:
   ```tsx
   it("has zero accessibility violations", async () => {
     const { container } = render(<MyComponent />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```
2. **Accessible Contrast Ratios**:
   - Standard body text: >= 4.5:1 against background.
   - Large text (>= 18pt / >= 14pt bold) and graphical controls: >= 3.0:1.
   - Verified across all 6 themes (`strata`, `strata-dark`, `strata-high-contrast`, `meridian`, `meridian-dark`, `high-contrast`) and all 8 platform accents via `scripts/check-contrast.mjs` and `scripts/check-platform-accents.mjs`.
3. **Keyboard Navigation & Visible Focus**:
   - All interactive elements must be focusable via `Tab` key and activate via `Enter` or `Space`.
   - Modals and drawers must lock scroll and trap focus within the overlay until dismissed via `Escape` or close triggers.
   - Focus indicators must be prominent and dual-ring (`box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-border-focus)`).
4. **ARIA Roles & Live Regions**:
   - Form inputs with errors must set `aria-invalid="true"` and associate with the error message via `aria-describedby`.
   - Dynamic asynchronous updates (autosave indicator, toasts, metric live changes) must declare `aria-live="polite"` or `aria-live="assertive"`.
   - Modals must declare `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
5. **Touch Targets**:
   - In comfortable density, touch targets must be at least 44x44 CSS pixels.
