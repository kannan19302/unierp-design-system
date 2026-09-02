import type { Meta, StoryObj } from "@storybook/react";
import { SplitViewShell } from "./split-view-shell";

const meta: Meta<typeof SplitViewShell> = {
  title: "Shell/SplitViewShell",
  component: SplitViewShell,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SplitViewShell>;

export const Default: Story = {
  args: {
    masterHeader: <span>Incident Queue (14)</span>,
    masterContent: (
      <div>
        <div style={{ padding: 12, borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-elevated)" }}>
          <strong>INC-1092</strong> - Payment gateway timeout
        </div>
        <div style={{ padding: 12, borderBottom: "1px solid var(--color-border)" }}>
          <strong>INC-1093</strong> - High CPU on DB replica
        </div>
      </div>
    ),
    detailContent: (
      <div style={{ padding: 24 }}>
        <h2>INC-1092 Details</h2>
        <p>Telemetry reports 504 gateway timeout on webhook ingestion.</p>
      </div>
    ),
  },
};
