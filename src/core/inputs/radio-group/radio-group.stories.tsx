import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./radio-group";

/**
 * ## RadioGroup Primitive
 *
 * Accessible single-selection radio button group for enterprise configuration workflows,
 * accounting method choices, and mutually exclusive parameter toggles.
 *
 * ### Key Capabilities
 * - **Accessible Radiogroup**: Full keyboard navigation via arrow keys and native radio semantics.
 * - **Rich Option Anatomy**: Supports primary labels alongside secondary explanatory hint notes.
 * - **Flexible Orientations**: Stacked vertical flow for dense forms or inline horizontal layout.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Inputs/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise mutually exclusive selection group with rich label/hint metadata, vertical/horizontal orientations, and density support.",
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Currently selected option value.",
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout direction of the radio options.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction for the entire radio group.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    value: "fifo",
    options: [
      { value: "fifo", label: "FIFO (First In, First Out)", hint: "Standard cost valuation method" },
      { value: "lifo", label: "LIFO (Last In, First Out)", hint: "Tax optimization in eligible jurisdictions" },
      { value: "wac", label: "Weighted Average Cost", hint: "Continuous weighted inventory valuation" },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    value: "daily",
    orientation: "horizontal",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
    ],
  },
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
    <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Tax Calculation Engine Strategy
      </h4>
      <RadioGroup
        value="automated"
        options={[
          {
            value: "automated",
            label: "Real-time Vertex Automated Engine",
            hint: "Calculates address-level nexus tax rates automatically via API gateway.",
          },
          {
            value: "fixed-rule",
            label: "Tenant Fixed Rule Tables",
            hint: "Evaluates locally configured state & provincial percentage tables.",
          },
          {
            value: "exempt",
            label: "Tax Exempt Organization (501c3)",
            hint: "Suppresses sales tax collection across all downstream invoices.",
          },
        ]}
      />
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, selection, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Orientation Variants
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Vertical (Stacked)</span>
          <RadioGroup
            value="opt1"
            options={[
              { value: "opt1", label: "Option 1 Selected", hint: "Explaining detail note" },
              { value: "opt2", label: "Option 2 Unselected" },
            ]}
          />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Horizontal (Inline)</span>
          <RadioGroup
            value="h1"
            orientation="horizontal"
            options={[
              { value: "h1", label: "Active" },
              { value: "h2", label: "Archived" },
              { value: "h3", label: "Suspended" },
            ]}
          />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Disabled Item & Disabled Group States
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Single Option Disabled</span>
          <RadioGroup
            value="avail"
            options={[
              { value: "avail", label: "Standard Delivery (Available)" },
              { value: "exp", label: "Drone Express (Not available in your zip code)", disabled: true },
            ]}
          />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Entire Group Disabled</span>
          <RadioGroup
            value="read-only"
            disabled
            options={[
              { value: "read-only", label: "Corporate Policy Locked Option" },
              { value: "other", label: "Secondary Choice" },
            ]}
          />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <RadioGroup value="d1" orientation="horizontal" options={[{ value: "d1", label: "Ultra-Compact (24px)" }, { value: "d2", label: "Row 2" }]} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <RadioGroup value="d1" orientation="horizontal" options={[{ value: "d1", label: "Compact (28px)" }, { value: "d2", label: "Row 2" }]} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <RadioGroup value="d1" orientation="horizontal" options={[{ value: "d1", label: "Standard (32px)" }, { value: "d2", label: "Row 2" }]} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <RadioGroup value="d1" orientation="horizontal" options={[{ value: "d1", label: "Comfortable (40px)" }, { value: "d2", label: "Row 2" }]} />
        </div>
      </div>
    </div>
  </div>
);
