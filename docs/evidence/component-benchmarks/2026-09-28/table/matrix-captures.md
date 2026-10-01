# DataTable responsive/theme/density capture matrix — 2026-09-28

## Run

- Story: `compositions-table--enterprise-workbench` in local Storybook.
- Browser: Chromium via Playwright, Node 22.23.3.
- Viewports: 1280×720 and 320×740.
- Themes: `strata`, `strata-dark`, `strata-high-contrast`.
- Densities: `ultra-compact`, `compact`, `standard`, `comfortable`.
- Result: all 24 requested combinations applied to the document and captured; the target named table contained eight visible row slots in every case; no page errors were observed.

## Captures

| Theme | Density | Desktop 1280×720 | Narrow 320×740 |
| --- | --- | --- | --- |
| Strata | Ultra-compact | [capture](matrix-1280-strata-ultra-compact.png) | [capture](matrix-320-strata-ultra-compact.png) |
| Strata | Compact | [capture](matrix-1280-strata-compact.png) | [capture](matrix-320-strata-compact.png) |
| Strata | Standard | [capture](matrix-1280-strata-standard.png) | [capture](matrix-320-strata-standard.png) |
| Strata | Comfortable | [capture](matrix-1280-strata-comfortable.png) | [capture](matrix-320-strata-comfortable.png) |
| Strata dark | Ultra-compact | [capture](matrix-1280-strata-dark-ultra-compact.png) | [capture](matrix-320-strata-dark-ultra-compact.png) |
| Strata dark | Compact | [capture](matrix-1280-strata-dark-compact.png) | [capture](matrix-320-strata-dark-compact.png) |
| Strata dark | Standard | [capture](matrix-1280-strata-dark-standard.png) | [capture](matrix-320-strata-dark-standard.png) |
| Strata dark | Comfortable | [capture](matrix-1280-strata-dark-comfortable.png) | [capture](matrix-320-strata-dark-comfortable.png) |
| High contrast | Ultra-compact | [capture](matrix-1280-strata-high-contrast-ultra-compact.png) | [capture](matrix-320-strata-high-contrast-ultra-compact.png) |
| High contrast | Compact | [capture](matrix-1280-strata-high-contrast-compact.png) | [capture](matrix-320-strata-high-contrast-compact.png) |
| High contrast | Standard | [capture](matrix-1280-strata-high-contrast-standard.png) | [capture](matrix-320-strata-high-contrast-standard.png) |
| High contrast | Comfortable | [capture](matrix-1280-strata-high-contrast-comfortable.png) | [capture](matrix-320-strata-high-contrast-comfortable.png) |

## Measurements and observations

The target table is the Accounts receivable invoices table. Desktop row heights in density order (ultra-compact, compact, standard, comfortable) were:

| Theme | 1280×720 row heights |
| --- | --- |
| Strata | 26.5 / 33 / 45 / 53px |
| Strata dark | 26.5 / 33 / 45 / 53px |
| High contrast | 27.5 / 34 / 46 / 54px |

At 320×740, content wraps within the table's horizontal scroll region and row heights increase:

| Theme | 320×740 row heights |
| --- | --- |
| Strata | 38 / 45 / 56 / 63px |
| Strata dark | 38 / 45 / 56 / 63px |
| High contrast | 39 / 46 / 57 / 64px |

The document and body widths match their viewports (1280px and 320px); neither has horizontal overflow. At 1280px, the named scroll region is 1240px wide and the table fits it. At 320px, the named region is 288px wide (280px client width); table scroll widths by density are 297 / 340 / 408 / 467px. The region has `role=region`, an accessible name, and `tabindex=0`, so narrow-screen overflow is contained in a focusable scroll region.

Visual inspection found that identifiers and customer names wrap heavily in the 320px ultra-compact capture. For example, invoice identifiers split across lines and short customer labels wrap. Containment prevents page-level overflow, but the captures do not establish that dense financial records remain quickly scannable or usable on mobile. Keep responsive/reflow status `PARTIAL` until the product owner-approved mobile behavior and representative record task are evaluated. Do not infer that DataTable should become cards or silently alter column priorities from this evidence alone.

The earlier desktop-only report recorded row heights 26.3 / 33.0 / 44.8 / 52.8px in Strata and dark, and 27.1 / 33.8 / 45.6 / 53.6px in high contrast. Those are retained as an earlier observation; this report records the fresh persisted-capture run. Minor differences can result from current rendered content/control sizing. The matched online reference remains the official [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table), with the retained matched desktop pair in this directory. This narrow matrix is local-only: no matched 320px reference capture was made.

## Evidence limits

- Theme/density attributes, visible rows, geometry, containment, and screenshots are verified for these 24 Storybook cases only.
- Mobile content prioritization/readability is an open design decision; no column-level task study was performed.
- The focusable region and accessible name were observed, but horizontal-scroll keyboard operation, screen-reader announcements, axe results, 200% zoom, OS modes, and assistive technology were not tested.
- No RTL, error-state, selection/editing, authenticated Business Suite route, or package-consumer journey is covered here.
- DataTable is distinct from DataGrid/SpreadsheetGrid. This evidence does not satisfy or transfer to that separate inventory row.
- DataTable overall remains `NOT VERIFIED`; the frozen Strata calibration gate remains open.

