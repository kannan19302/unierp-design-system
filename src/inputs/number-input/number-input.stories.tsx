import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput, type NumberInputProps } from "./number-input";

/**
 * ## NumberInput Primitive
 *
 * Dedicated numerical input component with strict `tabular-nums lining-nums` font formatting,
 * step increment controls, and automatic min/max clamping on blur.
 *
 * ### Key Capabilities
 * - **Tabular Digits**: Guarantees vertical columnar numeric alignment across accounting forms.
 * - **Clamping on Blur**: Automatically ensures value remains within configured `min` and `max` bounds.
 * - **Accessible Validation**: Binds `aria-invalid` when input fails business validation.
 */
const meta: Meta<typeof NumberInput> = {
  title: "Inputs/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise numerical input with tabular numbers, min/max clamping, validation styling, and density scaling.",
      },
    },
  },
  argTypes: {
    value: { control: "number", description: "Numerical value." },
    min: { control: "number", description: "Minimum allowable number." },
    max: { control: "number", description: "Maximum allowable number." },
    step: { control: "number", description: "Stepping increment for up/down navigation." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    invalid: { control: "boolean", description: "Triggers error border and sets aria-invalid." },
    placeholder: { control: "text", description: "Placeholder string." },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

function InteractiveNumberInput(props: Partial<NumberInputProps>) {
  const [val, setVal] = useState<number | undefined>(typeof props.value === "number" ? props.value : 42);
  return <NumberInput value={val} onChange={setVal} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveNumberInput value={42} placeholder="0" />,
};

export const QuantityPicker: Story = {
  render: () => <InteractiveNumberInput min={1} max={1000} step={5} value={25} />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [qty, setQty] = useState<number | undefined>(150);
  const [discount, setDiscount] = useState<number | undefined>(10);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Order Line Item Allocation
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Units to Dispatch (Min 1, Max 500)
            </label>
            <NumberInput value={qty} onChange={setQty} min={1} max={500} step={10} placeholder="0" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Volume Discount (0 - 25%)
            </label>
            <NumberInput value={discount} onChange={setDiscount} min={0} max={25} step={1} placeholder="0" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, validation, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Core Numeric Input States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Empty / Placeholder</span>
          <NumberInput placeholder="Enter count..." />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Populated Tabular Value</span>
          <NumberInput value={142850} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Invalid / Out of Bounds</span>
          <NumberInput value={9999} invalid />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Ledger Field</span>
          <NumberInput value={500} disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberInput value={100} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberInput value={250} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberInput value={500} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <NumberInput value={1000} />
        </div>
      </div>
    </div>
  </div>
);
