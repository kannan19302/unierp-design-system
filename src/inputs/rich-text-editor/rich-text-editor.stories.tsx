import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";

/**
 * `RichTextEditor` delivers a toolbar-assisted editor for formatted documentation,
 * supporting bold, italic, underline, and markdown list insertion.
 *
 * ### Architectural Features
 * - **Selection-Aware Formatting**: Inserts formatting tags directly around the current text selection.
 * - **Accessible Action Bar**: Each tool button features keyboard navigation and explicit `aria-label` tags.
 * - **Strata DL Design Tokens**: Toolbar styling and textarea padding derive from standard design variables.
 */
const meta: Meta<typeof RichTextEditor> = {
  title: "Inputs/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  parameters: {
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
        "### Terms and Conditions\n- All invoices must be cleared within 30 business days.\n- Interest of 1.5% applies to overdue balance."
    );
    return (
      <div style={{ maxWidth: 500 }}>
        <RichTextEditor {...args} value={content} onChange={setContent} />
      </div>
    );
  },
  args: {
    placeholder: "Draft clauses here...",
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [val, setVal] = useState("Select text and click toolbar buttons above.");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 500 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: TOOLBAR ACTIONS (BOLD/ITALIC/LISTS) / TEXT CANVAS
          </div>
          <RichTextEditor value={val} onChange={setVal} />
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
          Standard Editor
        </h4>
        <RichTextEditor
          value="**Bold Heading**\nHere is a note with an ordered list:\n1. First step\n2. Second step"
          onChange={() => {}}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled Editor
        </h4>
        <RichTextEditor
          value="Read-only invoice contract terms.\nToolbar buttons are locked."
          onChange={() => {}}
          disabled
        />
      </div>
    </div>
  ),
};
