import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Primitives/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: "General Ledger", variant: "default" },
};

export const Removable: Story = {
  args: {
    children: "Fiscal 2026",
    variant: "primary",
    onRemove: () => alert("Tag removed"),
  },
};

export const Palette = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <Tag variant="default">Default</Tag>
    <Tag variant="primary">Primary</Tag>
    <Tag variant="success">Success</Tag>
    <Tag variant="warning">Warning</Tag>
    <Tag variant="danger">Danger</Tag>
    <Tag variant="info">Info</Tag>
  </div>
);
