# ProfileCard direct comparison — 2026-09-28

## Scope and change contract

R2 evidence-only packet within the 113-component Strata benchmark program. Accountable owner: PLT-DS for the shared presentation component and evidence; PLT-ERP owns account/profile task behavior and any Business Suite consumer change; PLT-OPS owns the cross-platform traceability record. Roots touched: `design-system` evidence/ledger and `platform` traceability. Business Suite was searched and its existing consumer-like implementation reviewed; no application source is changed. Rollback: remove this packet and revert only the ProfileCard ledger row and traceability paragraph. The current calibration gate remains in force; this is research, not authorization to elevate another source component.

## Compared live evidence

### Local Storybook

- [ProfileCard Default](http://localhost:6006/iframe.html?id=compositions-profilecard--default&viewMode=story): compact identity row with initials avatar, online dot, name, role badge and email. Story AX exposed “Status: online” and the identity text, but the root is passive and does not expose a trigger/action.
- [ProfileCard Full](http://localhost:6006/iframe.html?id=compositions-profilecard--full&viewMode=story): banner, overlapping initials avatar, name, email, role badge and tenant tag. AX exposed the status and identity content. This is a presentation card, not a profile menu.

### Primary interaction reference

- Official [shadcn Hover Card](https://ui.shadcn.com/docs/components/base/hover-card): live page describes a sighted-user preview behind a link and shows the HoverCard/Trigger/Content composition, configurable open/close delay and side/alignment. Clicking “Hover Here” revealed @nextjs identity content and join date in the accessibility tree. It benchmarks the wrapper/preview interaction, not ProfileCard data authority or an account-action menu.

### Community profile/account references

- [21st.dev User Dropdown by Ayman Echakar](https://21st.dev/@aymanch-03/components/user-dropdown): clicking the live avatar preview exposed a menu with identity, online status/update-status, profile, appearance, settings, notifications, help, switch-account and sign-out entries. AX exposed a menu and named contents. This is the closest compact account-menu comparison, but the Strata ProfileCard is not a dropdown trigger and app-owned account actions must not move into the shared presentation primitive.
- [21st.dev User Profile Dropdown Menu by ShadcnSpace](https://21st.dev/@shadcnspace/components/dropdown-menu-01): the live preview depicts a profile header with avatar/email and grouped profile, subscription, invoice and settings actions. The embedded preview was visually inspected; its inner accessibility tree and keyboard interaction were not available in this observation.
- [21st.dev User Profile Dropdown by Ravi Katiyar](https://21st.dev/@ravikatiyar162/components/user-profile-dropdown): the preview depicts an avatar/name handle with message, call, open, status and move actions. This is an adjacent contact/action surface rather than a tenant-scoped identity card; its interactions were not exercised.
- [21st.dev animated Profile Card by daiv09](https://21st.dev/@daiwiikharihar/components/profile-card): the page describes a hover-to-expand social profile card with motion and GitHub link. Its preview showed only a placeholder image in this pass, so it is rejected as verified behavior evidence and was not scored.

These are live page inspections, not a pixel-matched screenshot comparison. Viewports and card contents were not normalized; captures were inspected in-session but not retained. The community previews are untrusted third-party patterns, not design or accessibility standards.

## Weighted benchmark screen (provisional)

Scores are task fit / interaction / states / density-responsive / semantics-keyboard / visual discipline / portability / maintenance (0–3); task fit and semantics count twice, maximum 30. Scores assess these observed previews only and do not certify their full packages.

| Reference | Score | Decision |
| --- | ---: | --- |
| shadcn Hover Card | 25/30 (`2/3/2/2/3/3/2/3`) | Primary for an optional preview wrapper: trigger/content composition and positioning traits; not a ProfileCard replacement. |
| 21st.dev Ayman User Dropdown | 17/30 (`2/3/2/1/1/2/2/1`) | Supplemental for compact account-menu grouping/status actions. Keep account commands and their permission/data behavior in PLT-ERP. |
| 21st.dev ShadcnSpace User Profile Dropdown Menu | 19/30 (`3/1/1/1/1/3/3/2`) | Supplemental visual grouping reference. Static preview observation only, no keyboard/semantics score beyond visible evidence. |
| 21st.dev Ravi User Profile Dropdown | 15/30 (`2/1/1/1/1/2/2/2`) | Supplemental action inventory for a contact/employee profile. Not the same job as an account identity card. |

## Strata and Business Suite findings

- Strata `ProfileCard` is a presentational composition with compact/full variants, four density tiers, optional role, avatar URL, tenant, presence label and caller-rendered actions. It does not fetch profile data or authorize account actions, which is the right L1/L4 boundary.
- The component documentation says the initials fallback works when an avatar URL is omitted **or fails**, but source only selects initials when `avatarUrl` is absent. An image load error has no `onError` fallback, and the tests cover an available URL rather than a failed image. The documented behavior is therefore not implemented.
- Both passive variants add hover styling (`background/border` or shadow) without an intrinsic button/link trigger. Caller-provided action controls do not make the root interactive. Hover affordance needs a decision: remove it from passive cards or expose an explicit interactive wrapper at the owning consumer layer.
- Ultra-compact avatar initials and email fall back to 10px, below the workspace's 11px minimum. The four density variants and online/away/busy/offline stories do not prove a complete responsive/theme/direction matrix.
- Business Suite's AppHeader uses private `ProfileHoverCard`, which owns target user lookup, profile endpoint requests, presence mutation, chat/sign-out and profile affordances. Search found no direct Strata `ProfileCard` JSX import/use. This private, domain-backed app surface cannot be marked as shared-component adoption; its data fetching and commands stay app-owned. A convergence candidate exists only after a PLT-ERP task/API/permission review and separate consumer change contract.

## Comparison decision

Keep `ProfileCard` as a presentational identity card; do not transform it into a menu merely to resemble the community account-dropdown examples. Preserve a future option to compose it inside an app-owned HoverCard/popover. Before any implementation, reconcile the failed-avatar promise, passive hover affordance, 11px floor and status/role semantics with existing API consumers; then evaluate whether the Business Suite private `ProfileHoverCard` can consume the shared presentation composition without moving fetching, presence mutation, sign-out or authorization into L1. Reference CSS, fonts, colors, dependencies and motion are deliberately not copied.

## Not verified / next gates

Not verified: broken-image runtime/fallback behavior, focus and keyboard for caller actions, browser screen reader, 200% zoom, forced colors, reduced motion, responsive reflow, three-theme/four-density matrix, RTL, contrasts, component behavior under profile data loading/error, package gates, exact Business Suite consumer API dependencies/permissions, integration and end-to-end profile workflow. No automated test/build command was run. No source implementation, integration, deployment or release is claimed.