## Optional mobile alternative follow-up — 2026-09-28

The original scroll-only captures above prompted the additive `mobileAlternative` slot recorded in [the R2 change contract](../../../../changes/strata-datatable-mobile-alternative-change-contract-2026-09-28.md). The Enterprise Workbench story supplies a caller-owned invoice-card list with ID, customer, status, amount, selection, and row actions, all connected to the same story state. When no alternative is supplied, the original named, keyboard-reachable scrolling table remains unchanged.

The rebuilt static Storybook was rendered in Chromium with Node 22.23.3 for all 24 theme/density/viewport combinations. Fresh captures are retained as `mobile-alt-<theme>-<density>.png` at 320×740 and `desktop-<theme>-<density>.png` at 1280×720. The browser result is recorded in [mobile-alt-browser-results.json](mobile-alt-browser-results.json): 24/24 requested configurations, correct visible mode for each width, eight current records, body/document width within viewport, zero page errors, zero axe violations in all 12 narrow samples, and a passing keyboard selection/action journey. The old `matrix-*.png` files above remain the historical scroll-only baseline.

| Theme | Density | Narrow 320×740 | Desktop 1280×720 |
| --- | --- | --- | --- |
| Strata | Ultra-compact | [cards](mobile-alt-strata-ultra-compact.png) | [table](desktop-strata-ultra-compact.png) |
| Strata | Compact | [cards](mobile-alt-strata-compact.png) | [table](desktop-strata-compact.png) |
| Strata | Standard | [cards](mobile-alt-strata-standard.png) | [table](desktop-strata-standard.png) |
| Strata | Comfortable | [cards](mobile-alt-strata-comfortable.png) | [table](desktop-strata-comfortable.png) |
| Strata dark | Ultra-compact | [cards](mobile-alt-strata-dark-ultra-compact.png) | [table](desktop-strata-dark-ultra-compact.png) |
| Strata dark | Compact | [cards](mobile-alt-strata-dark-compact.png) | [table](desktop-strata-dark-compact.png) |
| Strata dark | Standard | [cards](mobile-alt-strata-dark-standard.png) | [table](desktop-strata-dark-standard.png) |
| Strata dark | Comfortable | [cards](mobile-alt-strata-dark-comfortable.png) | [table](desktop-strata-dark-comfortable.png) |
| High contrast | Ultra-compact | [cards](mobile-alt-strata-high-contrast-ultra-compact.png) | [table](desktop-strata-high-contrast-ultra-compact.png) |
| High contrast | Compact | [cards](mobile-alt-strata-high-contrast-compact.png) | [table](desktop-strata-high-contrast-compact.png) |
| High contrast | Standard | [cards](mobile-alt-strata-high-contrast-standard.png) | [table](desktop-strata-high-contrast-standard.png) |
| High contrast | Comfortable | [cards](mobile-alt-strata-high-contrast-comfortable.png) | [table](desktop-strata-high-contrast-comfortable.png) |

Live online comparison at 320×740: the first example on the official [shadcn Base Table page](https://ui.shadcn.com/docs/components/base/table) uses a `327px` table in a `190px` visible scroll region; document/body remain 320px wide. A crop of that actual reference region is [reference-shadcn-table-region-320.png](reference-shadcn-table-region-320.png), and its full page capture is [reference-shadcn-table-narrow-live.png](reference-shadcn-table-narrow-live.png). Strata's optional list is [mobile-alt-strata-standard.png](mobile-alt-strata-standard.png). This compares shadcn's simple scrollable Table behavior with Strata's optional task-specific list pattern; SAP Fiori's official [responsive-table guidance](https://experience.sap.com/fiori-design-web/responsive-table/) supports the label/value mobile presentation pattern. This comparison does not imply that every complex grid should become a list.

| Updated criterion | State | Evidence/remaining |
| --- | --- | --- |
| Optional caller-owned narrow presentation | PASS for provider/story surface | At 320px the local story shows the alternative; at 1280px it shows the table. Consumers must supply and synchronize their own appropriate representation. |
| Responsive viewport containment | PASS for the 24 Storybook cases | No body/document overflow at 320px or 1280px in 3 themes × 4 densities. Actual browser zoom, intermediate/container widths, RTL and OS modes remain unverified. |
| Narrow-mode axe | PASS for the 12 matrix samples | axe-core returned zero violations for WCAG 2.0 A/AA, 2.1 A/AA and 2.2 AA tags. A manual screen-reader session remains unverified. |
| Keyboard row selection/action | PASS for the synthetic workbench | Space selects INV-001; Enter opens its actions, ArrowDown selects “View invoice,” and Enter updates the story status. Other workflows remain unverified. |
| Business Suite integration | NOT VERIFIED | No Business Suite route adopts the new slot; package publication and consumer journey remain open. |
| DataTable calibration overall | NOT VERIFIED | RTL, actual 200% zoom, OS modes, screen reader, complete states, and consumer/package proof remain required by the frozen protocol. |
