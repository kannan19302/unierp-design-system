import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SignaturePad } from "./signature-pad";

/**
 * `SignaturePad` captures high-resolution electronic signatures on an HTML5 canvas.
 * Includes clear button, base-line signing guidance, and export triggers.
 *
 * ### Architectural Features
 * - **Theme-Aware Stroke**: Canvas dynamically adopts `--color-fg-default` token for contrast in light/dark themes.
 * - **Export Format**: Emits standard PNG Data URL via `onSave`.
 * - **WAI-ARIA Pattern**: Accessible canvas role and labeled clear button.
 */
const meta: Meta<typeof SignaturePad> = {
  title: "Inputs/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise electronic signature capture component with canvas rendering and instant clear/export capabilities.",
      },
    },
  },
  argTypes: {
    width: {
      control: "number",
      description: "Canvas width in pixels",
    },
    height: {
      control: "number",
      description: "Canvas height in pixels",
    },
    disabled: {
      control: "boolean",
      description: "Disables canvas drawing interactions",
    },
    onSave: {
      action: "signatureSaved",
      description: "Callback invoked with data URL on mouse up / save",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  args: {
    width: 360,
    height: 140,
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [savedData, setSavedData] = useState<string>("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 420 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: DRAWING SURFACE / BASELINE GUIDE / CLEAR ACTION
          </div>
          <SignaturePad width={380} height={140} onSave={setSavedData} />
          <div style={{ marginTop: "var(--space-xs)", fontSize: "var(--font-size-xs)", color: "var(--color-fg-muted)" }}>
            Data URL: {savedData ? `${savedData.slice(0, 30)}...` : "(Sign to generate)"}
          </div>
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 420 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Active Signing Pad
        </h4>
        <SignaturePad width={380} height={120} />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled State
        </h4>
        <SignaturePad width={380} height={120} disabled />
      </div>
    </div>
  ),
};
