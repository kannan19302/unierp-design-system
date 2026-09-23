# Strata business foundations evidence — 2026-09-22

Scope: `@kannan19302/ui` foundation tokens and styles, the PLT-DS experience contract,
the generated Flutter adapter/client tokens, and Storybook presentation evidence.
Source-control revision is intentionally omitted while the iteration is uncommitted.

## Implemented foundation

- Inter is the heading and body family across Strata, Meridian compatibility aliases and high contrast.
- IBM Plex Mono is the identifier/code family; business numbers use Inter tabular lining figures.
- Lucide remains the single public icon API with the existing density and stroke system.
- The default radius scale is 4, 6, 8, 10, 12 and 16 CSS pixels.
- Strata semantic surfaces derive from the active theme palette at every theme boundary.
- The PLT-DS experience specification records palette, type hierarchy, icons, spacing, density,
  borders, elevation, menus, layout, motion, states, responsiveness and presentation ownership.

## Visual review

Story: `Foundations/Business foundations — Workbench`.

Reviewed at the default browser viewport, `standard` density, `apps` platform identity and LTR:

| Theme | Evidence |
| --- | --- |
| `strata` | Inter loaded; body and heading computed as Inter; radius samples computed as 4/6/8/10/12/16px; slate/cobalt hierarchy rendered coherently |
| `strata-dark` | Inter loaded; obsidian surfaces, sky action colour and semantic selected surface rendered coherently |
| `strata-high-contrast` | Inter loaded; root variables resolve to white/black/blue; explicit boundaries and visible keyboard focus rendered coherently |

The sample uses synthetic invoice data. It demonstrates appearance and state only; it does not
claim an implemented business workflow. A keyboard Tab review reached the primary action with a
visible two-layer focus treatment.

## Validation

All commands ran from the named repository unless a subdirectory is stated.

| Result | Command |
| --- | --- |
| PASS | `pnpm check:foundations` (`design-system`) — 4/4 focused foundation checks |
| PASS | Node 22 `pnpm lint` (`design-system`) — inventory, token, logical-property, UI governance, layer, density, contrast, accent and type checks |
| PASS | Node 22 `pnpm build` (`design-system`) — 420 components, 420 stories/tests, 7 floorplans, 48 exports, generator parity |
| PASS | Node 22 `pnpm test` (`design-system`) — see final iteration report for counts |
| PASS | `pnpm check:storybook` (`design-system`) — 424 stories compile; two pre-existing metadata warnings |
| PASS | Node 22 `pnpm build-storybook` (`design-system/storybook`) |
| PASS | `flutter analyze` (`mobile`) — no issues |
| PASS | `flutter test` (`mobile`) — 255 tests |
| FAIL | enterprise-brain validator (`workspace root`) — 12 stale pre-consolidation paths such as `unierp-platform` and `unierp-workspace`; unrelated to this foundation implementation |

The design-system test run retained a pre-existing React `act(...)` warning in the FormWizard
test. No check or baseline was weakened. Publication, deployment and package release were not run.
