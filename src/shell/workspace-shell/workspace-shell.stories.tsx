import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceShell, type WorkspaceNavItem } from "./workspace-shell";

const MOCK_NAV: WorkspaceNavItem[] = [
  { key: "canvas", label: "Visual Canvas", href: "#", active: true, group: "Authoring" },
  { key: "routes", label: "Routing & Middleware", href: "#", group: "Authoring" },
  { key: "schemas", label: "Data Schemas", href: "#", group: "Data Layer" },
  { key: "settings", label: "Project Settings", href: "#", group: "Config" },
];

const meta: Meta<typeof WorkspaceShell> = {
  title: "Shell/WorkspaceShell",
  component: WorkspaceShell,
  parameters: { layout: "fullscreen" },
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
