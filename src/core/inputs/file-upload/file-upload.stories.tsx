import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload } from "./file-upload";

/**
 * `FileUpload` is an accessible, drag-and-drop file staging area designed for ERP workflows.
 * Supports keyboard activation (Enter/Space), visual drag states, and custom MIME filters.
 *
 * ### Architectural Features
 * - **WAI-ARIA Pattern**: `role="button"` with `aria-disabled` and hidden native input activation.
 * - **Keyboard Trigger**: Full Space and Enter keybinding mapped directly to file selection dialog.
 * - **Dropzone Visual Affordance**: Distinct border highlight on file hover.
 */
const meta: Meta<typeof FileUpload> = {
  title: "Core/Inputs/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "High-capacity drag-and-drop dropzone supporting bulk file ingestion and chunked upload triggers.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description: "Comma-separated list of allowed file extensions or MIME types",
    },
    multiple: {
      control: "boolean",
      description: "Permits selection of multiple files concurrently",
    },
    disabled: {
      control: "boolean",
      description: "Disables drag events and file dialog triggers",
    },
    onFileSelect: {
      action: "filesSelected",
      description: "Callback invoked when files are dropped or selected",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    accept: ".csv,.xlsx,.pdf",
    multiple: true,
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [lastSelected, setLastSelected] = useState<string>("None");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 500 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: DROPZONE SURFACE / UPLOAD ICON / PRIMARY & SUBTEXT
          </div>
          <FileUpload
            accept=".pdf,.png"
            onFileSelect={(files) => {
              if (files && files.length > 0) {
                setLastSelected(Array.from(files).map((f) => f.name).join(", "));
              }
            }}
          />
          <div style={{ marginTop: "var(--space-xs)", fontSize: "var(--font-size-xs)", color: "var(--color-fg-muted)" }}>
            Selected: <strong>{lastSelected}</strong>
          </div>
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 500 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Default State (Multiple Documents)
        </h4>
        <FileUpload accept=".csv,.xlsx,.pdf" multiple />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Single File Strict (Images Only)
        </h4>
        <FileUpload accept="image/*" multiple={false} />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled State
        </h4>
        <FileUpload disabled />
      </div>
    </div>
  ),
};
