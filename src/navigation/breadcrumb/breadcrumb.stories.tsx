import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Finance", href: "#" },
      { label: "General Ledger", href: "#" },
      { label: "Journal Entries", href: "#" },
      { label: "JV-2026-0048" },
    ],
  },
};
