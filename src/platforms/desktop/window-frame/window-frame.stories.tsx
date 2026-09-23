import type { Meta, StoryObj } from "@storybook/react";
import { WindowFrame } from "./window-frame";

const meta: Meta<typeof WindowFrame> = {
  title: "Platforms/Desktop/WindowFrame",
  component: WindowFrame,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WindowFrame>;

export const Default: Story = {
  args: {
    children: <div>Window main content body</div>,
    sidebar: <div style={{ padding: "12px" }}>Desktop Navigation</div>,
  },
};
