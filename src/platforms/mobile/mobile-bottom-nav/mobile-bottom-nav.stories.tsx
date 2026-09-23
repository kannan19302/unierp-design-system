import type { Meta, StoryObj } from "@storybook/react";
import { MobileBottomNav } from "./mobile-bottom-nav";

const meta: Meta<typeof MobileBottomNav> = {
  title: "Platforms/Mobile/MobileBottomNav/MobileBottomNav",
  component: MobileBottomNav,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MobileBottomNav>;

export const Default: Story = {
  args: {
    activeId: "orders",
  },
};
