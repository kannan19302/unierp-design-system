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
    items: { control: false },
    onSave: { control: false },
    onDiscard: { control: false },
    children: { control: false },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    dirty: { control: "boolean" },
    saving: { control: "boolean" },
  },
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
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Dirty State with Unsaved Changes Footer</h4>
        <div style={{ height: "400px", border: "1px solid var(--color-border)", position: "relative" }}>
          <SettingsShell
            items={MOCK_SETTINGS}
            activeId="sso"
            dirty={true}
            dirtyMessage="You have unsaved changes in Single Sign-On."
            onSave={() => alert("Saved")}
            onDiscard={() => alert("Discarded")}
          >
            <div>
              <h3>Single Sign-On Configuration</h3>
              <p style={{ color: "var(--color-text-secondary)" }}>Modify identity assertion credentials.</p>
            </div>
          </SettingsShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Pristine / Saved State (No Sticky Dirty Bar)</h4>
        <div style={{ height: "350px", border: "1px solid var(--color-border)", position: "relative" }}>
          <SettingsShell
            items={MOCK_SETTINGS}
            activeId="general"
            dirty={false}
          >
            <div>
              <h3>General Information</h3>
              <p style={{ color: "var(--color-text-secondary)" }}>Organization name, legal entity, and contact email.</p>
            </div>
          </SettingsShell>
        </div>
      </div>
    </div>
  ),
};
