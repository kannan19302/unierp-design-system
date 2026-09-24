import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConflictResolver, type ConflictFieldDiff } from "./conflict-resolver";
import { Button } from "../../primitives/button";

const meta: Meta<typeof ConflictResolver> = {
  title: "Core/Forms/ConflictResolver",
  component: ConflictResolver,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Enterprise concurrency conflict resolution modal showing field-by-field diff between client draft and server state.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConflictResolver>;

const sampleConflicts: ConflictFieldDiff[] = [
  {
    fieldKey: "totalAmount",
    fieldLabel: "Total Invoice Amount",
    clientValue: "$12,450.00",
    serverValue: "$14,800.00",
  },
  {
    fieldKey: "paymentTerms",
    fieldLabel: "Payment Terms",
    clientValue: "Net 30",
    serverValue: "Net 60",
  },
  {
    fieldKey: "shippingStatus",
    fieldLabel: "Fulfillment Status",
    clientValue: "Ready to Dispatch",
    serverValue: "Shipped via FedEx Express",
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>
          Trigger Concurrency Conflict Modal
        </Button>
        <ConflictResolver
          open={open}
          onClose={() => setOpen(false)}
          entityName="Sales Invoice"
          recordId="INV-2026-9042"
          conflicts={sampleConflicts}
          onResolve={(values) => {
            console.log("Resolved concurrency values:", values);
          }}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Active Conflict Resolution Modal
        </h4>
        <ConflictResolver
          open={true}
          onClose={() => {}}
          entityName="Sales Invoice"
          recordId="INV-2026-9042"
          conflicts={sampleConflicts}
          onResolve={() => {}}
        />
      </div>
    </div>
  ),
};
