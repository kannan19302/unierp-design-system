import type { Meta, StoryObj } from "@storybook/react";
import { SplitView } from "./split-view";

const meta: Meta<typeof SplitView> = {
  title: "Compositions/SplitView",
  component: SplitView,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    initialSplit: {
      control: "number",
      description: "Initial divider percentage split (e.g. 35 for 35%/65%).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitView>;

export const Default: Story = {
  args: {
    initialSplit: 35,
    density: "standard",
    left: (
      <div style={{ paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)", background: "var(--color-bg-sunken)", blockSize: 200 }}>
        Left Navigation Pane
      </div>
    ),
    right: (
      <div style={{ paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)", background: "var(--color-bg-elevated)", blockSize: 200 }}>
        Right Content Inspector Pane
      </div>
    ),
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (2px divider)</h4>
        <div style={{ blockSize: 120, border: "1px solid var(--color-border)" }}>
          <SplitView
            density="ultra-compact"
            initialSplit={30}
            left={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Left 30%</div>}
            right={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Right 70%</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (4px divider)</h4>
        <div style={{ blockSize: 120, border: "1px solid var(--color-border)" }}>
          <SplitView
            density="compact"
            initialSplit={30}
            left={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Left 30%</div>}
            right={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Right 70%</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (6px divider)</h4>
        <div style={{ blockSize: 120, border: "1px solid var(--color-border)" }}>
          <SplitView
            density="standard"
            initialSplit={30}
            left={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Left 30%</div>}
            right={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Right 70%</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (8px divider)</h4>
        <div style={{ blockSize: 120, border: "1px solid var(--color-border)" }}>
          <SplitView
            density="comfortable"
            initialSplit={30}
            left={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Left 30%</div>}
            right={<div style={{ paddingBlock: "8px", paddingInline: "8px" }}>Right 70%</div>}
          />
        </div>
      </div>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", blockSize: 300 }}>
      <SplitView {...args} />
    </div>
  ),
  args: {
    initialSplit: 40,
    left: <div style={{ paddingBlock: "16px", paddingInline: "16px" }}>Anatomy Left</div>,
    right: <div style={{ paddingBlock: "16px", paddingInline: "16px" }}>Anatomy Right</div>,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBlockEnd: "8px" }}>25 / 75 Split</h4>
        <div style={{ blockSize: 160, border: "1px solid var(--color-border)" }}>
          <SplitView
            initialSplit={25}
            left={<div style={{ paddingBlock: "12px", paddingInline: "12px" }}>Left 25%</div>}
            right={<div style={{ paddingBlock: "12px", paddingInline: "12px" }}>Right 75%</div>}
          />
        </div>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "8px" }}>50 / 50 Split</h4>
        <div style={{ blockSize: 160, border: "1px solid var(--color-border)" }}>
          <SplitView
            initialSplit={50}
            left={<div style={{ paddingBlock: "12px", paddingInline: "12px" }}>Left 50%</div>}
            right={<div style={{ paddingBlock: "12px", paddingInline: "12px" }}>Right 50%</div>}
          />
        </div>
      </div>
    </div>
  ),
};
