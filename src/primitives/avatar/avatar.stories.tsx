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
    <Avatar name="Alice Johnson" />
    <Avatar name="Bob Smith" />
    <Avatar name="Charlie Davis" />
    <Avatar name="Diana Prince" />
    <Avatar name="Evan Wright" />
    <Avatar name="Fiona Gallagher" />
    <Avatar name="George Clark" />
    <Avatar name="Hannah Abbott" />
  </div>
);

export const ShapeAndPresence = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Avatar name="Sarah Connor" presence="online" size="md" />
    <Avatar name="John Doe" presence="busy" size="lg" />
    <Avatar name="Platform Engineering" shape="square" size="md" />
    <Avatar name="DevOps Workspace" shape="square" presence="away" size="lg" />
  </div>
);

export const Group = () => (
  <AvatarGroup>
    <Avatar name="Alice Johnson" />
    <Avatar name="Bob Smith" />
    <Avatar name="Charlie Davis" />
    <Avatar name="Diana Prince" />
  </AvatarGroup>
);
