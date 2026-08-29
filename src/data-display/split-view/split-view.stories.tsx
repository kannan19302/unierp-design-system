import type { Meta, StoryObj } from "@storybook/react";
import { SplitView } from "./split-view";

const meta: Meta<typeof SplitView> = {
  title: "DataDisplay/SplitView",
  component: SplitView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SplitView>;

export const Default: Story = {
  args: {
    initialSplit: 35,
    left: (
      <div style={{ padding: "var(--space-4)", background: "var(--color-bg-sunken)", height: 200 }}>
        Left Navigation Pane
      </div>
    ),
    right: (
      <div style={{ padding: "var(--space-4)", background: "var(--color-bg-elevated)", height: 200 }}>
        Right Content Inspector Pane
      </div>
    ),
  },
};
