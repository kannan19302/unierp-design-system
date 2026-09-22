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

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: 300 }}>
      <SplitView {...args} />
    </div>
  ),
  args: {
    initialSplit: 40,
    left: <div style={{ padding: 16 }}>Anatomy Left</div>,
    right: <div style={{ padding: 16 }}>Anatomy Right</div>,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBottom: "8px" }}>25 / 75 Split</h4>
        <div style={{ height: 160, border: "1px solid var(--color-border)" }}>
          <SplitView
            initialSplit={25}
            left={<div style={{ padding: 12 }}>Left 25%</div>}
            right={<div style={{ padding: 12 }}>Right 75%</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ marginBottom: "8px" }}>50 / 50 Split</h4>
        <div style={{ height: 160, border: "1px solid var(--color-border)" }}>
          <SplitView
            initialSplit={50}
            left={<div style={{ padding: 12 }}>Left 50%</div>}
            right={<div style={{ padding: 12 }}>Right 50%</div>}
          />
        </div>
      </div>
    </div>
  ),
};

