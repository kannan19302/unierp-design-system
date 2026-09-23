import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./context-menu";
import { Edit, Trash2, Copy, Share2, Eye, ShieldAlert } from "lucide-react";

const meta: Meta<typeof ContextMenu> = {
  title: "Core/Overlays/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          padding: "var(--space-6)",
          border: "1px dashed var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg-sunken)",
          textAlign: "center",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Right-click anywhere in this zone to view options
      </div>
    ),
    items: [
      { key: "edit", label: "Edit Record", icon: <Edit size={14} />, onClick: () => {} },
      { key: "copy", label: "Copy Reference", icon: <Copy size={14} />, onClick: () => {} },
      { key: "share", label: "Share Access", icon: <Share2 size={14} />, onClick: () => {} },
      { key: "delete", label: "Delete Record", icon: <Trash2 size={14} />, danger: true, onClick: () => {} },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        ContextMenu attaches context-menu listeners to its child container and renders menu items via Portal.
      </p>
      <ContextMenu
        items={[
          { key: "view", label: "Inspect Ledger", icon: <Eye size={14} />, onClick: () => {} },
          { key: "copy", label: "Duplicate Row", icon: <Copy size={14} />, onClick: () => {} },
          { key: "restricted", label: "Audit Log (Restricted)", icon: <ShieldAlert size={14} />, disabled: true },
          { key: "delete", label: "Purge Entity", icon: <Trash2 size={14} />, danger: true, onClick: () => {} },
        ]}
      >
        <div
          style={{
            padding: "var(--space-8)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-surface)",
            textAlign: "center",
          }}
        >
          <strong style={{ display: "block", color: "var(--color-text-primary)" }}>Enterprise Ledger Row #4092</strong>
          <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>
            Secondary click to inspect options
          </span>
        </div>
      </ContextMenu>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <ContextMenu
        items={[
          { key: "edit", label: "Quick Edit", icon: <Edit size={14} /> },
          { key: "view", label: "View Details", icon: <Eye size={14} /> },
        ]}
      >
        <div
          style={{
            padding: "var(--space-6)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-bg-surface)",
            textAlign: "center",
          }}
        >
          Active Target A (Standard Actions)
        </div>
      </ContextMenu>
      <ContextMenu
        items={[
          { key: "disabled", label: "Export PDF (Locked)", disabled: true },
          { key: "danger", label: "Delete permanently", danger: true, icon: <Trash2 size={14} /> },
        ]}
      >
        <div
          style={{
            padding: "var(--space-6)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-bg-sunken)",
            textAlign: "center",
          }}
        >
          Active Target B (Danger / Disabled States)
        </div>
      </ContextMenu>
    </div>
  ),
};
