import type { Meta, StoryObj } from "@storybook/react";
import { SubTabBar } from "./sub-tab-bar";

const meta: Meta<typeof SubTabBar> = {
  title: "Navigation/SubTabBar",
  component: SubTabBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubTabBar>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "overview", label: "Overview", href: "/overview" },
      { id: "lines", label: "Voucher Lines", href: "/lines" },
      { id: "tax", label: "Tax Breakdown", href: "/tax" },
      { id: "audit", label: "Audit Log", href: "/audit" },
    ],
  },
};
