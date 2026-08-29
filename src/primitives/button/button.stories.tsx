import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Plus, ArrowRight, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Action",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Action",
    variant: "secondary",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Action",
    variant: "outline",
    size: "md",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Action",
    variant: "ghost",
    size: "md",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete Record",
    variant: "danger",
    size: "md",
    leftIcon: <Trash2 size={14} />,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Create Order",
    variant: "primary",
    leftIcon: <Plus size={14} />,
    rightIcon: <ArrowRight size={14} />,
  },
};

export const Loading: Story = {
  args: {
    children: "Saving Record...",
    variant: "primary",
    isLoading: true,
  },
};
