import type { Meta, StoryObj } from "@storybook/react";
import { CustomerSlaBreachTimeline } from "./customer-sla-breach-timeline";

const meta: Meta<typeof CustomerSlaBreachTimeline> = {
  title: "Platforms/BusinessSuite/LegalOps/CustomerSlaBreachTimeline",
  component: CustomerSlaBreachTimeline,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomerSlaBreachTimeline>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    accountName: "Citigroup Global Technology Operations",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Customer SLA Timeline & Penalty Matrix</h4>
        <CustomerSlaBreachTimeline density="compact" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Compact Density</h4>
        <CustomerSlaBreachTimeline density="compact" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Ultra-Compact Density</h4>
        <CustomerSlaBreachTimeline density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density</h4>
        <CustomerSlaBreachTimeline density="comfortable" />
      </div>
    </div>
  ),
};
