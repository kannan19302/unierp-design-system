import type { Meta, StoryObj } from "@storybook/react";
import { DemoBanner } from "./demo-banner";

const meta: Meta<typeof DemoBanner> = {
  title: "Notifications/DemoBanner",
  component: DemoBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DemoBanner>;

export const Default: Story = {
  args: {
    currentModule: "Finance",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <DemoBanner currentModule="Procurement" />
      <div style={{ padding: "var(--space-4)" }}>
        <h3>Procurement Workspace</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Notice banner alerts users that transactions in this tenant are demonstration fixtures.
        </p>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <DemoBanner />
      <DemoBanner currentModule="Sales Cloud" />
    </div>
  ),
};
