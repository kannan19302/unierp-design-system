import type { Meta, StoryObj } from "@storybook/react";
import { CatalogShell, CatalogGallery, type CatalogTile, type CatalogFacet } from "./catalog-shell";

const MOCK_FACETS: CatalogFacet[] = [
  {
    id: "category",
    legend: "Categories",
    options: [
      { id: "fin", label: "Finance & Accounting", count: 24, checked: true },
      { id: "crm", label: "CRM & Sales", count: 18 },
      { id: "hr", label: "HR & Payroll", count: 12 },
    ],
  },
];

const MOCK_TILES: CatalogTile[] = [
  {
    id: "stripe",
    name: "Stripe Global Payments",
    publisher: "Stripe Inc.",
    description: "Accept multi-currency credit cards and automated recurring subscription billing.",
    href: "#",
    icon: "💳",
    status: "Verified Integration",
  },
  {
    id: "quickbooks",
    name: "QuickBooks Sync",
    publisher: "Intuit",
    description: "Synchronize general ledger transactions and invoice reconciliations in real-time.",
    href: "#",
    icon: "📊",
  },
];

const meta: Meta<typeof CatalogShell> = {
  title: "Shell/CatalogShell",
  component: CatalogShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CatalogShell>;

export const Default: Story = {
  args: {
    facets: MOCK_FACETS,
    resultSummary: "Showing 2 Verified Integrations",
    children: <CatalogGallery tiles={MOCK_TILES} />,
  },
};
