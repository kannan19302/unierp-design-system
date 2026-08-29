import type { Meta, StoryObj } from "@storybook/react";
import { PrintLayout } from "./print-layout";

const meta: Meta<typeof PrintLayout> = {
  title: "Layout/PrintLayout",
  component: PrintLayout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PrintLayout>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h2>Formal General Ledger Statement</h2>
        <p>Period ending August 31, 2026. Certified by external auditor.</p>
      </div>
    ),
  },
};
