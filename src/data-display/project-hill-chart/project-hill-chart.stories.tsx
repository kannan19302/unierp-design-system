import type { Meta, StoryObj } from "@storybook/react";
import { ProjectHillChart, HillChartScope } from "./project-hill-chart";

const mockScopes: HillChartScope[] = [
  {
    id: "scope-1",
    name: "OAuth2 Keycloak Migration",
    position: 18,
    assignee: "Alex Rivera",
    category: "Security",
  },
  {
    id: "scope-2",
    name: "Kafka DLQ Dead-Letter Handling",
    position: 42,
    assignee: "Priya Sharma",
    category: "Infrastructure",
  },
  {
    id: "scope-3",
    name: "Stripe Billing Webhooks",
    position: 50,
    assignee: "David Chen",
    category: "Payments",
  },
  {
    id: "scope-4",
    name: "High-Density DataGrid Virtualization",
    position: 78,
    assignee: "Elena Rostova",
    category: "Frontend",
  },
  {
    id: "scope-5",
    name: "PostgreSQL RLS Tenant Isolation",
    position: 95,
    assignee: "Marcus Vance",
    category: "Database",
  },
];

const meta: Meta<typeof ProjectHillChart> = {
  title: "Data Display/ProjectHillChart",
  component: ProjectHillChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProjectHillChart>;

export const Default: Story = {
  args: {
    scopes: mockScopes,
    title: "Sprint 38 Execution Trajectory",
  },
};

export const SelectedScope: Story = {
  args: {
    scopes: mockScopes,
    selectedScopeId: "scope-4",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    scopes: mockScopes,
    density: "ultra-compact",
  },
};
