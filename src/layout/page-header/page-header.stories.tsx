import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Button } from "../../primitives/button";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "General Ledger Journal",
    subtitle: "Manage, verify, and post financial transaction batches for FY2026.",
    breadcrumbs: [
      { label: "Finance", href: "#" },
      { label: "Ledger", href: "#" },
      { label: "Vouchers" },
    ],
    actions: (
      <>
        <Button variant="outline">Export Batch</Button>
        <Button variant="primary">New Voucher</Button>
      </>
    ),
  },
};
