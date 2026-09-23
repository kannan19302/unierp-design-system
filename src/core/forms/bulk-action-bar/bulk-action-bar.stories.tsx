import type { Meta, StoryObj } from "@storybook/react";
import { BulkActionBar, ContextualSaveBar } from "./bulk-action-bar";
import { Button } from "../../primitives/button";

const meta: Meta<typeof BulkActionBar> = {
  title: "Core/Forms/BulkActionBar",
  component: BulkActionBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
  argTypes: {
    selectedCount: {
      control: "number",
      description: "Count of selected records triggering bar display",
    },
    actions: {
      description: "ReactNode button groups rendered on the right side",
    },
    onClearSelection: {
      action: "selectionCleared",
      description: "Callback invoked when operator hits Clear Selection",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

export const Default: Story = {
  args: {
    selectedCount: 12,
    onClearSelection: () => {},
    actions: (
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button variant="outline" size="sm">Export Selected</Button>
        <Button variant="danger" size="sm">Purge Records</Button>
      </div>
    ),
  },
};

export const ContextualSave: Story = {
  render: () => (
    <ContextualSaveBar
      visible={true}
      message="5 line items modified in General Ledger #GL-2026-004"
      onSave={() => {}}
      onDiscard={() => {}}
    />
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        BulkActionBar encapsulates selection quantity badge, deselect control, and polymorphic action slots.
        ContextualSaveBar floats with pulse status dot for uncommitted workspace states.
      </p>
      <BulkActionBar
        selectedCount={5}
        onClearSelection={() => {}}
        actions={
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button size="sm" variant="secondary">Change Status</Button>
            <Button size="sm" variant="primary">Batch Dispatch</Button>
          </div>
        }
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Single Item Selected</h5>
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          actions={<Button size="sm" variant="outline">Print Summary</Button>}
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Multiple Items (High Volume)</h5>
        <BulkActionBar
          selectedCount={248}
          onClearSelection={() => {}}
          actions={
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button size="sm" variant="outline">Export CSV</Button>
              <Button size="sm" variant="primary">Generate Invoices</Button>
            </div>
          }
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Contextual Save Bar (Active Unsaved)</h5>
        <ContextualSaveBar
          visible={true}
          message="Unsaved depreciation schedule parameters"
          onSave={() => {}}
          onDiscard={() => {}}
        />
      </div>
    </div>
  ),
};
