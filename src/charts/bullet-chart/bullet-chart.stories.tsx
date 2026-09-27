import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BulletChart } from "./bullet-chart";

const meta: Meta<typeof BulletChart> = {
  title: "Charts/BulletChart",
  component: BulletChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    label: {
      control: "text",
    },
    actual: {
      control: "number",
    },
    target: {
      control: "number",
    },
    unit: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <BulletChart
        {...args}
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
        unit="K"
      />
    </div>
  ),
  args: {
    density: "standard",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "520px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BulletChart
        label="Quarterly Quota Target"
        actual={420}
        target={400}
        ranges={[200, 350, 500]}
        unit="k"
      />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "520px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <BulletChart
          density="ultra-compact"
          label="Revenue (Ultra-Compact)"
          actual={275}
          target={300}
          ranges={[150, 225, 350]}
          unit="K"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <BulletChart
          density="compact"
          label="Revenue (Compact)"
          actual={275}
          target={300}
          ranges={[150, 225, 350]}
          unit="K"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <BulletChart
          density="standard"
          label="Revenue (Standard)"
          actual={275}
          target={300}
          ranges={[150, 225, 350]}
          unit="K"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <BulletChart
          density="comfortable"
          label="Revenue (Comfortable)"
          actual={275}
          target={300}
          ranges={[150, 225, 350]}
          unit="K"
        />
      </div>
    </div>
  ),
};
