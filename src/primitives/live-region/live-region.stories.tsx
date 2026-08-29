import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LiveRegion, type LiveRegionProps } from "./live-region";

const meta: Meta<typeof LiveRegion> = {
  title: "Primitives/LiveRegion",
  component: LiveRegion,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LiveRegion>;

function InteractiveLiveRegionDemo(props: Partial<LiveRegionProps>) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("No updates yet.");

  const handleUpdate = () => {
    const next = count + 1;
    setCount(next);
    setMessage(`Updated ledger inventory count to ${next * 10} units.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <button type="button" onClick={handleUpdate}>
        Trigger Status Announcement
      </button>
      <div style={{ padding: 12, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <strong>Current Visible UI:</strong> {message}
      </div>
      <LiveRegion {...props}>{message}</LiveRegion>
    </div>
  );
}

export const Polite: Story = {
  render: () => <InteractiveLiveRegionDemo politeness="polite" />,
};

export const Assertive: Story = {
  render: () => <InteractiveLiveRegionDemo politeness="assertive" />,
};

export const VisuallyVisibleForDemo: Story = {
  render: () => (
    <div style={{ padding: 16, background: "var(--color-surface-sunken)" }}>
      <LiveRegion visuallyHidden={false} politeness="polite">
        Screen reader live region: 42 records loaded successfully.
      </LiveRegion>
    </div>
  ),
};
