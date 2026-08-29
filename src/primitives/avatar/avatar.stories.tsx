import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: "Kannan Admin",
    size: "md",
  },
};

export const PaletteMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <Avatar name="Alice Johnson" colorIndex={0} />
    <Avatar name="Bob Smith" colorIndex={1} />
    <Avatar name="Charlie Davis" colorIndex={2} />
    <Avatar name="Diana Prince" colorIndex={3} />
    <Avatar name="Evan Wright" colorIndex={4} />
    <Avatar name="Fiona Gallagher" colorIndex={5} />
    <Avatar name="George Clark" colorIndex={6} />
    <Avatar name="Hannah Abbott" colorIndex={7} />
  </div>
);

export const Group = () => (
  <AvatarGroup>
    <Avatar name="Alice Johnson" colorIndex={0} />
    <Avatar name="Bob Smith" colorIndex={1} />
    <Avatar name="Charlie Davis" colorIndex={2} />
    <Avatar name="Diana Prince" colorIndex={3} />
  </AvatarGroup>
);
