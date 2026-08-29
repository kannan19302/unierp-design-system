import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Enable Two-Factor Authentication",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Automatic Database Backup (Locked)",
    checked: true,
    disabled: true,
  },
};
