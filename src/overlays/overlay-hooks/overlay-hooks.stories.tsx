import { useState, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useEscapeKey, useScrollLock } from "./overlay-hooks";
import styles from "./overlay-hooks.module.css";

const HookDemo = () => {
  const [locked, setLocked] = useState(false);
  const [escapedCount, setEscapedCount] = useState(0);

  useScrollLock(locked);
  useEscapeKey(() => setEscapedCount((c) => c + 1), true);

  return (
    <div className={styles.overlayDemoContainer}>
      <h4 style={{ margin: 0 }}>Overlay Hooks Interactive Harness</h4>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Press <code>Escape</code> anywhere on the page, or toggle scroll lock below.
      </p>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setLocked(!locked)}
          style={{
            padding: "var(--space-2) var(--space-3)",
            background: locked ? "var(--color-danger)" : "var(--color-brand)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          {locked ? "Unlock Body Scroll" : "Lock Body Scroll"}
        </button>
        <span style={{ fontSize: "var(--text-sm)" }}>
          Escape Pressed: <strong>{escapedCount}</strong> times
        </span>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Overlays/OverlayHooks",
  component: HookDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <HookDemo />,
};
