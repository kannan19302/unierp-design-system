import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider, type SliderProps } from "./slider";

/**
 * ## Slider Primitive
 *
 * Accessible continuous and stepped range slider for adjusting percentages, thresholds,
 * allocation ratios, and rollout increments.
 *
 * ### Key Capabilities
 * - **W3C Range Semantics**: Native HTML range input with aria-valuemin, aria-valuemax, and aria-valuenow.
 * - **Value Readout**: Integrated numerical readout display badge.
 * - **Step Snapping**: Granular stepped increments for defined financial percentage thresholds.
 */
const meta: Meta<typeof Slider> = {
  title: "Core/Inputs/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise range slider input supporting continuous values, stepped snap points, numerical readout displays, and density scaling.",
      },
    },
  },
  argTypes: {
    min: { control: "number", description: "Minimum selectable range value." },
    max: { control: "number", description: "Maximum selectable range value." },
    step: { control: "number", description: "Granular stepping increment for value snapping." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted track styling." },
    showValue: { control: "boolean", description: "Renders numerical badge showing current value." },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

function InteractiveSlider(props: Partial<SliderProps>) {
  const [val, setVal] = useState(props.value ?? 60);
  return <Slider value={val} onChange={setVal} showValue {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveSlider value={60} />,
};

export const Stepped: Story = {
  render: () => <InteractiveSlider min={0} max={100} step={25} value={50} />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [reserve, setReserve] = useState(35);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)", color: "var(--color-text-primary)" }}>
            Cash Reserve Liquidity Ratio
          </span>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--color-primary)" }}>
            {reserve}% Target
          </span>
        </div>
        <Slider
          value={reserve}
          onChange={setReserve}
          min={10}
          max={90}
          step={5}
          showValue
          aria-label="Cash reserve liquidity ratio"
        />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)", display: "block" }}>
          Recommended enterprise buffer: 25% - 40% of trailing quarterly OPEX.
        </span>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, stepped, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Continuous & Stepped States
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Continuous Range (0 - 100)</span>
          <Slider value={42} showValue />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Discrete Step (Quarterly Quarters: 25% increments)</span>
          <Slider value={75} step={25} showValue />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Slider</span>
          <Slider value={50} disabled showValue />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Slider value={30} showValue />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Slider value={45} showValue />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Slider value={60} showValue />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Slider value={80} showValue />
        </div>
      </div>
    </div>
  </div>
);
