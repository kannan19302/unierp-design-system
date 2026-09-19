import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataQueryDrawer } from "./data-query-drawer";

const meta: Meta<typeof DataQueryDrawer> = {
  title: "Studio/DataQueryDrawer",
  component: DataQueryDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Drawer expansion state",
    },
    queryName: {
      control: "text",
      description: "Identifier of data query",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataQueryDrawer>;

const SAMPLE_RESULTS = {
  columns: ["id", "vendor_name", "rating", "region", "active_contracts", "compliance_score"],
  rows: [
    { id: "VND-104", vendor_name: "Apex Logistics Corp", rating: 4.8, region: "North America", active_contracts: 12, compliance_score: "99.4%" },
    { id: "VND-209", vendor_name: "Nordic Parts AB", rating: 4.6, region: "Europe (Nordics)", active_contracts: 5, compliance_score: "98.1%" },
    { id: "VND-312", vendor_name: "PacRim Semiconductor", rating: 4.9, region: "Asia Pacific", active_contracts: 18, compliance_score: "99.9%" },
    { id: "VND-440", vendor_name: "Valence Chemical Ltd", rating: 4.3, region: "Europe (Central)", active_contracts: 3, compliance_score: "95.0%" },
  ],
};

const SAMPLE_SQL = `SELECT 
  v.id,
  v.vendor_name,
  v.rating,
  v.region,
  COUNT(c.id) AS active_contracts,
  v.compliance_score
FROM vendors v
LEFT JOIN contracts c ON c.vendor_id = v.id AND c.status = 'ACTIVE'
WHERE v.tenant_id = current_setting('app.current_tenant')
GROUP BY v.id
ORDER BY v.rating DESC;`;

const DrawerInteractiveDemo = ({ initialOpen = true }: { initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [sql, setSql] = useState(SAMPLE_SQL);

  return (
    <div style={{ display: "flex", flexDirection: "column", blockSize: "400px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ flex: "1 1 auto", padding: "var(--space-6)", background: "var(--color-surface-subtle)" }}>
        <h3 style={{ margin: "0 0 var(--space-2) 0" }}>Canvas Workspace</h3>
        <p style={{ color: "var(--color-text-muted)", margin: 0, fontSize: "var(--font-size-sm)" }}>
          The bottom data query drawer exposes SQL and live database records directly to the visual builder.
        </p>
      </div>

      <DataQueryDrawer
        queryName="getSuppliersList"
        sourceType="PostgreSQL"
        isOpen={isOpen}
        onToggleOpen={() => setIsOpen(!isOpen)}
        onRunQuery={() => alert("Executing query against PostgreSQL RLS database...")}
        queryText={sql}
        onChangeQueryText={setSql}
        results={SAMPLE_RESULTS}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <DrawerInteractiveDemo initialOpen={true} />,
};

export const CollapsedState: Story = {
  render: () => <DrawerInteractiveDemo initialOpen={false} />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>DataQueryDrawer Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Header Bar (Expand/collapse chevron button, query identifier, datasource badge)</li>
          <li>Status Indicator (HTTP status code, execution latency in milliseconds, row count)</li>
          <li>Tab Switcher (Toggle between tabular results preview and SQL/GraphQL code editor)</li>
          <li>Run Query Action (Direct trigger for database test execution)</li>
          <li>Content Body (Scrollable data table with sticky header or monospace code editor)</li>
        </ol>
      </div>
      <DrawerInteractiveDemo initialOpen={true} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Expanded with Query Results</h4>
        <DrawerInteractiveDemo initialOpen={true} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Collapsed Bar</h4>
        <DrawerInteractiveDemo initialOpen={false} />
      </div>
    </div>
  ),
};
