import type { Meta, StoryObj } from "@storybook/react";
import { SavedViewSwitcher } from "./saved-view-switcher";

const meta: Meta<typeof SavedViewSwitcher> = {
  title: "Navigation/SavedViewSwitcher",
  component: SavedViewSwitcher,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SavedViewSwitcher>;

export const Default: Story = {
  args: {
    activeViewId: "unposted",
    views: [
      { id: "all", name: "All Vouchers (Default)" },
      { id: "unposted", name: "Unposted Drafts" },
      { id: "overdue", name: "Overdue Receivables" },
      { id: "audit_flagged", name: "Auditor Flagged" },
    ],
  },
};
