import type { Meta, StoryObj } from "@storybook/react";
import { Footer, type FooterSection, type FooterLink } from "./footer";

const sampleSections: FooterSection[] = [
  {
    title: "Platforms/Sites/Platform",
    links: [
      { label: "Core ERP", href: "/platform/erp" },
      { label: "Developer Studio", href: "/platform/studio" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security & Trust", href: "/platform/trust" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Manufacturing", href: "/solutions/manufacturing" },
      { label: "Healthcare", href: "/solutions/healthcare" },
      { label: "Retail & Commerce", href: "/solutions/retail" },
      { label: "Financial Services", href: "/solutions/finance" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Community Forum", href: "/community" },
      { label: "Release Notes", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About UniERP", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Sales", href: "/contact" },
      { label: "Press & Media", href: "/press" },
    ],
  },
];

const sampleLegal: FooterLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Cookie Preferences", href: "/legal/cookies" },
  { label: "Security Compliance", href: "/legal/security" },
];

const meta: Meta<typeof Footer> = {
  title: "Platforms/Sites/Chrome/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const AnatomyAndComposition: Story = {
  render: (args) => <Footer {...args} />,
  args: {
    variant: "marketing",
    tagline: "The open, enterprise-grade ERP platform engineered for sovereign business acceleration.",
    sections: sampleSections,
    legalLinks: sampleLegal,
    copyright: "© 2026 UniERP Platform Inc. ISO 27001 & SOC 2 Type II Certified.",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "16px", background: "var(--color-bg-subtle)" }}>
      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>Product Utility Footer (Compact)</h4>
        <Footer
          variant="product"
          copyright="© 2026 UniERP Platform. Tenant: Acme Corp (US-East)."
          legalLinks={sampleLegal}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>Marketing Corporate Footer (Multi-Column)</h4>
        <Footer
          variant="marketing"
          tagline="Next-generation intelligent core system for global enterprises."
          sections={sampleSections}
          legalLinks={sampleLegal}
          copyright="© 2026 UniERP Platform Inc. All rights reserved."
        />
      </div>
    </div>
  ),
};

export const Product: Story = {
  args: {
    variant: "product",
    copyright: "© 2026 UniERP Platform. All rights reserved.",
    legalLinks: sampleLegal,
  },
};

export const Marketing: Story = {
  args: {
    variant: "marketing",
    tagline: "The open, enterprise-grade ERP platform engineered for sovereign business acceleration.",
    sections: sampleSections,
    legalLinks: sampleLegal,
    copyright: "© 2026 UniERP Platform Inc. ISO 27001 & SOC 2 Type II Certified.",
  },
};

