import type { Meta, StoryObj } from "@storybook/react";
import { HierarchicalPickerForm, type PickerLevel } from "./hierarchical-picker-form";

const sampleLevels: PickerLevel[] = [
  {
    label: "Operating Division",
    options: {
      _root: ["North America Operations", "EMEA International", "APAC Markets"],
    },
  },
  {
    label: "Business Unit",
    options: {
      "North America Operations": ["Manufacturing", "Logistics & Freight", "Corporate HQ"],
      "EMEA International": ["DACH Region", "UK & Ireland", "Nordics"],
      "APAC Markets": ["Japan & Korea", "Southeast Asia", "Australia & NZ"],
    },
  },
  {
    label: "Cost Center",
    options: {
      Manufacturing: ["Assembly Line 1 (CC-101)", "Quality Assurance (CC-102)", "Packaging (CC-103)"],
      "Logistics & Freight": ["Long-haul Fleet (CC-201)", "Terminal Distribution (CC-202)"],
      "Corporate HQ": ["Executive Suite (CC-901)", "Legal & Compliance (CC-902)"],
      "DACH Region": ["Frankfurt DC (CC-301)", "Munich R&D (CC-302)"],
    },
  },
];

const meta: Meta<typeof HierarchicalPickerForm> = {
  title: "Core/Forms/HierarchicalPickerForm",
  component: HierarchicalPickerForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "label", enabled: true }],
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Header title for taxonomy selection",
    },
    subtitle: {
      control: "text",
      description: "Descriptive context for operator",
    },
    onChange: {
      action: "hierarchyChanged",
      description: "Callback invoked with array of selected path segments",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HierarchicalPickerForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)" }}>
      <HierarchicalPickerForm
        levels={sampleLevels}
        title="GL Account Dimension Assignment"
        subtitle="Cascade through legal division and cost center classifications."
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        HierarchicalPickerForm progressively reveals descendant dropdown levels as ancestor levels
        are selected, with an active breadcrumb ribbon displaying the full materialized taxonomy path.
      </p>
      <HierarchicalPickerForm
        levels={sampleLevels}
        initialPath={["North America Operations", "Manufacturing"]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Initial Blank State (Level 1 Only)</h5>
        <HierarchicalPickerForm
          levels={sampleLevels}
          title="Blank Hierarchy"
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Fully Resolved Multi-Tier Path</h5>
        <HierarchicalPickerForm
          levels={sampleLevels}
          initialPath={["North America Operations", "Corporate HQ", "Legal & Compliance (CC-902)"]}
        />
      </div>
    </div>
  ),
};
