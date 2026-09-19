import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "./profile-card";

const meta: Meta<typeof ProfileCard> = {
  title: "Primitives/ProfileCard",
  component: ProfileCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Compact: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    variant: "compact",
  },
};

export const Full: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    tenantName: "Acme Global Industries",
    variant: "full",
  },
};

export const WithAvatar: Story = {
  args: {
    name: "Alex Rivera",
    email: "alex.rivera@unierp.io",
    role: "Chief Financial Officer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
    variant: "full",
  },
};

export const FullWithActions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ProfileCard
        name="Sarah Connor"
        email="sarah.connor@acme.corp"
        role="Platform Architect"
        tenantName="Acme Industrial Global"
        variant="full"
        actions={
          <div style={{ display: "flex", gap: "var(--space-2)", width: "100%" }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "var(--space-1-5) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-surface)",
                color: "var(--color-text)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                cursor: "pointer",
              }}
            >
              Manage Account
            </button>
            <button
              type="button"
              style={{
                padding: "var(--space-1-5) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-danger)",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        }
      />
    </div>
  ),
};

export const DropdownHeaderDemo = () => (
  <div
    style={{
      width: 280,
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--color-bg-elevated)",
      boxShadow: "var(--shadow-md)",
      padding: "var(--space-1)",
    }}
  >
    <ProfileCard
      name="Kannan Admin"
      email="test.agent@unierp.com"
      variant="compact"
    />
    <div
      style={{
        height: 1,
        background: "var(--color-border)",
        margin: "var(--space-1) 0",
      }}
    />
    <div
      style={{
        padding: "var(--space-1-5) var(--space-2)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        borderRadius: "var(--radius-sm)",
      }}
    >
      Tenant: Acme Corp (Super Admin)
    </div>
  </div>
);
