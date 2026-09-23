import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";
import { Slash } from "lucide-react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Core/Navigation/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Finance", href: "#" },
      { label: "General Ledger", href: "#" },
      { label: "Journal Entries", href: "#" },
      { label: "JV-2026-0048" },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
        <strong>Breadcrumb Anatomy:</strong> &lt;nav&gt; landmark with ordered list &lt;ol&gt;, interactive ancestor &lt;a&gt; links with focus rings, accessible SVG separators, and unlinked current terminal segment with aria-current="page".
      </div>
      <Breadcrumb
        items={[
          { label: "Platform OS", href: "#" },
          { label: "Developer Studio", href: "#" },
          { label: "Data Schemas", href: "#" },
          { label: "OrderHeaderSchema.v2" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Default Chevron Separator
        </h4>
        <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            items={[
              { label: "Acme Corp", href: "#" },
              { label: "Supply Chain", href: "#" },
              { label: "Shipments", href: "#" },
              { label: "SH-89210" },
            ]}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Slash Separator Variant
        </h4>
        <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            separator={<Slash size={10} style={{ transform: "rotate(-20deg)", color: "var(--color-text-tertiary)" }} />}
            items={[
              { label: "Settings", href: "#" },
              { label: "Security", href: "#" },
              { label: "MFA Enrollment" },
            ]}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          3. Single Item (Root Destination)
        </h4>
        <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            items={[{ label: "Global Dashboard" }]}
          />
        </div>
      </div>
    </div>
  ),
};
