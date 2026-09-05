import type { Meta, StoryObj } from "@storybook/react";
import { Footer, type FooterSection, type FooterLink } from "./footer";

const sampleSections: FooterSection[] = [
  {
    title: "Platform",
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
  title: "Layout/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

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
