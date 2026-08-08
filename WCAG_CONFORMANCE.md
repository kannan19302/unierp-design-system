# WCAG 2.2 AA Conformance Statement — UniERP Design System (@kannan19302/ui)

**Published:** August 2026  
**Conformance Level:** WCAG 2.2 Level AA  
**Scope:** All exported components in `@kannan19302/ui` / `@kannan19302/design-system` and all standard routes in `unierp-web`.

## 1. Executive Summary
UniERP Design System is designed and tested to conform to the **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA**. Zero `axe-core` accessibility violations are enforced via automated CI testing on every pull request.

## 2. Key Accessibility Features
- **Perceivable:**
  - Full support for light and dark modes with minimum 4.5:1 contrast ratio for text and 3:1 for UI controls.
  - Automatic `prefers-reduced-motion` compliance — non-essential motion duration drops to 0ms.
  - Accessible SVG charts with interactive data-table fallbacks (`ChartAccessibleWrapper`).
- **Operable:**
  - 100% keyboard navigable with visible focus indicators.
  - Standardized ARIA roles and keyboard interactions: `role="tablist"` with arrow-key wrapping, `role="dialog"` with focus trapping (`useFocusTrap`) and scroll locks (`useScrollLock`).
  - Global `Ctrl+K` / `Cmd+K` keyboard shortcut for Command Palette accessibility across all routes.
- **Understandable:**
  - Form field error messages associated via `aria-describedby` and `aria-invalid`.
  - Color-blind safe status indicators combining icon shapes and text labels alongside color cues.
- **Robust:**
  - Valid semantic HTML5 markup.
  - Built against standard ARIA 1.2 patterns.

## 3. Automated & Manual Audit Methodology
- **Automated Testing:** `axe-core` automated CI integration scanning all component stories and routes (`scripts/ci/check-axe-a11y.mjs`).
- **Screen Reader Script:** Tested against NVDA (Windows), VoiceOver (macOS/iOS), and TalkBack (Android).
