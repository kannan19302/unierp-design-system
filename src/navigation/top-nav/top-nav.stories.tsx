import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Boxes, ChartNoAxesCombined, ClipboardList, FileText, House, Search } from "lucide-react";
import { TopNav, type TopNavProps } from "./top-nav";

const meta: Meta<typeof TopNav> = {
  title: "Navigation/TopNav",
  component: TopNav,
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
    },
  },
};

export default meta;
type Story = StoryObj<typeof TopNav>;

const commonProps: TopNavProps = {
  platformName: "Business Suite",
  user: { name: "Alex Chen", email: "alex@acme.example" },
  tenant: { id: "acme", name: "Acme Inc" },
  availableTenants: [
    { id: "acme", name: "Acme Inc" },
    { id: "stark", name: "Stark Industries" },
    { id: "wayne", name: "Wayne Enterprises" },
  ],
  environmentLabel: "Demo",
  breadcrumbs: [
    { key: "home", label: "Home", href: "#home" },
    { key: "workspace", label: "Workspace", href: "#workspace" },
    { key: "overview", label: "Overview" },
  ],
  actions: (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        inlineSize: 32,
        blockSize: 32,
        border: "none",
        background: "transparent",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        color: "var(--color-text-secondary)",
      }}
      aria-label="Example notifications"
      title="Example notifications"
    >
      <Bell size={17} aria-hidden="true" />
    </button>
  ),
  onToggleSidebar: () => {},
  onSignOut: () => {},
};

const navItems = [
  { id: "overview", label: "Overview", icon: <House size={16} aria-hidden="true" />, active: true },
  { id: "orders", label: "Work orders", icon: <ClipboardList size={16} aria-hidden="true" /> },
  { id: "inventory", label: "Inventory", icon: <Boxes size={16} aria-hidden="true" /> },
  { id: "reports", label: "Reports", icon: <ChartNoAxesCombined size={16} aria-hidden="true" /> },
  { id: "documents", label: "Documents", icon: <FileText size={16} aria-hidden="true" /> },
];

export const Default: Story = {
  args: {
    ...commonProps,
    density: "standard",
  },
};

export const WithNavigationItems: Story = {
  args: {
    ...commonProps,
    items: navItems,
    density: "standard",
  },
};

export const CompactDensity: Story = {
  args: {
    ...commonProps,
    items: navItems,
    density: "compact",
  },
};

export const ComfortableDensity: Story = {
  args: {
    ...commonProps,
    items: navItems,
    density: "comfortable",
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Standard Density (Default)
        </p>
        <TopNav {...commonProps} density="standard" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Compact Density with Navigation Items
        </p>
        <TopNav {...commonProps} items={navItems} density="compact" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Ultra-Compact Density (Dense Trading / Matrix floorplans)
        </p>
        <TopNav {...commonProps} density="ultra-compact" />
      </div>
    </div>
  ),
};
