import type { Meta, StoryObj } from "@storybook/react";
import { MobileActionSheet } from "./mobile-action-sheet";

const meta: Meta<typeof MobileActionSheet> = {
  title: "Platforms/Mobile/MobileActionSheet/MobileActionSheet",
  component: MobileActionSheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MobileActionSheet>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Invoice Actions",
  },
};
