import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AccountCenterShell, type AccountSection } from "./account-center";
import { Button } from "../../../core/primitives/button";

const sampleSections: AccountSection[] = [
  { id: "profile", label: "My Profile", description: "Personal details and public identity" },
  { id: "security", label: "Password & Security", badge: "2FA On", description: "Credentials and authentication methods" },
  { id: "sessions", label: "Active Sessions", badge: 3, description: "Devices currently signed in" },
  { id: "preferences", label: "Preferences & Density", description: "Display density and language" },
  { id: "accessibility", label: "Accessibility & Themes", description: "High contrast and reduced motion" },
];

const meta: Meta<typeof AccountCenterShell> = {
  title: "Platforms/Identity/AccountCenterShell",
  component: AccountCenterShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccountCenterShell>;

export const Default: Story = {
  render: () => {
    const [activeSection, setActiveSection] = useState("profile");
    return (
      <AccountCenterShell
        user={{
          name: "Sarah Connor",
          email: "sarah.connor@cyberdyne.corp",
          role: "Enterprise Administrator",
          tenantName: "Cyberdyne Systems EMEA",
        }}
        sections={sampleSections}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)" }}>
            {sampleSections.find((s) => s.id === activeSection)?.label}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
            {sampleSections.find((s) => s.id === activeSection)?.description}
          </p>
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            Settings form contents for {activeSection}
          </div>
        </div>
      </AccountCenterShell>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "550px" }}>
      <AccountCenterShell
        user={{
          name: "Alex Morgan",
          email: "alex.morgan@acme-global.com",
          role: "Chief Architect",
          tenantName: "Acme Global HQ",
        }}
        sections={sampleSections}
        activeSection="security"
        onNavigate={() => {}}
        headerActions={
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="secondary" size="sm">Export Data</Button>
            <Button variant="danger" size="sm">Revoke All Sessions</Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <h3>Multi-Factor Authentication & Passkeys</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
            Enterprise compliance requires WebAuthn FIDO2 passkeys for root tenancy access.
          </p>
          <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-4)", borderRadius: "var(--radius-md)" }}>
            <strong>Registered Passkey:</strong> YubiKey 5C NFC (Enrolled 2026-04-12)
          </div>
        </div>
      </AccountCenterShell>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Default Standard Profile State
        </h4>
        <div style={{ height: "360px", border: "1px solid var(--color-border)" }}>
          <AccountCenterShell
            user={{
              name: "Jordan Lee",
              email: "jordan.lee@example.com",
              role: "Billing Manager",
              tenantName: "FinTech Prime",
            }}
            sections={sampleSections.slice(0, 3)}
            activeSection="profile"
            onNavigate={() => {}}
          >
            <div>Profile settings loaded.</div>
          </AccountCenterShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Multi-Tenant Switching / No Avatar Fallback State
        </h4>
        <div style={{ height: "360px", border: "1px solid var(--color-border)" }}>
          <AccountCenterShell
            user={{
              name: "Kannan P",
              email: "kannan@unierp.com",
              role: "Platform Engineer",
              tenantName: "UniERP Core Labs",
            }}
            sections={sampleSections}
            activeSection="sessions"
            onNavigate={() => {}}
          >
            <div>3 active concurrent sessions across 2 verified devices.</div>
          </AccountCenterShell>
        </div>
      </div>
    </div>
  ),
};
