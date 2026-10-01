import type { Meta, StoryObj } from "@storybook/react";
import { StrataAppGrid } from "./strata-app-grid";

const meta: Meta<typeof StrataAppGrid> = {
  title: "Navigation/StrataAppGrid",
  component: StrataAppGrid,
  parameters: { layout: "padded" },
  args: {
    label: "Business applications",
    apps: [
      { id: "finance", icon: "F", name: "Finance", description: "Ledgers and cash management", href: "/finance" },
      { id: "crm", icon: "C", name: "CRM", description: "Customer relationships and sales", href: "/crm" },
      { id: "inventory", icon: "I", name: "Inventory", description: "Stock and fulfillment", href: "/inventory" },
      { id: "sales", icon: "S", name: "Sales", description: "Orders and revenue", href: "/sales" },
      { id: "projects", icon: "P", name: "Projects", description: "Plans, work, and delivery", href: "/projects" },
      { id: "analytics", icon: "A", name: "Analytics", description: "Reports and insights", href: "/analytics" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof StrataAppGrid>;

export const Default: Story = {};
export const Empty: Story = { args: { apps: [] } };
