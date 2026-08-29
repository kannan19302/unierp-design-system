import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./modal";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
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
        <p>Ensure that the voucher conforms to IFRS-9 standard before submission.</p>
      </div>
    ),
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Commit Voucher</Button>
      </>
    ),
  },
};

export const DestructiveConfirm = () => (
  <ConfirmDialog
    open={true}
    onClose={() => {}}
    onConfirm={() => {}}
    title="Delete Fiscal Calendar"
    message="This action is irreversible. All unposted draft periods in FY2026 will be permanently purged."
    confirmLabel="Delete Period"
    variant="danger"
  />
);
