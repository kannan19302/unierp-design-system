# UniERP Design System Migration Guide

## 1. Overview
This guide provides the official migration pathway for moving from legacy unsegmented package imports or consumer-local components to the canonical `@kannan19302/ui/core` and `@kannan19302/ui/platforms` structure.

## 2. Backward Compatibility Matrix

| Legacy Import Path | Reorganized Location | Status | Action Required |
| :--- | :--- | :--- | :--- |
| `@kannan19302/ui` | `@kannan19302/ui` | Fully Supported | None (re-exports all core & platforms) |
| `@kannan19302/ui/primitives` | `@kannan19302/ui/core/primitives` | Fully Supported | Optional alias migration to `/core/primitives` |
| `@kannan19302/ui/inputs` | `@kannan19302/ui/core/inputs` | Fully Supported | Optional alias migration to `/core/inputs` |
| `@kannan19302/ui/data-grid` | `@kannan19302/ui/core/data-grid` | Fully Supported | Optional alias migration to `/core/data-grid` |
| `@kannan19302/ui/shell` | `@kannan19302/ui/core/shell` | Fully Supported | Optional alias migration to `/core/shell` |
| `@kannan19302/ui/navigation` | `@kannan19302/ui/core/navigation` | Fully Supported | Optional alias migration to `/core/navigation` |
| `@kannan19302/ui/overlays` | `@kannan19302/ui/core/overlays` | Fully Supported | Optional alias migration to `/core/overlays` |
| `@kannan19302/ui/forms` | `@kannan19302/ui/core/forms` | Fully Supported | Optional alias migration to `/core/forms` |

## 3. Platform Presentation Imports (New Canonical Paths)

| Platform | Canonical Design System Import |
| :--- | :--- |
| **Provider Admin OS** | `@kannan19302/ui/platforms/provider-admin` |
| **Tenant Admin** | `@kannan19302/ui/platforms/tenant-admin` |
| **Business Suite** | `@kannan19302/ui/platforms/business-suite` |
| **Developer Platform** | `@kannan19302/ui/platforms/developer-platform` |
| **Corporate Website** | `@kannan19302/ui/platforms/marketing` |
