import type { Meta, StoryObj } from "@storybook/react";
import { LoadingOverlay } from "./loading-overlay";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Overlays/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  args: {
    visible: true,
    message: "Calculating general ledger reconciliation...",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: "relative",
          width: 400,
          height: 240,
          border: "1px solid var(--surface-1-border)",
          padding: "var(--space-4)",
        }}
      >
        <p>Underlying table and form controls.</p>
        <Story />
      </div>
    ),
  ],
};
