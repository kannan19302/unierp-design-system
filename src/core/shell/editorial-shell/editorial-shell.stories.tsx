import type { Meta, StoryObj } from "@storybook/react";
import {
  EditorialShell,
  EditorialBand,
  Eyebrow,
  HeroTitle,
  Lede,
  BandTitle,
} from "./editorial-shell";

const meta: Meta<typeof EditorialShell> = {
  title: "Core/Shell/EditorialShell",
  component: EditorialShell,
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
};

export default meta;
type Story = StoryObj<typeof EditorialShell>;

export const Default: Story = {
  render: () => (
    <EditorialShell
      brand={<strong>UniERP Enterprise</strong>}
      actions={<button style={{ padding: "8px 16px", background: "var(--color-brand, #3b82f6)", color: "#fff", border: "none", borderRadius: "4px" }}>Start Free</button>}
      footer={<p style={{ textAlign: "center", margin: "24px 0", color: "#64748b" }}>© 2026 UniERP Inc.</p>}
    >
      <EditorialBand tone="base">
        <Eyebrow>Enterprise Platform</Eyebrow>
        <HeroTitle>The Autonomous Cloud ERP</HeroTitle>
        <Lede>
          A single platform unifying billing, ledgers, multi-tenant schemas, and developer extensions.
        </Lede>
      </EditorialBand>
      <EditorialBand tone="sunken">
        <BandTitle>Continuous Assurance & Governance</BandTitle>
        <p>Zero regression testing and complete multi-repo contract validation on every commit.</p>
      </EditorialBand>
    </EditorialShell>
  ),
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  render: () => Default.render ? Default.render(Default.args as any, {} as any) : null,
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Base Tone & Sunken Band</h4>
        <div style={{ height: "380px", border: "1px solid var(--color-border)", position: "relative" }}>
          <EditorialShell
            brand={<strong>UniERP Global</strong>}
            actions={<button type="button">Contact Sales</button>}
          >
            <EditorialBand tone="base">
              <HeroTitle>Modern Financial Infrastructure</HeroTitle>
              <Lede>Full RLS enforcement and immutable audit ledgers.</Lede>
            </EditorialBand>
            <EditorialBand tone="sunken">
              <BandTitle>Global Compliance</BandTitle>
              <p>SOC2 Type II, ISO27001, and HIPAA compliance baked into platform primitives.</p>
            </EditorialBand>
          </EditorialShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Ink Horizon Band (Dark Ground)</h4>
        <div style={{ height: "320px", border: "1px solid var(--color-border)", position: "relative" }}>
          <EditorialShell
            brand={<strong>UniERP Security</strong>}
          >
            <EditorialBand tone="ink">
              <Eyebrow>Zero Trust Architecture</Eyebrow>
              <HeroTitle>Encrypted KMS Enclaves</HeroTitle>
              <Lede>Dedicated cryptographic boundaries for every sovereign cloud region.</Lede>
            </EditorialBand>
          </EditorialShell>
        </div>
      </div>
    </div>
  ),
};

