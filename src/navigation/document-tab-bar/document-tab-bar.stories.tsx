import type { Meta, StoryObj } from "@storybook/react";
import { DocumentTabBar } from "./document-tab-bar";

const meta: Meta<typeof DocumentTabBar> = {
  title: "Navigation/DocumentTabBar",
  component: DocumentTabBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DocumentTabBar>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const WithNewTabAction: Story = {
  args: {
    density: "compact",
    onNewTab: () => alert("New tab requested"),
  },
};
