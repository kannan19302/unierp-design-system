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
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ModuleTabLayout>;

export const Default: Story = {
  args: {
    moduleId: "mod-admin",
    moduleLabel: "Tenant Administration",
    moduleIcon: Settings,
    moduleDescription: "Manage organizational structures, user permissions, and integrations",
    tabs: MOCK_TABS,
    children: (
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-elevated)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
        <h3>Module Overview Workspace</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Active tab content renders here. You can pin tabs, reorder them via the "Rearrange" action or keyboard, and inspect advanced sub-modules.
        </p>
      </div>
    ),
  },
};
