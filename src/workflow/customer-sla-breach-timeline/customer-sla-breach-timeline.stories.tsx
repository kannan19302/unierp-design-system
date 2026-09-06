import type { Meta, StoryObj } from "@storybook/react";
import { CustomerSlaBreachTimeline } from "./customer-sla-breach-timeline";

const meta: Meta<typeof CustomerSlaBreachTimeline> = {
  title: "Workflow/CustomerSlaBreachTimeline",
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
