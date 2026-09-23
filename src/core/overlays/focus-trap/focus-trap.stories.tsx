import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FocusTrap } from "./focus-trap";

const meta: Meta<typeof FocusTrap> = {
  title: "Core/Overlays/FocusTrap",
  component: FocusTrap,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FocusTrap>;

function InteractiveFocusTrapDemo() {
  const [trapped, setTrapped] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400, fontFamily: "var(--font-sans)" }}>
      <button
        type="button"
        onClick={() => setTrapped(true)}
        style={{
          padding: "var(--space-2) var(--space-4)",
          background: "var(--color-brand)",
          color: "var(--color-white)",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
        }}
      >
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
            <h4 style={{ margin: 0, color: "var(--color-text-primary)" }}>Focus is trapped inside this container</h4>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
              Pressing Tab cycles only between elements in this box. Pressing Escape deactivates.
            </p>
            <input
              type="text"
              placeholder="First trapped input"
              style={{
                padding: "var(--space-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
            <input
              type="text"
              placeholder="Second trapped input"
              style={{
                padding: "var(--space-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setTrapped(false)}
                style={{
                  padding: "var(--space-1-5) var(--space-3)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </FocusTrap>
      )}

      <button
        type="button"
        style={{
          padding: "var(--space-2) var(--space-4)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        Outside Button (Unreachable when trapped)
      </button>
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveFocusTrapDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <FocusTrap active={false}>
        <div
          style={{
            padding: "var(--space-4)",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-sunken)",
          }}
        >
          <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            FocusTrap acts as an invisible boundary wrapper, capturing Shift+Tab and Tab cycles without adding unwanted layout nodes.
          </p>
        </div>
      </FocusTrap>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Active State</h5>
        <FocusTrap active={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <input type="text" placeholder="Active Field A" style={{ padding: "var(--space-1-5)" }} />
            <button type="button" style={{ padding: "var(--space-1-5)" }}>Action Inside</button>
          </div>
        </FocusTrap>
      </div>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", opacity: 0.7 }}>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Passive State</h5>
        <FocusTrap active={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <input type="text" placeholder="Passive Field B" disabled style={{ padding: "var(--space-1-5)" }} />
            <button type="button" disabled style={{ padding: "var(--space-1-5)" }}>Action Disabled</button>
          </div>
        </FocusTrap>
      </div>
    </div>
  ),
};
