import type { Meta, StoryObj } from "@storybook/react";
import { DemoBanner } from "./demo-banner";

const meta: Meta<typeof DemoBanner> = {
  title: "Notifications/DemoBanner",
  component: DemoBanner,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof DemoBanner>;

export const GlobalNotice: Story = {
  args: {
    apiBase: "/api/v1",
  },
};

export const ModuleSpecificNotice: Story = {
  args: {
    currentModule: "Inventory & Supply Chain",
    apiBase: "/api/v1",
  },
};
