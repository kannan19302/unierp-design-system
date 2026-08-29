import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StudioCanvas } from "./studio-canvas";

const CanvasDemo = () => {
  const [selected, setSelected] = useState<string | null>("block-1");

  return (
    <div style={{ height: "400px", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <StudioCanvas
        label="Page Builder Canvas"
        variant="linear"
        selectedId={selected}
        onSelect={setSelected}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
          {["block-1", "block-2", "block-3"].map((id) => (
            <div
              key={id}
              onClick={() => setSelected(id)}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-elevated, #fff)",
                border: selected === id ? "2px solid var(--color-brand, #3b82f6)" : "1px solid var(--color-border-default, #e2e8f0)",
                cursor: "pointer",
              }}
            >
              <strong>{id.toUpperCase()}</strong> — Visual Hero Component
            </div>
          ))}
        </div>
      </StudioCanvas>
    </div>
  );
};

const meta: Meta = {
  title: "Studio/StudioCanvas",
  component: CanvasDemo,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <CanvasDemo />,
};
