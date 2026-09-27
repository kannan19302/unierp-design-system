import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./modal";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Modal> = {
  title: "Core/Overlays/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    open: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    title: "Post Journal Voucher",
    description: "Verify fiscal period and balanced debit/credit lines before final ledger commit.",
    children: (
      <div>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>Ensure that the voucher conforms to IFRS-9 standard before submission.</p>
      </div>
    ),
    footer: (
      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", width: "100%" }}>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Commit Voucher</Button>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "400px", position: "relative" }}>
      <Modal
        open={true}
        onClose={() => {}}
        title="Promote Build to Production"
        description="Verify quality gates and zero critical vulnerabilities before pipeline advancement."
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", width: "100%" }}>
            <Button variant="secondary">Abort</Button>
            <Button variant="primary">Approve &amp; Promote</Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            <strong>Modal Anatomy:</strong> [1] Scrim / Backdrop overlay with blur | [2] Dialog container with focus trap | [3] Title &amp; description header with dismiss button | [4] Scrollable body slot | [5] Action footer slot
          </div>
          <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", background: "var(--color-bg-sunken)" }}>
            Release: <strong>v2.14.0-rc3</strong> · 12 quality checks passed
          </div>
        </div>
      </Modal>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Standard Confirmation Dialog State
        </h4>
        <div style={{ height: "250px", position: "relative" }}>
          <ConfirmDialog
            open={true}
            onClose={() => {}}
            onConfirm={() => {}}
            title="Purge Audit Log Cache"
            message="This action will clear all locally cached audit records. Authoritative logs in PostgreSQL remain intact."
            confirmLabel="Purge Cache"
            variant="warning"
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Destructive Confirmation State
        </h4>
        <div style={{ height: "250px", position: "relative" }}>
          <ConfirmDialog
            open={true}
            onClose={() => {}}
            onConfirm={() => {}}
            title="Delete Fiscal Calendar"
            message="This action is irreversible. All unposted draft periods in FY2026 will be permanently purged."
            confirmLabel="Delete Period"
            variant="danger"
          />
        </div>
      </div>
    </div>
  ),
};
