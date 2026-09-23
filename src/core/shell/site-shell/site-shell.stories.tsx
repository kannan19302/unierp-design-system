import type { Meta, StoryObj } from "@storybook/react";
import { SiteShell } from "./site-shell";

const sampleNav = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const sampleFooterSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Security", href: "/security" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const meta: Meta<typeof SiteShell> = {
  title: "Core/Shell/SiteShell",
  component: SiteShell,
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
type Story = StoryObj<typeof SiteShell>;

export const Default: Story = {
  args: {
    brandName: "Acme Industrial Cloud",
    navItems: sampleNav,
    ctaButton: { label: "Launch Console", href: "/login" },
    announcement: "🚀 UniERP Strata 3.0 is now live for all enterprise tenants.",
    footerSections: sampleFooterSections,
    legalLinks: [{ label: "Privacy Policy", href: "/privacy" }],
    children: (
      <div style={{ padding: "var(--space-16) var(--space-6)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-4)" }}>
          The Unified Operating System for Modern Industry
        </h1>
        <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-secondary)", maxWidth: "var(--form-measure)", margin: "0 auto" }}>
          Empower your enterprise with autonomous supply chain coordination, multi-tier ledgers, and zero-trust data governance.
        </p>
      </div>
    ),
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
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>With Top Announcement Banner</h4>
        <div style={{ height: "420px", border: "1px solid var(--color-border)", position: "relative" }}>
          <SiteShell
            brandName="Acme Corp"
            navItems={sampleNav}
            announcement="📢 Scheduled maintenance notice: Oct 1, 02:00 UTC."
            ctaButton={{ label: "Client Portal", href: "#" }}
          >
            <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
              <h2>Enterprise Cloud Portal</h2>
            </div>
          </SiteShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Standard Masthead (No Announcement)</h4>
        <div style={{ height: "350px", border: "1px solid var(--color-border)", position: "relative" }}>
          <SiteShell
            brandName="Acme Corp"
            navItems={sampleNav}
            ctaButton={{ label: "Get Started", href: "#" }}
          >
            <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
              <h2>Autonomous Operations</h2>
            </div>
          </SiteShell>
        </div>
      </div>
    </div>
  ),
};

