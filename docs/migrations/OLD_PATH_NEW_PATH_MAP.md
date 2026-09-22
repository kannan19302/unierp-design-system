# UniERP Design System: Old-Path → New-Path Migration Map

**Package:** `@kannan19302/ui`  
**Standard:** Strata Design Language 2.0 (DL 2.0) / Enterprise SaaS Master Standards  
**Scope:** Polyrepo-wide migration mapping from legacy physical paths to canonical Core & Platform architecture.

---

## 1. Executive Summary & Backward-Compatibility Guarantee

Under the target architecture defined in Section 4 of the Design System specification:
1. **Canonical Physical Implementation:** All core primitives, inputs, data displays, data grids, navigation, overlays, layouts, shells, patterns, templates, tokens, and foundations reside **strictly** under `src/core/<category>/<component>/`.
2. **Platform-Specific UI Components:** All platform-owned presentation components reside strictly under `src/platforms/<platform>/<component>/`.
3. **100% Backward-Compatible Barrel Aliases:** All legacy subpaths (`@kannan19302/ui/primitives`, `@kannan19302/ui/tokens`, `@kannan19302/ui/inputs`, etc.) remain fully functional and actively exported via `package.json`. The physical folders at `src/<category>/index.ts` re-export from `../core/<category>`, ensuring zero breaking changes for existing imports while eliminating code duplication.

---

## 2. Public Export Subpath Mapping

