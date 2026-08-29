import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./popover";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Filter Ledger</Button>,
    children: (
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)" }}>Quick Filters</h4>
        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Toggle active fiscal periods and voucher types.
        </p>
      </div>
    ),
  },
};
