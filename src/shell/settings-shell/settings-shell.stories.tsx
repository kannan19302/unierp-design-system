import type { Meta, StoryObj } from "@storybook/react";
import { SettingsShell, type SettingsItem } from "./settings-shell";

const MOCK_SETTINGS: SettingsItem[] = [
  { id: "general", label: "General Information", href: "#", group: "Account" },
  { id: "sso", label: "Single Sign-On (SAML / OIDC)", href: "#", group: "Security", keywords: ["saml", "sso", "okta", "auth"] },
  { id: "api-keys", label: "API Keys & Webhooks", href: "#", group: "Developer", keywords: ["keys", "tokens", "http"] },
  { id: "retention", label: "Data Retention & Archival", href: "#", group: "Compliance" },
];

const meta: Meta<typeof SettingsShell> = {
  title: "Shell/SettingsShell",
  component: SettingsShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SettingsShell>;

export const Default: Story = {
  args: {
    items: MOCK_SETTINGS,
    activeId: "sso",
    dirty: true,
    children: (
      <div>
        <h3>Single Sign-On Configuration</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Configure enterprise Identity Provider assertion endpoints.
        </p>
        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "var(--text-sm)" }}>SAML Entity ID</label>
          <input
            type="text"
            defaultValue="urn:unierp:auth:tenant-100"
            style={{ width: "100%", maxWidth: 400, padding: "8px", border: "1px solid var(--color-border-default)", borderRadius: "4px" }}
          />
        </div>
      </div>
    ),
  },
};
