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

export const SizesAndShapes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Circular Sizes (xs, sm, md, lg, xl)</div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Avatar name="Jane Doe" size="xs" />
        <Avatar name="Jane Doe" size="sm" />
        <Avatar name="Jane Doe" size="md" />
        <Avatar name="Jane Doe" size="lg" />
        <Avatar name="Jane Doe" size="xl" />
      </div>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Rounded Square Sizes with Presence</div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Avatar name="Platform Engineering" shape="square" size="xs" presence="online" />
        <Avatar name="Platform Engineering" shape="square" size="sm" presence="online" />
        <Avatar name="Platform Engineering" shape="square" size="md" presence="busy" />
        <Avatar name="Platform Engineering" shape="square" size="lg" presence="away" />
        <Avatar name="Platform Engineering" shape="square" size="xl" presence="offline" />
      </div>
    </div>
  </div>
);

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

export const GroupSizesAndExcess = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Small Team (max 3, size sm)</div>
      <AvatarGroup max={3} size="sm">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
        <Avatar name="Evan Wright" />
      </AvatarGroup>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Default Team (max 4, size md)</div>
      <AvatarGroup max={4} size="md">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
        <Avatar name="Evan Wright" />
        <Avatar name="Fiona Gallagher" />
      </AvatarGroup>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Leadership Stack (max 3, size lg)</div>
      <AvatarGroup max={3} size="lg">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
      </AvatarGroup>
    </div>
  </div>
);