| Legacy Import Subpath | Canonical Core Import Subpath | Status | Compatibility Layer |
| :--- | :--- | :--- | :--- |
| `@kannan19302/ui` | `@kannan19302/ui` | Active | Root barrel re-exports `core/*` & `platforms/*` |
| `@kannan19302/ui/primitives` | `@kannan19302/ui/core/primitives` | Supported | `src/primitives/index.ts` re-exports `../core/primitives` |
| `@kannan19302/ui/inputs` | `@kannan19302/ui/core/inputs` | Supported | `src/inputs/index.ts` re-exports `../core/inputs` |
| `@kannan19302/ui/forms` | `@kannan19302/ui/core/forms` | Supported | `src/forms/index.ts` re-exports `../core/forms` |
| `@kannan19302/ui/filters` | `@kannan19302/ui/core/filters` | Supported | Canonical Core category |
| `@kannan19302/ui/feedback` | `@kannan19302/ui/core/feedback` | Supported | Canonical Core category |
| `@kannan19302/ui/data-display` | `@kannan19302/ui/core/data-display` | Supported | `src/data-display/index.ts` re-exports `../core/data-display` |
| `@kannan19302/ui/data-grid` | `@kannan19302/ui/core/data-grid` | Supported | `src/data-grid/index.ts` re-exports `../core/data-grid` |
| `@kannan19302/ui/navigation` | `@kannan19302/ui/core/navigation` | Supported | `src/navigation/index.ts` re-exports `../core/navigation` |
| `@kannan19302/ui/overlays` | `@kannan19302/ui/core/overlays` | Supported | `src/overlays/index.ts` re-exports `../core/overlays` |
| `@kannan19302/ui/charts` | `@kannan19302/ui/core/charts` | Supported | `src/charts/index.ts` re-exports `../core/charts` |
| `@kannan19302/ui/layout` | `@kannan19302/ui/core/layout` | Supported | `src/layout/index.ts` re-exports `../core/layout` |
| `@kannan19302/ui/shell` | `@kannan19302/ui/core/shell` | Supported | `src/shell/index.ts` re-exports `../core/shell` |
| `@kannan19302/ui/patterns` | `@kannan19302/ui/core/patterns` | Supported | Canonical Core category |
| `@kannan19302/ui/templates` | `@kannan19302/ui/core/templates` | Supported | Canonical Core category |
| `@kannan19302/ui/studio` | `@kannan19302/ui/core/studio` | Supported | `src/studio/index.ts` re-exports `../core/studio` |
| `@kannan19302/ui/dashboard` | `@kannan19302/ui/core/dashboard` | Supported | `src/dashboard/index.ts` re-exports `../core/dashboard` |
| `@kannan19302/ui/blocks` | `@kannan19302/ui/core/blocks` | Supported | `src/blocks/index.ts` re-exports `../core/blocks` |
| `@kannan19302/ui/form-engine` | `@kannan19302/ui/core/form-engine` | Supported | `src/form-engine/index.ts` re-exports `../core/form-engine` |
| `@kannan19302/ui/notifications` | `@kannan19302/ui/core/notifications` | Supported | `src/notifications/index.ts` re-exports `../core/notifications` |
| `@kannan19302/ui/workflow` | `@kannan19302/ui/core/workflow` | Supported | `src/workflow/index.ts` re-exports `../core/workflow` |
| `@kannan19302/ui/theme` | `@kannan19302/ui/core/theme` | Supported | `src/theme/index.ts` re-exports `../core/theme` |
| `@kannan19302/ui/tokens` | `@kannan19302/ui/core/tokens` | Supported | `src/tokens/index.ts` re-exports `../core/tokens` |
| `@kannan19302/ui/tokens/base.css` | `@kannan19302/ui/core/tokens/base.css` | Supported | `src/tokens/base.css` `@import "../core/tokens/base.css"` |
| `@kannan19302/ui/tokens/design-tokens.css` | `@kannan19302/ui/core/tokens/design-tokens.css` | Supported | `src/tokens/design-tokens.css` `@import` |
| `@kannan19302/ui/tokens/charts.css` | `@kannan19302/ui/core/tokens/charts.css` | Supported | `src/tokens/charts.css` `@import` |
| `@kannan19302/ui/tokens/index.css` | `@kannan19302/ui/core/tokens/index.css` | Supported | `src/tokens/index.css` `@import` |
| `@kannan19302/ui/tokens/studio.css` | `@kannan19302/ui/core/tokens/studio.css` | Supported | `src/tokens/studio.css` `@import` |
| `@kannan19302/ui/tokens/v2/index.css` | `@kannan19302/ui/core/tokens/v2/index.css` | Supported | `src/tokens/v2/index.css` `@import` |
| `@kannan19302/ui/tokens/tokens.json` | `@kannan19302/ui/core/tokens/tokens.g.json` | Supported | JSON copy synced |
| `@kannan19302/ui/styles` | `@kannan19302/ui/core/styles` | Supported | `src/styles/globals.css` `@import` |
| `@kannan19302/ui/styles.css` | `@kannan19302/ui/core/styles/globals.css` | Supported | `src/styles.css` `@import` |
| `@kannan19302/ui/hooks` | `@kannan19302/ui/core/hooks` | Supported | `src/hooks/index.ts` re-exports `../core/hooks` |
| `@kannan19302/ui/utils` | `@kannan19302/ui/core/utils` | Supported | `src/utils/index.ts` re-exports `../core/utils` |
| `@kannan19302/ui/brand` | `@kannan19302/ui/core/brand` | Supported | `src/brand/index.ts` re-exports `../core/brand` |
| `@kannan19302/ui/icons` | `@kannan19302/ui/core/icons` | Supported | `src/icons/index.ts` re-exports `../core/icons` |
| `@kannan19302/ui/components` | `@kannan19302/ui/core/components` | Supported | `src/components/index.ts` re-exports `../core/components` |

---

## 3. Platform Subpath Mapping

