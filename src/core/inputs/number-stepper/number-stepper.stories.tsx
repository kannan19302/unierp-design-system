import type { Meta, StoryObj } from "@storybook/react";
import { NumberStepper } from "./number-stepper";

/**
 * ## NumberStepper Primitive
 *
 * Compact stepper control pairing increment/decrement buttons with a direct numerical input field,
 * engineered for batch sizing, quantities, warehouse pack counts, and threshold parameters.
 *
 * ### Key Capabilities
 * - **Dual Interaction Modes**: Click stepper buttons or type directly with numerical keypad.
 * - **Precision Clamping**: Respects configured `min`, `max`, `step`, and decimal `precision`.
 * - **Keyboard Stepping**: Native `ArrowUp` and `ArrowDown` keys seamlessly increment and decrement.
 */
const meta: Meta<typeof NumberStepper> = {
  title: "Core/Inputs/NumberStepper",
  component: NumberStepper,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise number stepper input with plus/minus increment buttons, arrow-key stepping, and precision bounds clamping.",
      },
    },
  },
  argTypes: {
    value: { control: "number", description: "Controlled numerical value." },
    defaultValue: { control: "number", description: "Initial uncontrolled numerical value." },
    min: { control: "number", description: "Minimum allowable value." },
    max: { control: "number", description: "Maximum allowable value." },
    step: { control: "number", description: "Amount incremented or decremented per click." },
    precision: { control: "number", description: "Number of decimal digits allowed." },
    size: { control: "select", options: ["sm", "md", "lg"], description: "Height and button sizing tier." },
    density: { control: "select", options: ["ultra-compact", "compact", "standard", "comfortable"], description: "4-tier density scaling." },
    disabled: { control: "boolean", description: "Disables buttons and input editing." },
    invalid: { control: "boolean", description: "Marks input as having an error." },
  },
};

export default meta;
type Story = StoryObj<typeof NumberStepper>;

export const Default: Story = {
  args: {
    label: "Batch Reorder Quantity",
    defaultValue: 10,
    min: 1,
    max: 100,
    step: 1,
  },
};

export const Small: Story = {
  args: {
    label: "Items per Carton",
    defaultValue: 5,
    size: "sm",
    min: 0,
    max: 20,
  },
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "440px" }}>
    <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Manufacturing Run Configuration
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <NumberStepper
          label="Production Run Batches (Min 1, Max 50)"
          defaultValue={12}
          min={1}
          max={50}
          step={1}
        />
        <NumberStepper
          label="Buffer Allowance Margin (%)"
          defaultValue={2.5}
          min={0}
          max={15}
          step={0.5}
          precision={1}
        />
      </div>
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, sizing, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Size Hierarchy (sm, md, lg)
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <NumberStepper label="Small Stepper (sm)" defaultValue={5} size="sm" />
        <NumberStepper label="Standard Stepper (md)" defaultValue={25} size="md" />
        <NumberStepper label="Large Stepper (lg)" defaultValue={100} size="lg" />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Boundary & Disabled States
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <NumberStepper label="At Minimum Bound (Minus Button Disabled)" defaultValue={0} min={0} max={10} />
        <NumberStepper label="At Maximum Bound (Plus Button Disabled)" defaultValue={10} min={0} max={10} />
        <NumberStepper label="Disabled Stepper" defaultValue={50} disabled />
        <NumberStepper label="Read-Only Stepper" defaultValue={75} readOnly />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberStepper label="Ultra-Compact (24px) Stepper" defaultValue={10} size="sm" />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberStepper label="Compact (28px) Stepper" defaultValue={20} size="sm" />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberStepper label="Standard (32px) Stepper" defaultValue={50} size="md" />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberStepper label="Comfortable (40px) Stepper" defaultValue={100} size="lg" />
        </div>
      </div>
    </div>
  </div>
);

export const V1WorkspacePreview = () => (
  <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "600px" }}>
    <div style={{ marginBottom: "var(--space-4)" }}>
      <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
        Purchase Order Batch Allocation
      </h3>
      <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Configure production run lot allocations and inventory thresholds with precision boundary stepping.
      </p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <NumberStepper
        label="Units per Pallet"
        defaultValue={48}
        min={1}
        max={144}
        step={12}
        density="standard"
        required
      />
      <NumberStepper
        label="Sample Rate (%)"
        defaultValue={2.5}
        min={0.5}
        max={10}
        step={0.5}
        precision={1}
        density="standard"
      />
    </div>

    <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", alignSelf: "center" }}>
        Total lot units calculated automatically
      </div>
    </div>
  </div>
);

export const StateMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "500px" }}>
    <NumberStepper label="Default State" defaultValue={10} min={0} max={100} />
    <NumberStepper label="Invalid / Error State" defaultValue={0} min={1} max={100} invalid error="Minimum order quantity is 1" />
    <NumberStepper label="Disabled State" defaultValue={25} disabled />
    <NumberStepper label="Read-Only State" defaultValue={50} readOnly />
  </div>
);
