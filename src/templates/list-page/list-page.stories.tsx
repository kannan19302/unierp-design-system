import type { Meta, StoryObj } from "@storybook/react";
import { ListPageTemplate } from "./list-page";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof ListPageTemplate> = {
  title: "Templates/ListPageTemplate",
  component: ListPageTemplate,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
  },
};
export default meta;

type Story = StoryObj<typeof ListPageTemplate>;

const COLUMNS = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    render: (val: unknown) => (
      <Badge variant={val === "ACTIVE" ? "success" : "neutral"}>
        {String(val)}
      </Badge>
    ),
  },
];

const DATA = Array.from({ length: 8 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? "Admin" : "Member",
  status: i % 3 === 0 ? "INACTIVE" : "ACTIVE",
}));

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ padding: "24px", background: "var(--color-bg-subtle)", minBlockSize: "100dvh" }}>
      <ListPageTemplate {...args} />
    </div>
  ),
  args: {
    title: "Team Members",
    subtitle: "Manage your enterprise workspace members and system permissions.",
    actions: <Button size="sm">Invite Member</Button>,
    columns: COLUMNS,
    data: DATA,
    searchable: true,
    filters: [
      {
        key: "role",
        label: "Role",
        options: [
          { label: "Admin", value: "Admin" },
          { label: "Member", value: "Member" },
        ],
      },
    ],
    pagination: {
      page: 1,
      pageSize: 5,
      total: 8,
      onPageChange: () => {},
    },
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "24px", background: "var(--color-bg-subtle)" }}>
      <div>
        <h3 style={{ marginBlockStart: 0, marginBlockEnd: "16px", marginInline: 0, color: "var(--color-text-primary)" }}>Populated List with Filters & Pagination</h3>
        <ListPageTemplate
          title="Active Accounts"
          subtitle="Directory of verified customers"
          columns={COLUMNS}
          data={DATA}
          pagination={{ page: 1, pageSize: 4, total: 8, onPageChange: () => {} }}
        />
      </div>

      <div>
        <h3 style={{ marginBlockStart: 0, marginBlockEnd: "16px", marginInline: 0, color: "var(--color-text-primary)" }}>Loading Shimmer State</h3>
        <ListPageTemplate
          title="Synchronizing Contacts…"
          columns={COLUMNS}
          data={[]}
          loading={true}
        />
      </div>

      <div>
        <h3 style={{ marginBlockStart: 0, marginBlockEnd: "16px", marginInline: 0, color: "var(--color-text-primary)" }}>Empty Filtered State</h3>
        <ListPageTemplate
          title="Archived Records"
          columns={COLUMNS}
          data={[]}
          emptyTitle="No archived records found"
          emptyDescription="Try clearing your search query or reset date filters."
        />
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBlockEnd: "var(--space-2)" }}>
            Density: {density}
          </div>
          <ListPageTemplate
            density={density}
            title={`Users Table (${density})`}
            columns={COLUMNS.slice(0, 3)}
            data={DATA.slice(0, 3)}
            searchable
            pagination={{ page: 1, pageSize: 3, total: 3, onPageChange: () => {} }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};