| Public Platform Subpath | Target Directory | Primary Components Provided |
| :--- | :--- | :--- |
| `@kannan19302/ui/platforms/provider-admin` | `src/platforms/provider-admin/` | `AdminAppSwitcher`, `EnvironmentBanner`, `ImpersonationBanner`, `PrivilegedCommandModal`, `BreakGlassAction` |
| `@kannan19302/ui/platforms/tenant-admin` | `src/platforms/tenant-admin/` | `HeaderOnboardingHud`, `KeyboardShortcutsHelp`, `OnboardingChecklist` |
| `@kannan19302/ui/platforms/business-suite` | `src/platforms/business-suite/` | `RealTimeIndicator`, `StrataAppGrid`, `TabContextMenu`, `TenantModuleNav`, `BuilderSidebar` |
| `@kannan19302/ui/platforms/developer-platform`| `src/platforms/developer-platform/` | `DeveloperNav` |
| `@kannan19302/ui/platforms/marketing` | `src/platforms/marketing/` | `AnimatedCounter` |
| `@kannan19302/ui/platforms/identity` | `src/platforms/identity/` | `IdpLoginCard`, `SessionExpiryModal` |
| `@kannan19302/ui/platforms/marketplace` | `src/platforms/marketplace/` | `ExtensionCard`, `ListingDetailHeader` |
| `@kannan19302/ui/platforms/sites` | `src/platforms/sites/` | `SiteHeader`, `SiteFooter` |
| `@kannan19302/ui/platforms/mobile` | `src/platforms/mobile/` | `MobileActionSheet`, `MobileBottomNav` |
| `@kannan19302/ui/platforms/desktop` | `src/platforms/desktop/` | `DesktopTitlebar`, `WindowFrame` |

---

## 4. Consumer Application Migration Ledger

All bespoke, platform-local components across consuming applications have been audited, extracted, and replaced with clean re-exports from `@kannan19302/ui/platforms/*`:

| Consumer Repository | Former Local File | New Canonical Design System Import | Lines of Local Code Eliminated |
| :--- | :--- | :--- | :--- |
| `provider-admin` | `src/components/layout/Header.tsx` | `@kannan19302/ui/platforms/provider-admin` (`AdminAppSwitcher`, `EnvironmentBanner`, `ImpersonationBanner`) | 237 lines |
| `provider-admin` | `src/components/PrivilegedCommandModal.tsx` | `@kannan19302/ui/platforms/provider-admin` (`PrivilegedCommandModal`) | 450 lines |
| `business-suite` | `src/components/RealTimeIndicator.tsx` | `@kannan19302/ui/platforms/business-suite` (`RealTimeIndicator`) | 67 lines |
| `business-suite` | `src/components/StrataAppGrid.tsx` | `@kannan19302/ui/platforms/business-suite` (`StrataAppGrid`) | 125 lines |
| `business-suite` | `src/components/layout/TabContextMenu.tsx` | `@kannan19302/ui/platforms/business-suite` (`TabContextMenu`) | 108 lines |
| `business-suite` | `src/components/layout/TenantModuleNav.tsx` | `@kannan19302/ui/platforms/business-suite` (`TenantModuleNav`) | 179 lines |
| `business-suite` | `src/components/builder/BuilderSidebar.tsx` | `@kannan19302/ui/platforms/business-suite` (`BuilderSidebar`) | 184 lines |
| `developer-platform` | `src/components/layout/PlatformSidebar.tsx` | `@kannan19302/ui/platforms/developer-platform` (`DeveloperNav`) | 148 lines |
| `marketing-site` | `src/components/AnimatedCounter.tsx` | `@kannan19302/ui/platforms/marketing` (`AnimatedCounter`) | 82 lines |

**Total Platform-Local Code Eliminated:** 1,580 lines of duplicate UI implementations retired across 5 repositories.

---

## 5. Native Client Architecture (Flutter)

Flutter and mobile native clients do not import web React modules. They consume the native adapter in `design-system/adapters/flutter/`:

| Web Component (`@kannan19302/ui`) | Flutter Native Equivalent | Dart Implementation File |
| :--- | :--- | :--- |
| `Button` | `UniButton` | `adapters/flutter/lib/src/uni_button.dart` |
| `Badge` | `UniBadge` | `adapters/flutter/lib/src/uni_badge.dart` |
| `Card` | `UniCard` | `adapters/flutter/lib/src/uni_card.dart` |
| `Table` | `UniTable` | `adapters/flutter/lib/src/uni_table.dart` |
| `DesktopTitlebar` / Shell | `UniDesktopChrome` | `adapters/flutter/lib/src/uni_desktop_chrome.dart` |
| Design Tokens (CSS) | `UniColors`, `UniSpacing`, `UniTypography` | `adapters/flutter/lib/src/tokens.g.dart` |
