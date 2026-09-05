import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AccountCenterShell, type AccountSection } from "./account-center";

const sampleSections: AccountSection[] = [
  { id: "profile", label: "My Profile", description: "Personal details and public identity" },
  { id: "security", label: "Password & Security", badge: "2FA On", description: "Credentials and authentication methods" },
  { id: "sessions", label: "Active Sessions", badge: 3, description: "Devices currently signed in" },
  { id: "preferences", label: "Preferences & Density", description: "Display density and language" },
  { id: "accessibility", label: "Accessibility & Themes", description: "High contrast and reduced motion" },
];

const meta: Meta<typeof AccountCenterShell> = {
  title: "Shell/AccountCenterShell",
  component: AccountCenterShell,
  parameters: { layout: "fullscreen" },
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
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
            {sampleSections.find((s) => s.id === activeSection)?.label}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
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
