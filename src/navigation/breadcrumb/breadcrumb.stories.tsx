import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./breadcrumb";
import { Slash } from "lucide-react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
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
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    density: "standard",
    items: [
      { label: "Finance", href: "#" },
      { label: "General Ledger", href: "#" },
      { label: "Journal Entries", href: "#" },
      { label: "JV-2026-0048" },
    ],
  },
};

export const CollapsedLongPath: Story = {
  args: {
    maxVisibleItems: 3,
    items: [
      { label: "Home", href: "/" },
      { label: "Finance", href: "/finance" },
      { label: "General Ledger", href: "/finance/ledger" },
      { label: "Journal Entries", href: "/finance/ledger/journals" },
      { label: "JV-2026-0048" },
    ],
  },
};

export const Densities: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Breadcrumb
        density="ultra-compact"
        items={[{ label: "Root", href: "#" }, { label: "Ultra-compact" }]}
      />
      <Breadcrumb
        density="compact"
        items={[{ label: "Root", href: "#" }, { label: "Compact" }]}
      />
      <Breadcrumb
        density="standard"
        items={[{ label: "Root", href: "#" }, { label: "Standard" }]}
      />
      <Breadcrumb
        density="comfortable"
        items={[{ label: "Root", href: "#" }, { label: "Comfortable" }]}
      />
    </div>
  ),
};

export const CallbackAncestor: Story = {
  render: function CallbackAncestorStory() {
    const [destination, setDestination] = useState("No navigation yet");
    return (
      <div>
        <Breadcrumb items={[{ label: "Finance", onClick: () => setDestination("Finance opened") }, { label: "Ledger" }]} />
        <p role="status">{destination}</p>
      </div>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ marginBlock: 0, marginBlockEnd: "var(--space-2)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Default Chevron Separator
        </h4>
        <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            aria-label="Shipment breadcrumb"
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
        <h4 style={{ marginBlock: 0, marginBlockEnd: "var(--space-2)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Slash Separator Variant
        </h4>
        <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            aria-label="Security breadcrumb"
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
        <h4 style={{ marginBlock: 0, marginBlockEnd: "var(--space-2)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          3. Single Item (Root Destination)
        </h4>
        <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-3)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Breadcrumb
            aria-label="Dashboard breadcrumb"
            items={[{ label: "Global Dashboard" }]}
          />
        </div>
      </div>
    </div>
  ),
};
