# UniERP Design System — Flutter Adapter

Canonical native mobile and desktop component implementations for UniERP (`@kannan19302/ui/adapters/flutter`).

## Overview
This adapter provides Flutter primitives driven directly by the Strata Design Tokens (`tokens.g.dart`), generated automatically from `src/tokens/themes/strata{,-dark}.css`.

## Components
- **`UniButton`**: Standard button primitive with primary and secondary variants, icon slots, and token-based radii.
- **`UniBadge`**: Status badge with semantic and platform color overrides.
- **`UniCard`**: Elevated container with standard borders and shadows.
- **`UniTable`**: High-density tabular layout.
- **`UniDesktopChrome`**: Native window chrome and layout shell.

## Architecture
Owned directly by the UniERP Design System repository, providing a single source of truth for cross-platform visual design across Web, Mobile (iOS/Android), and Desktop (macOS/Windows/Linux).
