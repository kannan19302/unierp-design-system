import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider, useToast } from "./toast";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Toast> = {
  title: "Overlays/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastDemo = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <Button
        variant="primary"
        onClick={() => success("Journal Posted", "Transaction #9812 verified successfully.")}
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="danger"
        onClick={() => error("Posting Failed", "Fiscal period FY2026-Q1 is permanently locked.")}
      >
        Trigger Error Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => warning("Ledger Imbalance", "Total debits deviate from credits by $0.05.")}
      >
        Trigger Warning Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => info("Sync Completed", "Exchange rates updated from ECB.")}
      >
        Trigger Info Toast
      </Button>
    </div>
  );
};

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    variant: "success",
    title: "Transaction Approved",
    description: "Voucher JE-2026-089 committed to general ledger.",
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "360px" }}>
      <Toast
        variant="success"
        title="Operation Successful"
        description="Database replica synchronization completed."
      />
      <Toast
        variant="error"
        title="Access Denied"
        description="User lacks permission 'finance.journals.post'."
      />
      <Toast
        variant="warning"
        title="Threshold Warning"
        description="Storage utilization exceeded 85%."
      />
      <Toast
        variant="info"
        title="Background Job Running"
        description="Exporting 14,200 records to CSV format."
      />
    </div>
  ),
};

