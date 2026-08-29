import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "./brand-mark";

const meta: Meta<typeof BrandMark> = {
  title: "Primitives/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    compact: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof BrandMark>;

export const Default: Story = {
  args: {
    size: "md",
    compact: false,
  },
};

export const Compact: Story = {
  args: {
    size: "md",
    compact: true,
  },
};

export const LargeHero: Story = {
  args: {
    size: "lg",
    compact: false,
  },
};
