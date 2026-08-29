import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./drawer";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightInspector: Story = {
  args: {
    open: true,
    title: "Account Line Inspector",
    side: "right",
    size: "md",
    children: (
      <div>
        <p>Displaying transaction audit breakdown and sub-ledger details.</p>
      </div>
    ),
    footer: <Button variant="primary">Save Changes</Button>,
  },
};

export const LeftNavigation: Story = {
  args: {
    open: true,
    title: "Module Navigation",
    side: "left",
    size: "sm",
    children: <div>Navigation Links</div>,
  },
};
