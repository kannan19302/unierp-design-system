import type { Meta, StoryObj } from "@storybook/react";
import { MeridianBar } from "./meridian-bar";

const meta: Meta<typeof MeridianBar> = {
  title: "Shell/MeridianBar",
  component: MeridianBar,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MeridianBar>;

export const InvoiceApproval: Story = {
  args: {
    segments: [
      { label: "acme-corp", href: "#" },
      { label: "finance", href: "#" },
      { label: "invoices", href: "#" },
      { label: "INV-2043" },
    ],
    copyable: true,
    state: { label: "Awaiting Approval", tone: "warning" },
    action: {
      label: "Approve Invoice",
      onClick: () => alert("Invoice Approved"),
    },
    scope: "app",
  },
};

export const DisabledWithReason: Story = {
  args: {
    segments: [
      { label: "acme-corp" },
      { label: "billing" },
      { label: "subscription" },
    ],
    state: { label: "Locked", tone: "danger" },
    action: {
      label: "Cancel Subscription",
      disabled: true,
      disabledReason: "Only Organization Owners can cancel plans",
    },
    scope: "manage",
  },
};
