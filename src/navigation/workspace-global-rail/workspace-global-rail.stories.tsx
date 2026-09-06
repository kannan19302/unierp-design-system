import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceGlobalRail } from "./workspace-global-rail";

const meta: Meta<typeof WorkspaceGlobalRail> = {
  title: "Navigation/WorkspaceGlobalRail",
  component: WorkspaceGlobalRail,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WorkspaceGlobalRail>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    activeSuiteId: "suite_crm",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
    activeSuiteId: "suite_bi",
  },
};
