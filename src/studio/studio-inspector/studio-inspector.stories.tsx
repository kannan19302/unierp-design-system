import type { Meta, StoryObj } from "@storybook/react";
import { StudioInspector } from "./studio-inspector";

const meta: Meta<typeof StudioInspector> = {
  title: "Studio/StudioInspector",
  component: StudioInspector,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StudioInspector>;

export const Default: Story = {
  args: {
    subject: "Primary Action Button",
    properties: (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Button Text</label>
        <input type="text" defaultValue="Submit Order" style={{ padding: "6px", border: "1px solid var(--color-border-default)" }} />
      </div>
    ),
    logic: (
      <div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Enabled when cart.total &gt; 0</p>
      </div>
    ),
  },
};
