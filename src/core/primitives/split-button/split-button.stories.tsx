import type { Meta, StoryObj } from "@storybook/react";
import { Save, Download, Printer, Share2, Trash2 } from "lucide-react";
import { SplitButton } from "./split-button";

const meta: Meta<typeof SplitButton> = {
  title: "Core/Primitives/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dual-action compound button combining a primary immediate trigger with a secondary contextual dropdown menu for related operations.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
      description: "Visual hierarchy and semantic tone.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Ergonomic control height conforming to 4-tier density.",
    },
    disabled: {
      control: "boolean",
      description: "Disables both the primary action and dropdown trigger.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {
  args: {
    label: "Save & Publish",
    icon: <Save size={14} />,
    onClick: () => alert("Primary Save clicked"),
    items: [
      { id: "draft", label: "Save as Draft", onClick: () => alert("Draft saved") },
      { id: "template", label: "Save as Template", onClick: () => alert("Template saved") },
      { id: "export", label: "Export to JSON", icon: <Download size={14} />, onClick: () => alert("Exported") },
    ],
  },
};

export const SecondaryVariant: Story = {
  args: {
    label: "Export Report",
    variant: "secondary",
    icon: <Download size={14} />,
    onClick: () => alert("Export clicked"),
    items: [
      { id: "pdf", label: "Print to PDF", icon: <Printer size={14} />, onClick: () => alert("PDF") },
      { id: "share", label: "Share via Link", icon: <Share2 size={14} />, onClick: () => alert("Shared") },
    ],
  },
};

export const DangerVariant: Story = {
  args: {
    label: "Delete Record",
    variant: "danger",
    icon: <Trash2 size={14} />,
    onClick: () => alert("Delete clicked"),
    items: [
      { id: "archive", label: "Archive Instead", onClick: () => alert("Archived") },
      { id: "purge", label: "Permanently Purge", danger: true, onClick: () => alert("Purged") },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked Action",
    disabled: true,
    onClick: () => {},
    items: [{ id: "1", label: "Item 1", onClick: () => {} }],
  },
};

export const VariantsMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <SplitButton
      label="Publish Invoice"
      variant="primary"
      onClick={() => alert("Published")}
      items={[
        { id: "1", label: "Schedule Release", onClick: () => {} },
        { id: "2", label: "Export PDF", onClick: () => {} },
      ]}
    />
    <SplitButton
      label="Generate Report"
      variant="secondary"
      onClick={() => alert("Generated")}
      items={[
        { id: "1", label: "Export Excel", onClick: () => {} },
        { id: "2", label: "Email to Board", onClick: () => {} },
      ]}
    />
    <SplitButton
      label="Delete Batch"
      variant="danger"
      onClick={() => alert("Deleted")}
      items={[
        { id: "1", label: "Archive Batch", onClick: () => {} },
        { id: "2", label: "Purge Audit Log", danger: true, onClick: () => {} },
      ]}
    />
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Primary Action Button + Hairline Divider + Dropdown Chevron Trigger + Dropdown Menu
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <SplitButton
        label="Post Journal Entry"
        icon={<Save size={14} />}
        variant="primary"
        onClick={() => {}}
        items={[
          { id: "save-draft", label: "Save as Draft", onClick: () => {} },
          { id: "save-template", label: "Save as Recurring Template", onClick: () => {} },
        ]}
      />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: Visual Hierarchies */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Hierarchies (Primary, Secondary, Danger)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
        <SplitButton
          label="Primary Action"
          variant="primary"
          onClick={() => {}}
          items={[{ id: "1", label: "Option A", onClick: () => {} }]}
        />
        <SplitButton
          label="Secondary Action"
          variant="secondary"
          onClick={() => {}}
          items={[{ id: "1", label: "Option A", onClick: () => {} }]}
        />
        <SplitButton
          label="Danger Action"
          variant="danger"
          onClick={() => {}}
          items={[{ id: "1", label: "Option A", onClick: () => {} }]}
        />
      </div>
    </div>

    {/* Row 2: Interaction States */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Interactive States (Default, With Icon, Disabled)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
        <SplitButton
          label="With Leading Icon"
          icon={<Download size={14} />}
          variant="secondary"
          onClick={() => {}}
          items={[{ id: "1", label: "Export CSV", onClick: () => {} }]}
        />
        <SplitButton
          label="Disabled SplitButton"
          disabled
          variant="primary"
          onClick={() => {}}
          items={[{ id: "1", label: "Unavailable", onClick: () => {} }]}
        />
      </div>
    </div>

    {/* Row 3: Sizing Tiers */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Density Sizing Tiers (sm: 28px, md: 32px, lg: 40px)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <SplitButton size="sm" label="Compact (28px)" onClick={() => {}} items={[{ id: "1", label: "Item", onClick: () => {} }]} />
        <SplitButton size="md" label="Standard (32px)" onClick={() => {}} items={[{ id: "1", label: "Item", onClick: () => {} }]} />
        <SplitButton size="lg" label="Comfortable (40px)" onClick={() => {}} items={[{ id: "1", label: "Item", onClick: () => {} }]} />
      </div>
    </div>
  </div>
);

