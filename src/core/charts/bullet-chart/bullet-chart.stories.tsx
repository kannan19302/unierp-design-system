import type { Meta, StoryObj } from "@storybook/react";
import { BulletChart } from "./bullet-chart";

const meta: Meta<typeof BulletChart> = {
  title: "Core/Charts/BulletChart",
  component: BulletChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <BulletChart
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
        unit="K"
      />
    </div>
  ),
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

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "520px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <BulletChart
        label="Revenue"
        actual={275}
        target={300}
        ranges={[150, 225, 350]}
        unit="K"
      />
      <BulletChart
        label="Customer Satisfaction"
        actual={4.2}
        target={4.5}
        ranges={[3, 4, 5]}
      />
      <BulletChart
        label="New Clients Onboarded"
        actual={85}
        target={100}
        ranges={[50, 75, 120]}
      />
    </div>
  ),
};
