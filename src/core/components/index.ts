"use client";

// ─────────────────────────────────────────────────
// @kannan19302/ui/components — Backward Compatibility Re-Export Shim
// Re-exports all atomic primitives, inputs, overlays, navigation, data-display, forms, and layout.
// ─────────────────────────────────────────────────

export * from "../primitives";
export * from "../inputs";
export * from "../overlays";
export * from "../navigation";
export * from "../data-display";
export * from "../forms";
export * from "../layout";

// Explicitly resolve re-export ambiguity for V3 primitives
export {
  Input,
  type InputProps,
  Textarea,
  type TextareaProps,
  Collapsible,
  type CollapsibleProps,
} from "../primitives";
