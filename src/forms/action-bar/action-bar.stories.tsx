import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "./action-bar";
import { Plus, Download, Printer, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "../../primitives/button";

const meta: Meta<typeof ActionBar> = {
  title: "Forms/ActionBar",
  component: ActionBar,
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
      description: "Number of currently selected records triggering bulk mode",
    },
    primaryAction: {
      description: "Main affirmative or committing action",
    },
    secondaryActions: {
      description: "Auxiliary actions presented as secondary buttons",
    },
    aiAction: {
      description: "Autonomous or generative AI suggestion action",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  args: {
    primaryAction: {
      key: "new",
      label: "New Journal Voucher",
      icon: <Plus size={14} />,
      onClick: () => {},
    },
    secondaryActions: [
      { key: "export", label: "Export CSV", icon: <Download size={14} /> },
      { key: "print", label: "Print Trial Balance", icon: <Printer size={14} /> },
    ],
    aiAction: {
      key: "ai_reconcile",
      label: "Auto-Match Invoices (AI)",
      onClick: () => {},
    },
  },
};

export const BulkMode: Story = {
  args: {
    selectedCount: 8,
    onClearSelection: () => {},
    bulkActions: (
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button variant="danger" size="sm">
          <Trash2 size={14} />
          <span>Delete Selected</span>
        </Button>
        <Button variant="primary" size="sm">
          <CheckCircle2 size={14} />
          <span>Post Batch</span>
        </Button>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h4>Anatomy and Composition</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          ActionBar orchestrates leading context indicators, AI copilots, secondary actions, and
          high-salience primary mutations, morphing into a bulk toolbar when records are selected.
        </p>
        <ActionBar
          leading={<span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>142 Invoices Loaded</span>}
          primaryAction={{
            key: "create",
            label: "Create Invoice",
            icon: <Plus size={14} />,
          }}
          secondaryActions={[
            { key: "export", label: "Export", icon: <Download size={14} /> },
          ]}
          aiAction={{
            key: "audit",
            label: "Audit Anomalies",
          }}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Mode (Primary + Secondary + AI)</h5>
          <ActionBar
            primaryAction={{ key: "save", label: "Save Changes" }}
            secondaryActions={[
              { key: "revert", label: "Revert" },
              { key: "history", label: "Version History" },
            ]}
            aiAction={{ key: "optimize", label: "Suggest Optimization" }}
          />
        </div>

        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Primary Only</h5>
          <ActionBar
            primaryAction={{ key: "submit", label: "Submit Purchase Order" }}
          />
        </div>

        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Bulk Selection Mode</h5>
          <ActionBar
            selectedCount={14}
            onClearSelection={() => {}}
            bulkActions={
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="danger" size="sm">Archive All</Button>
                <Button variant="primary" size="sm">Approve All</Button>
              </div>
            }
          />
        </div>
      </div>
    );
  },
};
