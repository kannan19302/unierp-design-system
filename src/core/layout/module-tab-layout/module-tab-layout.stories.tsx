import type { Meta, StoryObj } from "@storybook/react";
import { Folder, Users, Settings, Database, Activity } from "lucide-react";
import { ModuleTabLayout, type ModuleTab } from "./module-tab-layout";

const MOCK_TABS: ModuleTab[] = [
  { id: "overview", label: "Overview", href: "#overview", icon: Folder },
  { id: "users", label: "Users & Roles", href: "#users", icon: Users, badge: 14 },
  { id: "activity", label: "Live Activity", href: "#activity", icon: Activity, isDirty: true },
  { id: "settings", label: "Configuration", href: "#settings", icon: Settings, advanced: true, group: "System" },
  { id: "database", label: "Backups", href: "#database", icon: Database, advanced: true, group: "Storage" },
];

const meta: Meta<typeof ModuleTabLayout> = {
  title: "Layout/ModuleTabLayout",
  component: ModuleTabLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModuleTabLayout>;

export const AnatomyAndComposition: Story = {
  render: (args) => <ModuleTabLayout {...args} />,
  args: {
    moduleId: "mod-admin",
    moduleLabel: "Tenant Administration",
    moduleIcon: Settings,
    moduleDescription: "Manage organizational structures, user permissions, and integrations",
    tabs: MOCK_TABS,
    children: (
      <div style={{ padding: "var(--space-6)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
        <h3 style={{ margin: "0 0 8px 0" }}>Module Overview Workspace</h3>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          Active tab content renders here. You can pin tabs, reorder them via the "Rearrange" action or keyboard, and inspect advanced sub-modules.
        </p>
      </div>
    ),
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>Default Tab Layout</h4>
        <ModuleTabLayout
          moduleId="mod-inv"
          moduleLabel="Inventory Logistics"
          moduleIcon={Folder}
          moduleDescription="Stock items, valuation, and inter-warehouse transfers"
          tabs={MOCK_TABS}
        >
          <div style={{ padding: "16px", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
            Inventory active workspace view.
          </div>
        </ModuleTabLayout>
      </div>

      <div>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-primary)" }}>Card Variant</h4>
        <ModuleTabLayout
          moduleId="mod-sec"
          moduleLabel="Security & Audit"
          moduleIcon={Settings}
          moduleDescription="Access control logs, SAML/OIDC policies, and API keys"
          variant="card"
          tabs={MOCK_TABS}
        >
          <div style={{ padding: "16px" }}>
            Security compliance audit logs and authorization rules.
          </div>
        </ModuleTabLayout>
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

