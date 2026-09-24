import type { Meta, StoryObj } from "@storybook/react";
import { FormVersionHistory } from "./form-version-history";

const meta: Meta<typeof FormVersionHistory> = {
  title: "Core/Forms/FormVersionHistory",
  component: FormVersionHistory,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Audit timeline tracking immutable revisions, authors, and field-level deltas across form submissions.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormVersionHistory>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormVersionHistory
        versions={[
          { id: "v3", timestamp: "2026-09-06 12:00", author: "John Smith", changes: "Updated payment terms to Net 30", isCurrent: true },
          { id: "v2", timestamp: "2026-09-05 15:30", author: "Jane Doe", changes: "Added line items 4-6" },
          { id: "v1", timestamp: "2026-09-04 09:00", author: "John Smith", changes: "Initial creation" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 600 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Multi-version Audit History
        </h4>
        <FormVersionHistory
          versions={[
            { id: "v3", timestamp: "2026-09-06 12:00", author: "Sarah Lin (CFO)", changes: "Approved wire disbursement and locked ledger", isCurrent: true },
            { id: "v2", timestamp: "2026-09-05 15:30", author: "Marcus Vance", changes: "Adjusted tax rate rule #4 to 8.25%" },
            { id: "v1", timestamp: "2026-09-04 09:00", author: "Elena Rostova", changes: "Draft invoice created" },
          ]}
        />
      </div>
    </div>
  ),
};
