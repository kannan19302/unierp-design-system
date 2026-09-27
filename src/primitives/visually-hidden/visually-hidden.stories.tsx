import type { Meta, StoryObj } from "@storybook/react";
import { VisuallyHidden } from "./visually-hidden";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Core/Primitives/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  args: {
    children: "Hidden accessible announcement for screen readers",
  },
};
