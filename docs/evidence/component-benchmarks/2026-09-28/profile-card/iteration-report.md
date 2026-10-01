# Iteration evidence report — ProfileCard

**STATUS:** PARTIAL

**CHANGES:** Added a direct comparison packet for local ProfileCard Default/Full, official shadcn Hover Card, and three live 21st.dev user/profile menu previews. Updated the benchmark ledger and platform traceability. No source code changed.

**VALIDATION EXECUTED:** Manually inspected the local Default and Full Storybook previews and their accessibility trees; opened the official shadcn Hover Card and observed its open accessibility-tree content; opened and inspected live 21st.dev Ayman, ShadcnSpace and Ravi previews; reviewed Strata component/styles/stories/tests and searched Business Suite source/call sites, including its private `ProfileHoverCard`. No tests or builds were run.

**RESULTS:** Strata's ProfileCard is a passive presentational card, while the closest live references are account/contact menus. Business Suite has a private data-backed profile surface and no direct Strata ProfileCard JSX use. Source contradicts the story's failed-avatar fallback promise; both variants style hover while remaining passive; ultra-compact initials/email fall below the 11px floor. Viewports were not matched, captures were not retained, and runtime failure, keyboard, accessibility technology, theme, density, direction, consumer integration and journey proof remain open.

**ACCEPTANCE CRITERIA:**
1. Compare local compact/full renders with official and actual community patterns — met for the inspected states.
2. Separate shared presentation from app-owned account actions and capture Business Suite use — met from source search/review, not end-to-end runtime.
3. Score the selected observed references and record rejected/unverified evidence — met provisionally.
4. Verify broken avatar, responsive/theme/density/RTL, zoom/OS mode, keyboard/screen-reader, package gates and an end-to-end Business Suite journey — not met.

**REMAINING WORK:** Resolve and implement the false broken-avatar fallback promise and passive hover treatment after the frozen calibration gate; bring ultra-compact text up to 11px; validate status/role labeling; define a separate PLT-ERP consumer contract before any private `ProfileHoverCard` convergence; complete the full visual/accessibility/consumer matrix and package checks.

**NEXT ACTION:** Continue evidence-only benchmark coverage for the next catalog component while calibration remains open.

**Knowledge delta:** UPDATED — profile-card benchmark, consumer boundary and known behavior gaps recorded.

**Proof state:** designed: partially reviewed; implemented: evidence packet/ledger/traceability only; tested: not run; integrated: not verified; deployed: not deployed; released: not released.

This is not done.
