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

export const Searchable: Story = {
  args: {
    header: <BrandMark />,
    searchable: true,
    searchPlaceholder: "Search navigation… (/)",
    items: [
      { key: "dash", label: "Executive Dashboard", icon: <LayoutDashboard size={16} />, active: true },
      { key: "gl", label: "General Ledger", icon: <FileSpreadsheet size={16} />, badge: "8" },
      { key: "ar", label: "Accounts Receivable", icon: <FileSpreadsheet size={16} /> },
      { key: "ap", label: "Accounts Payable", icon: <FileSpreadsheet size={16} /> },
      { key: "tax", label: "Tax & Compliance", icon: <FileSpreadsheet size={16} /> },
      { key: "settings", label: "System Settings", icon: <Settings size={16} /> },
    ],
    globalResults: [
      { key: "g1", label: "Payroll Batches", group: "HR" },
      { key: "g2", label: "Stock Requisitions", group: "Inventory" },
    ],
  },
};

export const EnterpriseSectionsAndFavorites: Story = {
  args: {
    header: <BrandMark />,
    searchable: true,
    allowFavorites: true,
    favorites: ["gl", "ap"],
    sections: [
      {
        id: "core",
        title: "Executive & Core",
        collapsible: true,
        defaultOpen: true,
        items: [
          { key: "dash", label: "Executive Dashboard", icon: <LayoutDashboard size={16} />, active: true },
        ],
      },
      {
        id: "ledger",
        title: "Ledger & Treasury",
        collapsible: true,
        defaultOpen: true,
        items: [
          {
            key: "gl",
            label: "General Ledger",
            icon: <FileSpreadsheet size={16} />,
            badge: "4",
            quickAction: {
              label: "New Journal",
              icon: <span>+</span>,
              onClick: () => alert("New Journal Clicked"),
            },
          },
        ],
      },
      {
        id: "ops",
        title: "Operations (AR / AP)",
        collapsible: true,
        defaultOpen: true,
        items: [
          {
            key: "ar",
            label: "Accounts Receivable",
            icon: <FileSpreadsheet size={16} />,
            quickAction: {
              label: "New Invoice",
              icon: <span>+</span>,
              onClick: () => alert("New Invoice Clicked"),
            },
          },
          {
            key: "ap",
            label: "Accounts Payable",
            icon: <FileSpreadsheet size={16} />,
            badge: "3",
            quickAction: {
              label: "New Bill",
              icon: <span>+</span>,
              onClick: () => alert("New Bill Clicked"),
            },
          },
        ],
      },
      {
        id: "admin",
        title: "Administration",
        collapsible: true,
        defaultOpen: false,
        items: [
          { key: "users", label: "Tenant Users", icon: <Users size={16} /> },
          { key: "settings", label: "Financial Settings", icon: <Settings size={16} /> },
        ],
      },
    ],
  },
};

export const MiniRailCollapsed: Story = {
  args: {
    collapsed: true,
    items: [
      { key: "dash", label: "Dashboard", icon: <LayoutDashboard size={16} />, active: true },
      { key: "gl", label: "Ledger", icon: <FileSpreadsheet size={16} /> },
      { key: "users", label: "Users", icon: <Users size={16} /> },
      { key: "settings", label: "Settings", icon: <Settings size={16} /> },
    ],
  },
};

