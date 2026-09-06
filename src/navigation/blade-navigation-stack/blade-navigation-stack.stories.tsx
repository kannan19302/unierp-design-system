import type { Meta, StoryObj } from "@storybook/react";
import { BladeNavigationStack } from "./blade-navigation-stack";

const meta: Meta<typeof BladeNavigationStack> = {
  title: "Navigation/BladeNavigationStack",
  component: BladeNavigationStack,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BladeNavigationStack>;

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

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};
