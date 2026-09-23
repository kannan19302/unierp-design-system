import type { Meta, StoryObj } from "@storybook/react";
import { Package, Users, DollarSign, TrendingUp } from "lucide-react";
import { StatCardRow } from "./stat-card-row";

const meta: Meta<typeof StatCardRow> = {
  title: "Core/Layout/StatCardRow",
  component: StatCardRow,
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof StatCardRow>;

const DEFAULT_STATS = [
  {
    label: "Total Products",
    value: 1284,
    change: 12.5,
    icon: <Package size={16} />,
    color: "var(--color-primary)",
  },
  {
    label: "Active Users",
    value: 342,
    change: -3.2,
    icon: <Users size={16} />,
    color: "var(--color-secondary, #6366f1)",
  },
  {
    label: "Revenue",
    value: "$48,290",
    change: 8.1,
    changeLabel: "vs last month",
    icon: <DollarSign size={16} />,
    color: "var(--color-success)",
  },
  {
    label: "Growth",
    value: "24.3%",
    change: 4.7,
    icon: <TrendingUp size={16} />,
    color: "var(--color-warning)",
  },
];

export const AnatomyAndComposition: Story = {
  render: (args) => <StatCardRow {...args} />,
  args: {
    stats: DEFAULT_STATS,
    columns: 4,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>4-Column Metric Grid</h4>
        <StatCardRow stats={DEFAULT_STATS} columns={4} />
      </div>

      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>2-Column High-Impact KPIs</h4>
        <StatCardRow
          columns={2}
          stats={[
            {
              label: "Open Critical Tickets",
              value: 17,
              change: -25,
              color: "var(--color-danger)",
            },
            {
              label: "SLA Resolution Rate",
              value: "99.2%",
              change: 1.8,
              color: "var(--color-success)",
            },
          ]}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>Skeleton Loading State</h4>
        <StatCardRow
          columns={3}
          stats={[
            { label: "Products", value: 0, loading: true },
            { label: "Users", value: 0, loading: true },
            { label: "Revenue", value: 0, loading: true },
          ]}
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

