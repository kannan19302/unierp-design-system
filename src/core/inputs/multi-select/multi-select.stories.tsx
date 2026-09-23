import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MultiSelect } from "./multi-select";

const sampleOptions = [
  { value: "NY", label: "New York Hub" },
  { value: "CA", label: "California Hub" },
  { value: "TX", label: "Texas Hub" },
  { value: "FL", label: "Florida Hub" },
  { value: "IL", label: "Illinois Hub" },
  { value: "WA", label: "Washington DC (Disabled)", disabled: true },
];

/**
 * `MultiSelect` enables choosing multiple options from a categorized or searchable list,
 * displaying active selections as dismissible tags with full keyboard navigation and ARIA attributes.
 *
 * ### Architectural Features
 * - **WAI-ARIA Combobox Pattern**: Maintains `role="combobox"` with `aria-multiselectable="true"` listbox.
 * - **Dismissible Chips**: Individual keyboard and mouse dismiss buttons with accessibility announcements.
 * - **High Density Ready**: Compact styling matching the Strata DL workspace grid.
 */
const meta: Meta<typeof MultiSelect> = {
  title: "Core/Inputs/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise multi-selection input with tag rendering, external click detection, and keyboard navigation.",
      },
    },
  },
  argTypes: {
    value: {
      control: "object",
      description: "Array of selected option values",
    },
    options: {
      control: "object",
      description: "Available options with values, labels, and disabled states",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when no items are selected",
    },
    disabled: {
      control: "boolean",
      description: "Disables all interactions with the trigger and tags",
    },
    onChange: {
      action: "changed",
      description: "Callback invoked when selections change",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(args.value || ["NY", "CA"]);
    return (
      <div style={{ maxWidth: 400 }}>
        <MultiSelect {...args} value={selected} onChange={setSelected} />
      </div>
    );
  },
  args: {
    value: ["NY", "CA"],
    options: sampleOptions,
    placeholder: "Select regional hubs...",
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["NY", "TX"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 480 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: TRIGGER / REMOVABLE TAGS / CARET DROPDOWN
          </div>
          <MultiSelect
            options={sampleOptions}
            value={selected}
            onChange={setSelected}
            placeholder="Choose regions..."
            aria-label="Regional selector"
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
            Empty / Placeholder
          </h4>
          <MultiSelect
            options={sampleOptions}
            value={[]}
            onChange={() => {}}
            placeholder="Select multiple hubs..."
          />
        </div>

        <div>
          <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
            Populated with Multiple Selections
          </h4>
          <MultiSelect
            options={sampleOptions}
            value={["NY", "CA", "TX"]}
            onChange={() => {}}
          />
        </div>

        <div>
          <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
            Disabled State
          </h4>
          <MultiSelect
            options={sampleOptions}
            value={["NY", "IL"]}
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
    const [selectedHubs, setSelectedHubs] = useState(["NY", "CA"]);

    return (
      <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "560px" }}>
        <div style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
            Distribution Logistics Hubs
          </h3>
          <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Assign order fulfillment routes across authorized enterprise distribution nodes.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <MultiSelect
            label="Authorized Fulfillment Centers"
            options={sampleOptions}
            value={selectedHubs}
            onChange={setSelectedHubs}
            placeholder="Select regional distribution centers..."
            density="standard"
            required
          />
        </div>

        <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Inventory synchronizes automatically across selected hubs
          </span>
        </div>
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <MultiSelect label="Default Selection" options={sampleOptions} value={["NY", "CA"]} onChange={() => {}} />
      <MultiSelect label="Invalid / Empty Selection" options={sampleOptions} value={[]} invalid error="At least one distribution hub must be selected" onChange={() => {}} />
      <MultiSelect label="Disabled State" options={sampleOptions} value={["TX"]} disabled onChange={() => {}} />
    </div>
  ),
};

