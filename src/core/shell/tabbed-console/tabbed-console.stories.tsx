import type { Meta, StoryObj } from "@storybook/react";
import { TabbedConsole } from "./tabbed-console";

const meta: Meta<typeof TabbedConsole> = {
  title: "Core/Shell/TabbedConsole",
  component: TabbedConsole,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    searchable: { control: "boolean" },
    canCreateTab: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof TabbedConsole>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "inv-1", title: "Invoice INV-2041", isDirty: true, content: <div style={{ padding: 24 }}>Invoice Form (Unsaved Changes)</div> },
      { id: "po-2", title: "PO-9942", content: <div style={{ padding: 24 }}>Purchase Order Details</div> },
      { id: "vendor-3", title: "Vendor: Acme Global", content: <div style={{ padding: 24 }}>Vendor Profile</div> },
    ],
    canCreateTab: true,
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Active Tab with Dirty Indicator</h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)", position: "relative" }}>
          <TabbedConsole
            tabs={[
              { id: "inv-1", title: "Invoice INV-2041", isDirty: true, content: <div style={{ padding: 24 }}>Invoice Form (Unsaved Changes)</div> },
              { id: "po-2", title: "PO-9942", content: <div style={{ padding: 24 }}>Purchase Order Details</div> },
            ]}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Multiple Pinned & Regular Tabs</h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)", position: "relative" }}>
          <TabbedConsole
            tabs={[
              { id: "pinned-home", title: "Dashboard", pinned: true, content: <div style={{ padding: 24 }}>Global KPI Summary</div> },
              { id: "ledger", title: "General Ledger", content: <div style={{ padding: 24 }}>GL Tree View</div> },
              { id: "audit", title: "Security Log", content: <div style={{ padding: 24 }}>Real-time Audit Stream</div> },
            ]}
            canCreateTab={true}
          />
        </div>
      </div>
    </div>
  ),
};

