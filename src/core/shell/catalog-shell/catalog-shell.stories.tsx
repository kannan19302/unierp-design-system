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
type Story = StoryObj<typeof CatalogShell>;

export const Default: Story = {
  args: {
    facets: MOCK_FACETS,
    resultSummary: "Showing 2 Verified Integrations",
    children: <CatalogGallery tiles={MOCK_TILES} />,
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
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Populated Storefront</h4>
        <div style={{ height: "420px", border: "1px solid var(--color-border)", position: "relative" }}>
          <CatalogShell
            facets={MOCK_FACETS}
            resultSummary="Showing 2 Verified Integrations"
          >
            <CatalogGallery tiles={MOCK_TILES} />
          </CatalogShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Empty State</h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)", position: "relative" }}>
          <CatalogShell
            facets={MOCK_FACETS}
            resultSummary="0 apps found"
          >
            <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-secondary)" }}>
              No applications match the selected category filters.
            </div>
          </CatalogShell>
        </div>
      </div>
    </div>
  ),
};
