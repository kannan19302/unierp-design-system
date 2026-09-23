import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceShell, type WorkspaceNavItem } from "./workspace-shell";

const MOCK_NAV: WorkspaceNavItem[] = [
  { key: "canvas", label: "Visual Canvas", href: "#", active: true, group: "Authoring" },
  { key: "routes", label: "Routing & Middleware", href: "#", group: "Authoring" },
  { key: "schemas", label: "Data Schemas", href: "#", group: "Data Layer" },
  { key: "settings", label: "Project Settings", href: "#", group: "Config" },
];

const meta: Meta<typeof WorkspaceShell> = {
  title: "Core/Shell/WorkspaceShell",
  component: WorkspaceShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    scope: {
      control: "select",
      options: ["app", "site", "library", "manage"],
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceShell>;

export const Default: Story = {
  args: {
    backHref: "#",
    backLabel: "Back to App Directory",
    identity: {
      name: "Customer Onboarding App",
      kindLabel: "Tenant Application",
      status: <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success, #10b981)" }}>● Active</span>,
    },
    nav: MOCK_NAV,
    scope: "app",
    children: (
      <div style={{ padding: "24px" }}>
        <h3>App Authoring Workspace</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Studio canvas and component composition surface.
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Application Workspace Scope</h4>
        <div style={{ height: "380px", border: "1px solid var(--color-border)", position: "relative" }}>
          <WorkspaceShell
            backHref="#"
            backLabel="Back to Platform"
            identity={{
              name: "Finance & Accounts",
              kindLabel: "ERP Core Module",
            }}
            nav={MOCK_NAV}
            scope="app"
          >
            <div style={{ padding: "24px" }}>Active application authoring canvas.</div>
          </WorkspaceShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Site Scope (Web Studio)</h4>
        <div style={{ height: "380px", border: "1px solid var(--color-border)", position: "relative" }}>
          <WorkspaceShell
            backHref="#"
            backLabel="Back to Sites"
            identity={{
              name: "Customer Portal",
              kindLabel: "Web Studio Site",
            }}
            nav={MOCK_NAV}
            scope="site"
          >
            <div style={{ padding: "24px" }}>Active website authoring canvas.</div>
          </WorkspaceShell>
        </div>
      </div>
    </div>
  ),
};

