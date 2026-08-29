import type { Meta, StoryObj } from "@storybook/react";
import { Presence } from "./presence";

const meta: Meta<typeof Presence> = {
  title: "Primitives/Presence",
  component: Presence,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["online", "offline", "busy", "away"],
    },
    showLabel: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Presence>;

export const Online: Story = {
  args: { status: "online", showLabel: true },
};

export const Busy: Story = {
  args: { status: "busy", showLabel: true },
};

export const Away: Story = {
  args: { status: "away", showLabel: true },
};

export const Offline: Story = {
  args: { status: "offline", showLabel: true },
};
