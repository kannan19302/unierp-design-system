# AppShell-1 live comparison — 2026-09-28

Status: `PARTIAL`. The AppShell benchmark row remains `NOT VERIFIED` pending the other variants, state and accessibility matrices, and Business Suite consumer journeys.

## Reference and captures

- Primary reference: [Shadcnblocks Application Shell 1](https://www.shadcnblocks.com/block/application-shell1), described as a collapsible grouped sidebar, breadcrumb header, account footer, and content area.
- Reference asset: [Application Shell 1 preview](https://cdn.shadcnblocks.com/shadcnblocks/screenshots/block/application-shell1-4x3.webp), captured as an element at 668 × 502 CSS px.
- Local story: `shells-appshell--app-shell-1`, rendered at 1440 × 1080 CSS px (1434 × 1080 content box).
- [Side-by-side comparison](comparison-side-by-side.png); [reference capture](reference-shell1.png); [local Storybook capture](strata-app-shell-1.png).

The remote page provides a fixed 668 × 501 preview image rather than an inspectable live demo viewport. The captures are scaled to fit equal 4:3 comparison panels; they are not pixel-matched viewport captures.

## Findings and correction

The reference establishes the edge-to-edge sidebar + breadcrumb header + workspace frame. Strata preserves that hierarchy and provides ERP-oriented tenant/team switching, navigation search, global search/theme/notification/account actions, and sample workspace content. The reference image itself has sparse placeholder content, so dashboard content is not treated as part of shell parity.

Before correction the Strata shell-preview sidebar was 300px wide, or 20.9% of the 1434px content viewport. The reference preview's sidebar proportion is about 17%. Inspection showed the 300px width came from the shared Storybook shell fixture; the product SideNav base width is 240px. The fixture is now 16rem. Browser geometry after the change measures the shell wrapper, fixture, and nested SideNav at 256px each at a 1440px viewport. The shared SideNav default and public API did not change.

## Verification scope and remaining work

Observed in the default story: app shell, banner/top nav, labeled side-navigation landmark, skip link, breadcrumb, dashboard content, and 256px sidebar geometry. At 390 × 844, the open navigation drawer measured 288px at its wrapper and 287.2px at the nested SideNav, with no horizontal viewport overflow; the open-drawer screenshot is retained. This does not prove the complete responsive matrix, menu/focus workflows across variants, themes, density, RTL, forced colors, screen-reader behavior, or consumer authorization/data.

Next shell benchmark work: compare AppShell-5 (dual panel) against a suitable current reference. Complete theme, density, direction, keyboard, assistive-technology, and consumer-state matrices for all variants. Verify the production SideNav consumer and Business Suite home route before claiming integration. No Business Suite end-to-end journey was exercised in this cycle.

## Inset and floating variants

Direct references: [Application Shell 2 — inset sidebar](https://www.shadcnblocks.com/block/application-shell2) and [Application Shell 5 — floating sidebar](https://www.shadcnblocks.com/block/application-shell5). Both published image previews and matching Storybook screenshots are included in the [inset/floating side-by-side](comparison-inset-floating-side-by-side.png). Reference assets are 668 × 501; local stories are 1440 × 1080, scaled into equal 4:3 panels.

AppShell-2 preserves the reference inset workspace treatment while retaining the shared shell header and SideNav fixture. AppShell-3 now pairs the floating workspace with the horizontal module-navigation row visible in the Shell 5 preview; the browser accessibility snapshot names that row `Module navigation`. These comparisons cover the default light desktop render only. The remaining shell states and the consumer route remain open.

Designed: standard AppShell hierarchy and sidebar width. Implemented: shell-preview fixture width corrected from 300px to 16rem. Tested: browser measured 256px at a 1440px viewport; supported-runtime package checks were not run in this cycle. Integrated: not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full benchmark remains `REQUIRED-BUT-INCOMPLETE`.

## AppShell-4 top-navigation comparison — 2026-09-28

- **Primary reference:** [Shadcnblocks Application Shell 4 — Top Navigation with Tabs](https://www.shadcnblocks.com/block/application-shell4). The published page identifies a horizontal top navigation with tab-style links, search, user dropdown, and mobile sheet. The [published preview image](https://cdn.shadcnblocks.com/shadcnblocks/screenshots/block/application-shell4-4x3.webp) is 668 × 501. Its interactive preview endpoint returned HTTP 403, so interactive and mobile behavior could not be inspected.
- **Supplemental patterns:** [Application Shell 3 — Top Navigation Bar Shell](https://www.shadcnblocks.com/block/application-shell3) describes dropdown module navigation and a mobile sheet; its preview endpoint also returned 403. [Official shadcn Sidebar documentation](https://ui.shadcn.com/docs/components/base/sidebar) documents responsive/collapsible sidebar alternatives, which are intentionally not used in this topbar variant.
- **Current local story:** [`shells-appshell--app-shell-4`](http://localhost:6006/iframe.html?id=shells-appshell--app-shell-4&viewMode=story), inspected at approximately 1274 × 718. The side-by-side artifact is [`comparison-app-shell-4.html`](comparison-app-shell-4.html); its Storybook pane scales a 1440 × 1080 canvas into a 4:3 panel while the reference pane embeds the published preview asset. Browser policy blocked opening the local `file:` artifact for inspection, so that paired artifact itself is not claimed as rendered proof.

The source review found the previous AppShell-4 story incorrectly combined a left sidebar with the topbar variant and omitted the existing `topNavigation` slot. The story now uses a UniERP/Business Suite title stack, horizontal module nav, and a second, separately named workspace nav with native anchors targeting its illustrative sections. Visual inspection of the updated local story confirms the two-row hierarchy, active underline, full-width workspace, and no left rail. Its AX tree exposes `Module navigation` and `Workspace views`, and lists the three in-story anchor destinations. The sample contains illustrative dashboard data; it does not imply tenant data or business authority.

Compared with the reference, Strata retains its platform identity, breadcrumb context, theme and notification controls, and more information-dense ERP sample content. Those additions satisfy Strata shell context while the primary two-row navigation structure now matches. The remote live implementation, mobile sheet, narrow-screen state, full theme/density/direction/zoom matrix, keyboard and screen-reader journey, and Business Suite route remain unverified. This is a Storybook composition correction, not a consumer route integration claim.

Designed: horizontal module navigation plus distinct workspace views. Implemented: corrected AppShell-4 story using the existing `topNav` and `topNavigation` slots and tokenized story-only link styling. Tested: AppShell tests 21/21; full suite 136 files/831 tests; lint, typecheck, inventory, Storybook standards, and package build pass on Node 22.23.3. After the final title/breadcrumb edit, `check:storybook` (123 story files/116 component stories) and `typecheck` were rerun and passed. Integrated: not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED`; full shell and Business Suite readiness remains `REQUIRED-BUT-INCOMPLETE`.



## AppShell-5 dual workspace comparison — 2026-09-28

- **Primary visual reference:** [Shadcnblocks Dashboard 16](https://www.shadcnblocks.com/block/dashboard16), whose published preview shows navigation, a central operational dashboard and a persistent right bookings panel. The [published preview asset](https://cdn.shadcnblocks.com/shadcnblocks/screenshots/block/dashboard16-4x3.webp) is a fixed 668×501 image, not an inspectable live reference implementation.
- **Supplemental behavior guidance:** [SAP Fiori Dynamic Side Content](https://experience.sap.com/fiori-design-web/dynamic-side-content/) and [SAP Fiori Side Panel](https://experience.sap.com/fiori-design-web/side-panel/) guide contextual side content, preserving access to the main task and responsive handling. [shadcn/ui Resizable](https://ui.shadcn.com/docs/components/base/resizable) documents keyboard-operable resizing; AppShell's public contract defines a caller-supplied inspector slot, so this packet did not introduce a splitter or resizing API.
- **Local implementation:** [AppShell-5 Storybook](http://localhost:6006/iframe.html?id=shells-appshell--app-shell-5&viewMode=story). Its selected work item supplies illustrative details to a labelled complementary region; closing details restores focus to the selected row.
- **Retained local captures:** [1440×900 desktop](app-shell-5-desktop.png), [1024×900 tablet](app-shell-5-tablet.png), [390×844 mobile](app-shell-5-mobile.png). At 1440px the inspector is 360px wide; at 1200px and 1024px it follows the main workspace at the bottom; at 390px it stacks below the workspace. Document scroll width equals viewport width at all four measured widths (including 1200×900). Selection updates the detail heading, close removes the inspector and restores focus, and the browser reported no page errors.

Dashboard 16 is a visual analogue for a persistent right-side operational context, not an exact business-task equivalent: its bookings panel and Strata's selected work-item details have different domain semantics. SAP and shadcn provide design guidance rather than scored product equivalents. The comparison is therefore qualitative; remote and local captures are not matched live viewport renders. These observations do not establish production consumer semantics, permissions, keyboard/screen-reader coverage, the theme/density/direction/zoom matrix, or end-to-end Business Suite readiness. AppShell's overall ledger remains `NOT VERIFIED`.

Designed: contextual dual-workspace structure, `PARTIAL`. Implemented: responsive inspector track and interactive Storybook example, scoped. Tested: AppShell tests 21/21; full provider suite 136 files/831 tests; Storybook standards, inventory, typecheck, lint, package build and production Storybook build pass; browser geometry and close/focus flow pass. Integrated: not verified. Deployed: no. Released: no. Knowledge delta: `UPDATED` for the scoped comparison and implementation; `REQUIRED-BUT-INCOMPLETE` for end-to-end design-system readiness.
