import type { Meta, StoryObj } from "@storybook/react";
import { AppLauncherWaffleGrid } from "./app-launcher-waffle-grid";

const meta: Meta<typeof AppLauncherWaffleGrid> = {
  title: "Navigation/AppLauncherWaffleGrid",
  component: AppLauncherWaffleGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppLauncherWaffleGrid>;

export const Default: Story = {
  args: {
    isOpenByDefault: false,
    density: "compact",
  },
};

export const OpenByDefault: Story = {
  args: {
    isOpenByDefault: true,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    isOpenByDefault: true,
    density: "ultra-compact",
  },
};
