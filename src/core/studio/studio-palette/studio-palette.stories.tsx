import type { Meta, StoryObj } from "@storybook/react";
import { StudioPalette, type PaletteGroup } from "./studio-palette";

const MOCK_GROUPS: PaletteGroup[] = [
  {
    id: "layout",
    label: "Layout Elements",
    items: [
      { id: "hero", label: "Hero Header", keywords: ["banner", "intro"] },
      { id: "features", label: "Features Grid", keywords: ["columns", "cards"] },
      { id: "pricing", label: "Pricing Table", keywords: ["tiers", "plans"] },
    ],
  },
  {
    id: "forms",
    label: "Interactive Inputs",
    items: [
      { id: "text-input", label: "Text Input", keywords: ["field", "string"] },
      { id: "select", label: "Dropdown Select", keywords: ["options", "picker"] },
      { id: "button", label: "Submit Button", keywords: ["cta", "action"] },
    ],
  },
];

const meta: Meta<typeof StudioPalette> = {
  title: "Studio/StudioPalette",
  component: StudioPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudioPalette>;

export const Default: Story = {
  args: {
    groups: MOCK_GROUPS,
    onInsert: () => {},
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>
          Studio Component Palette
        </h4>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Accessible insertion source for visual builders. Supports keyboard navigation (/ to search, ↑↓ to navigate, Enter to insert).
        </p>
      </div>
      <div style={{ width: 280, height: 420, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <StudioPalette
          groups={MOCK_GROUPS}
          onInsert={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Standard Groups</h5>
        <div style={{ height: 350, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <StudioPalette groups={MOCK_GROUPS} onInsert={() => {}} />
        </div>
      </div>
      <div>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Disabled Items</h5>
        <div style={{ height: 350, border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <StudioPalette
            groups={[
              {
                id: "enterprise",
                label: "Enterprise Connectors",
                items: [
                  { id: "sap", label: "SAP S/4HANA Sync", disabled: true, disabledReason: "Requires Enterprise License" },
                  { id: "salesforce", label: "Salesforce CRM Link", disabled: true, disabledReason: "OAuth token unconfigured" },
                  { id: "custom-api", label: "Generic REST Hook" },
                ],
              },
            ]}
            onInsert={() => {}}
          />
        </div>
      </div>
    </div>
  ),
};
