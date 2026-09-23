import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagInput } from "./tag-input";

/**
 * `TagInput` provides inline tag/chip generation with keyboard triggers (Enter to commit, Backspace to delete).
 *
 * ### Architectural Features
 * - **Keyboard Ergonomics**: Pressing `Enter` commits the current input; pressing `Backspace` when empty deletes the trailing tag.
 * - **Token Purity**: Styled using Strata DL semantic variables for padding, borders, and chip badges.
 * - **Accessible Controls**: Each generated chip contains a focused dismiss button with an accessible label.
 */
const meta: Meta<typeof TagInput> = {
  title: "Core/Inputs/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Free-form chip/tag creation field with enter-to-add, click-to-remove, and backspace-to-pop functionality.",
      },
    },
  },
  argTypes: {
    tags: {
      control: "object",
      description: "Array of tag strings currently active",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text inside the embedded input field",
    },
    disabled: {
      control: "boolean",
      description: "Disables adding and removing tags",
    },
    onChange: {
      action: "changed",
      description: "Callback invoked when tags are added or removed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>(args.tags || ["Ledger-2026", "Audited", "Consolidated"]);
    return (
      <div style={{ maxWidth: 450 }}>
        <TagInput {...args} tags={tags} onChange={setTags} />
      </div>
    );
  },
  args: {
    tags: ["Ledger-2026", "Audited", "Consolidated"],
    placeholder: "Type tag and press enter...",
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["Accounting", "Q3-Report"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 450 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: TAG CHIPS / DISMISS BUTTONS / INLINE TEXT INPUT
          </div>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Add classification..."
          />
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 500 }}>
        <div>
          <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
            Empty Field
          </h4>
          <TagInput tags={[]} onChange={() => {}} placeholder="Add tags..." />
        </div>

        <div>
          <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
            Populated with Multiple Tags
          </h4>
          <TagInput
            tags={["High Priority", "Financial", "FY2026", "Tax-Exempt"]}
            onChange={() => {}}
          />
        </div>

        <div>
          <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
            Disabled State
          </h4>
          <TagInput
            tags={["Archived", "Read-Only"]}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>
    );
  },
};

export const V1WorkspacePreview: Story = {
  render: () => {
    const [classifications, setClassifications] = useState(["Manufacturing", "Direct-Cost", "SOX-Audited"]);
    const [segments, setSegments] = useState(["NA-West", "Tier-1"]);

    return (
      <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "560px" }}>
        <div style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
            Ledger Account Taxonomy & Tags
          </h3>
          <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Classify and tag general ledger accounts with keyboard enter-to-commit and backspace-to-pop.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <TagInput
            label="Accounting Classifications"
            tags={classifications}
            onChange={setClassifications}
            placeholder="Add new classification tag..."
            density="standard"
            required
          />
          <TagInput
            label="Operating Segments"
            tags={segments}
            onChange={setSegments}
            placeholder="Add operating segment tag..."
            density="standard"
          />
        </div>

        <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Tags synchronize with the reporting dimension catalog
          </span>
        </div>
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <TagInput label="Default Tags" tags={["GL-2026", "Audited"]} onChange={() => {}} />
      <TagInput label="Invalid / Error State" tags={[]} invalid error="At least one tag is required" onChange={() => {}} />
      <TagInput label="Disabled State" tags={["Fixed-Asset", "Compliance-Locked"]} disabled onChange={() => {}} />
    </div>
  ),
};

