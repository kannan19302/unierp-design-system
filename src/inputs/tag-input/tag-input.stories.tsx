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
  title: "Inputs/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: {
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
