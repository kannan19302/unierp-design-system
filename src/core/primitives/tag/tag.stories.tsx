import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Core/Primitives/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compact interactive token for categorization, filtering tags, multi-select values, and contextual attributes with optional removal triggers.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info"],
      description: "Semantic color classification tone.",
      table: {
        type: { summary: "default | primary | success | warning | danger | info" },
        defaultValue: { summary: "default" },
      },
    },
    shape: {
      control: "radio",
      options: ["rounded", "pill"],
      description: "Border-radius styling (rounded: 6px, pill: capsule).",
      table: {
        type: { summary: "rounded | pill" },
        defaultValue: { summary: "rounded" },
      },
    },
    onRemove: {
      action: "removed",
      description: "Optional dismiss callback displaying a circular removal button.",
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

export const Shapes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Tag shape="rounded" variant="primary">Rounded Tag</Tag>
      <Tag shape="rounded" variant="success" onRemove={() => {}}>Removable</Tag>
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Tag shape="pill" variant="primary">Capsule Pill</Tag>
      <Tag shape="pill" variant="warning" onRemove={() => {}}>Removable Pill</Tag>
    </div>
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Tag Enclosure Container + Text Label + Hover-Aware Remove Cross Button
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Tag shape="rounded" variant="primary">Filter: Active Tenants</Tag>
      <Tag shape="rounded" variant="success" onRemove={() => {}}>Region: EU-Central</Tag>
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: All Semantic Tones */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Semantic Tones
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <Tag variant="default">Default</Tag>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="danger">Danger</Tag>
        <Tag variant="info">Info</Tag>
      </div>
    </div>

    {/* Row 2: Removable Filter Chips */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Interactive Removable Chips (Pill & Rounded)
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <Tag shape="rounded" variant="primary" onRemove={() => {}}>Status: Posted</Tag>
        <Tag shape="rounded" variant="success" onRemove={() => {}}>Verified</Tag>
        <Tag shape="pill" variant="warning" onRemove={() => {}}>Pending Audit</Tag>
        <Tag shape="pill" variant="danger" onRemove={() => {}}>Rejected</Tag>
      </div>
    </div>
  </div>
);

