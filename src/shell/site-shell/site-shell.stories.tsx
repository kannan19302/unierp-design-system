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
  title: "Shell/SiteShell",
  component: SiteShell,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
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
