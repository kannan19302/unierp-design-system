import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";

/**
 * `RichTextEditor` delivers a toolbar-assisted editor for formatted documentation,
 * supporting bold, italic, underline, strikethrough, inline code, blockquotes,
 * markdown list insertion, and 4-tier density scaling.
 *
 * ### Architectural Features
 * - **Selection-Aware Formatting**: Inserts formatting tags directly around the current text selection.
 * - **Accessible Action Bar**: Each tool button features keyboard navigation and explicit `aria-label` tags.
 * - **4-Tier Density**: Ultra-compact (60px), Compact (90px), Standard (120px), Comfortable (180px).
 */
const meta: Meta<typeof RichTextEditor> = {
  title: "Core/Inputs/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Toolbar-assisted rich text editor for contractual clauses, invoices notes, and multi-line memos.",
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Text contents including formatting tags",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when editor is empty",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    disabled: {
      control: "boolean",
      description: "Disables all toolbar buttons and text area input",
    },
    onChange: {
      action: "textChanged",
      description: "Callback invoked when text content changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  render: (args) => {
    const [content, setContent] = useState(
      args.value ||
        "### Terms and Conditions\n- All invoices must be cleared within 30 business days.\n- Interest of 1.5% applies to overdue balance.",
    );
    return (
      <div style={{ maxWidth: 520 }}>
        <RichTextEditor
          label="Contractual Terms and Conditions"
          description="Highlight text and click formatting buttons to apply styles."
          {...args}
          value={content}
          onChange={setContent}
        />
      </div>
    );
  },
  args: {
    placeholder: "Draft clauses here...",
    disabled: false,
  },
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 520 }}>
      <RichTextEditor density="ultra-compact" label="Ultra-compact (60px)" value="Ultra-compact memo note." />
      <RichTextEditor density="compact" label="Compact (90px)" value="Compact clause editor." />
      <RichTextEditor density="standard" label="Standard (120px)" value="Standard contract paragraph editor." />
      <RichTextEditor density="comfortable" label="Comfortable (180px)" value="Comfortable comprehensive memo editor." />
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Default Active</h4>
        <RichTextEditor label="Meeting Notes" value="**Attendees:** Finance Committee" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Error State</h4>
        <RichTextEditor
          label="Escalation Summary"
          value=""
          required
          invalid
          error="Escalation summary must not be empty"
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled State</h4>
        <RichTextEditor
          label="Archived Clause"
          value="Fixed non-negotiable clause."
          disabled
        />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 650 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Purchase Order Remarks</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Special delivery instructions and quality inspection requirements for warehouse receiving.
        </p>
      </div>
      <RichTextEditor
        label="Receiving Instructions"
        value={`**Delivery Schedule Requirements:**
- Delivery window: Weekdays 08:00 - 16:00 CET
- Pallet standards: EUR-pallet (EPAL 1) only
- Certificate of Analysis (CoA) must be physically attached to pallet #1.`}
      />
    </div>
  ),
};
