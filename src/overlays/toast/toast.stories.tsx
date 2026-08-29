import type { Meta } from "@storybook/react";
import { ToastProvider, useToast } from "./toast";
import { Button } from "../../primitives/button";

const meta: Meta = {
  title: "Overlays/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
};

export default meta;

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

export const Interactive = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);
