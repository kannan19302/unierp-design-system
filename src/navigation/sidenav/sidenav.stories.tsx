import type { Meta, StoryObj } from "@storybook/react";
import { SideNav } from "./sidenav";
import { LayoutDashboard, FileSpreadsheet, Users, Settings } from "lucide-react";
import { BrandMark } from "../../primitives/brand-mark";

const meta: Meta<typeof SideNav> = {
  title: "Navigation/SideNav",
  component: SideNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SideNav>;

export const Default: Story = {
  args: {
    header: <BrandMark />,
    items: [
      { key: "dash", label: "Executive Dashboard", icon: <LayoutDashboard size={16} />, active: true },
      { key: "gl", label: "General Ledger", icon: <FileSpreadsheet size={16} />, badge: "8" },
      { key: "rbac", label: "Tenant Users", icon: <Users size={16} /> },
      { key: "settings", label: "System Config", icon: <Settings size={16} /> },
    ],
  },
};
