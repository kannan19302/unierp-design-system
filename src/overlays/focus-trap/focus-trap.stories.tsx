import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FocusTrap } from "./focus-trap";

const meta: Meta<typeof FocusTrap> = {
  title: "Overlays/FocusTrap",
  component: FocusTrap,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FocusTrap>;

function InteractiveFocusTrapDemo() {
  const [trapped, setTrapped] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      <button type="button" onClick={() => setTrapped(true)}>
        Activate Focus Trap
      </button>

      {trapped && (
        <FocusTrap onEscape={() => setTrapped(false)}>
          <div
            style={{
              padding: 24,
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-surface)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h4 style={{ margin: 0 }}>Focus is trapped inside this container</h4>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
              Pressing Tab cycles only between elements in this box. Pressing Escape deactivates.
            </p>
            <input type="text" placeholder="First trapped input" />
            <input type="text" placeholder="Second trapped input" />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setTrapped(false)}>
                Deactivate
              </button>
            </div>
          </div>
        </FocusTrap>
      )}

      <button type="button">Outside Button (Unreachable when trapped)</button>
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveFocusTrapDemo />,
};
