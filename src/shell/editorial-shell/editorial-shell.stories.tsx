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
  title: "Shell/EditorialShell",
  component: EditorialShell,
  parameters: { layout: "fullscreen" },
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
