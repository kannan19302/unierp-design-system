import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsShell, type SettingsItem } from "./settings-shell";
import { Button } from "../../primitives/button";

const EXTENDED_SETTINGS: SettingsItem[] = [
  { id: "general", label: "Organization Profile", href: "#", group: "General", keywords: ["tenant", "profile", "contact", "timezone"] },
  { id: "branding", label: "Custom Domain & Branding", href: "#", group: "General", keywords: ["logo", "cname", "whitelabel", "favicon"] },
  
  { id: "sso", label: "Single Sign-On (SAML / OIDC)", href: "#", group: "Identity & Access", keywords: ["saml", "sso", "okta", "auth0", "azure", "oidc"] },
  { id: "mfa", label: "Multi-Factor Authentication", href: "#", group: "Identity & Access", keywords: ["2fa", "totp", "fido2", "yubikey", "duo"] },
  { id: "scim", label: "Automated User Provisioning (SCIM)", href: "#", group: "Identity & Access", keywords: ["scim", "directory", "sync", "lifecycle"] },
  
  { id: "vault", label: "Hardware Security Vault & Keys", href: "#", group: "Security & Encryption", keywords: ["kms", "hsm", "keys", "byok", "encryption"] },
  { id: "ip-allowlist", label: "Network Perimeter & IP Allowlist", href: "#", group: "Security & Encryption", keywords: ["cidr", "firewall", "vpn", "ip"] },
  { id: "audit", label: "SIEM & Real-time Audit Forwarding", href: "#", group: "Security & Encryption", keywords: ["datadog", "splunk", "syslog", "stream"] },

  { id: "retention", label: "Data Retention & Legal Holds", href: "#", group: "Governance", keywords: ["gdpr", "ccpa", "purge", "archival", "retention"] },
  { id: "api-keys", label: "API Credentials & Webhooks", href: "#", group: "Developer Platform", keywords: ["keys", "tokens", "http", "rest", "endpoints"] },
];

const meta: Meta<typeof SettingsShell> = {
  title: "Shells/SettingsShell",
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

function InteractiveSettingsWorkbench({ initialDirty = false }: { initialDirty?: boolean }) {
  const [activeTab, setActiveTab] = useState("sso");
  const [isDirty, setIsDirty] = useState(initialDirty);
  const [isSaving, setIsSaving] = useState(false);
  const [enforceSSO, setEnforceSSO] = useState(true);
  const [entityId, setEntityId] = useState("urn:unierp:auth:acme-tenant-100");
  const [acsUrl, setAcsUrl] = useState("https://idp.acme-corp.internal/saml/sso");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 600);
  };

  const handleDiscard = () => {
    setEntityId("urn:unierp:auth:acme-tenant-100");
    setAcsUrl("https://idp.acme-corp.internal/saml/sso");
    setEnforceSSO(true);
    setIsDirty(false);
  };

  const handleChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setIsDirty(true);
  };

  return (
    <SettingsShell
      items={EXTENDED_SETTINGS}
      activeId={activeTab}
      dirty={isDirty}
      dirtyMessage="Unsaved changes detected in Single Sign-On configuration."
      saving={isSaving}
      onSave={handleSave}
      onDiscard={handleDiscard}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <div>
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>
            Single Sign-On (SAML 2.0 / OIDC)
          </h2>
          <p style={{ margin: 0, marginTop: "var(--space-1)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Authorize enterprise members via your corporate identity provider (Okta, Microsoft Entra ID, PingFederate).
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)", marginBlockEnd: "var(--space-1)" }}>
              SAML Audience URI / Entity ID
            </label>
            <input
              type="text"
              value={entityId}
              onChange={(e) => handleChange(setEntityId, e.target.value)}
              style={{
                inlineSize: "100%",
                paddingBlock: "var(--space-2)",
                paddingInline: "var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-elevated)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                fontFamily: "monospace",
              }}
            />
            <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px", display: "block" }}>
              Unique identifier string registered with your IdP service provider catalog.
            </span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)", marginBlockEnd: "var(--space-1)" }}>
              Assertion Consumer Service (ACS) URL
            </label>
            <input
              type="text"
              value={acsUrl}
              onChange={(e) => handleChange(setAcsUrl, e.target.value)}
              style={{
                inlineSize: "100%",
                paddingBlock: "var(--space-2)",
                paddingInline: "var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-elevated)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                fontFamily: "monospace",
              }}
            />
            <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px", display: "block" }}>
              Secure POST binding endpoint where signed assertions are ingested.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", paddingBlock: "var(--space-3)", paddingInline: "var(--space-4)", background: "var(--color-bg-sunken)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
            <input
              type="checkbox"
              id="enforce-sso"
              checked={enforceSSO}
              onChange={(e) => handleChange(setEnforceSSO, e.target.checked)}
              style={{ cursor: "pointer", inlineSize: 16, blockSize: 16 }}
            />
            <label htmlFor="enforce-sso" style={{ fontSize: "var(--text-xs)", color: "var(--color-text)", cursor: "pointer" }}>
              <strong>Strict Enforcement:</strong> Disallow password fallback and enforce mandatory SSO sign-in for all corporate email domains.
            </label>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}

export const Default: Story = {
  render: () => <InteractiveSettingsWorkbench />,
};

export const DirtyUnsavedState: Story = {
  name: "Dirty Unsaved State",
  render: () => <InteractiveSettingsWorkbench initialDirty={true} />,
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          1. Clean Pristine State (All changes saved)
        </h4>
        <div style={{ blockSize: "360px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractiveSettingsWorkbench initialDirty={false} />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          2. Dirty Warning State (Unsaved Changes Warning Band)
        </h4>
        <div style={{ blockSize: "360px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractiveSettingsWorkbench initialDirty={true} />
        </div>
      </div>
    </div>
  ),
};

export const RtlPreview: Story = {
  name: "RTL Preview",
  render: () => (
    <div dir="rtl" style={{ blockSize: "100dvh" }}>
      <InteractiveSettingsWorkbench initialDirty={true} />
    </div>
  ),
};
