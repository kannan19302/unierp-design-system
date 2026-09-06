import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalSignatureForm } from "./approval-signature-form";

const meta: Meta<typeof ApprovalSignatureForm> = {
  title: "Forms/ApprovalSignatureForm",
  component: ApprovalSignatureForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ApprovalSignatureForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ApprovalSignatureForm signerName="John Smith" documentTitle="Purchase Order #PO-2026-0891" />
    </div>
  ),
};
