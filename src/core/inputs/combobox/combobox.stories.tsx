import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox, type ComboBoxProps } from "./combobox";

/**
 * ## ComboBox Primitive
 *
 * Searchable autocomplete and dropdown selection control supporting single selection,
 * multi-tag collection, keyboard arrow navigation, and real-time query filtering.
 *
 * ### Key Capabilities
 * - **Autocomplete Search**: Real-time substring filter on option labels.
 * - **Multi-Tag Support**: Renders chosen items as compact inline tags.
 * - **W3C Listbox Semantics**: Implements `role="combobox"` and `role="listbox"`.
 */
const meta: Meta<typeof ComboBox> = {
  title: "Core/Inputs/Combobox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise searchable combobox with single/multi-selection, tag displays, clear buttons, and density scaling.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text", description: "Placeholder displayed when no option is selected." },
    searchPlaceholder: { control: "text", description: "Placeholder for the interior search input." },
    disabled: { control: "boolean", description: "Disables interaction and dropdown expansion." },
    multiple: { control: "boolean", description: "Enables multiple item selection with tag pills." },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const CURRENCY_OPTIONS = [
  { value: "usd", label: "USD - United States Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "jpy", label: "JPY - Japanese Yen" },
  { value: "sgd", label: "SGD - Singapore Dollar" },
  { value: "chf", label: "CHF - Swiss Franc" },
];

function InteractiveComboBox(props: Partial<ComboBoxProps>) {
  const [selected, setSelected] = useState<string | string[] | null>(props.value ?? "usd");
  return <ComboBox options={CURRENCY_OPTIONS} value={selected ?? undefined} onChange={setSelected} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveComboBox value="usd" />,
};

export const Multiple: Story = {
  render: () => <InteractiveComboBox multiple value={["eur", "gbp"]} />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [val, setVal] = useState<string | string[] | null>(["us-east", "eu-central"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Multi-Region Tenant Routing Gateway
        </h4>
        <ComboBox
          multiple
          placeholder="Assign data center regions..."
          value={val ?? undefined}
          onChange={setVal}
          options={[
            { value: "us-east", label: "US East (N. Virginia)" },
            { value: "us-west", label: "US West (Oregon)" },
            { value: "eu-central", label: "EU Central (Frankfurt)" },
            { value: "ap-south", label: "AP South (Mumbai)" },
          ]}
        />
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, selection, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Single vs Multi-Selection Modes
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Single Selection</span>
          <ComboBox options={CURRENCY_OPTIONS} value="usd" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Multi-Select (Tags)</span>
          <ComboBox options={CURRENCY_OPTIONS} multiple value={["usd", "eur", "gbp"]} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Empty / Placeholder</span>
          <ComboBox options={CURRENCY_OPTIONS} placeholder="Select trading currency..." />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Selector</span>
          <ComboBox options={CURRENCY_OPTIONS} value="jpy" disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <ComboBox options={CURRENCY_OPTIONS} value="usd" />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <ComboBox options={CURRENCY_OPTIONS} value="usd" />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <ComboBox options={CURRENCY_OPTIONS} value="usd" />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <ComboBox options={CURRENCY_OPTIONS} value="usd" />
        </div>
      </div>
    </div>
  </div>
);
