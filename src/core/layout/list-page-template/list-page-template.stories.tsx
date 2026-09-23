import type { Meta, StoryObj } from "@storybook/react";
import { ListPageTemplate } from "./list-page-template";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof ListPageTemplate> = {
  title: "Core/Layout/ListPageTemplate",
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
    <div style={{ padding: "24px", background: "var(--color-bg-subtle)", minBlockSize: "100vh" }}>
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
        <h3 style={{ margin: "0 0 16px 0", color: "var(--color-text-primary)" }}>Populated List with Filters & Pagination</h3>
        <ListPageTemplate
          title="Active Accounts"
          subtitle="Directory of verified customers"
          columns={COLUMNS}
          data={DATA}
          pagination={{ page: 1, pageSize: 4, total: 8, onPageChange: () => {} }}
        />
      </div>

      <div>
        <h3 style={{ margin: "0 0 16px 0", color: "var(--color-text-primary)" }}>Loading Shimmer State</h3>
        <ListPageTemplate
          title="Synchronizing Contacts…"
          columns={COLUMNS}
          data={[]}
          loading={true}
        />
      </div>

      <div>
        <h3 style={{ margin: "0 0 16px 0", color: "var(--color-text-primary)" }}>Empty Filtered State</h3>
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

export const Default: Story = {
  ...AnatomyAndComposition,
};

