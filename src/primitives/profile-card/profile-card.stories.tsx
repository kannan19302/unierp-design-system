import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "./profile-card";
import { Badge } from "../badge";
import { Button } from "../button";

const meta: Meta<typeof ProfileCard> = {
  title: "Primitives/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### ProfileCard — User Identity & Tenant Attribution Card

The **ProfileCard** primitive encapsulates the visual representation of an enterprise identity, including display name, authenticated email, real-time presence status, tenant affiliation, role badges, and contextual account management actions.

#### Strata Design Specifications
- **Compact Variant**: Designed as a high-density, rounded card container with avatar, presence indicator dot, display name, and optional role chip. Ideal for topbar user dropdown toggles, mention cards, and assignee selectors.
- **Full Variant**: Luxury enterprise account card featuring a decorative gradient banner strip, elevated avatar with status ring, role badge, tenant scope with building icon, and responsive action toolbar.
- **Fallback Initials Generator**: Automatically computes uppercase 2-letter monogram initials if an avatar URL is omitted or fails to load.
- **WCAG 2.2 AA Compliance**: Semantic markup with structured hierarchy, readable contrast, and accessible image alternative text.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User full display name.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Jane Doe" },
      },
    },
    email: {
      control: "text",
      description: "Authenticated work email address.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "jane.doe@acme.corp" },
      },
    },
    role: {
      control: "text",
      description: "Enterprise access role or system title.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "System Administrator" },
      },
    },
    status: {
      control: "select",
      options: ["online", "away", "busy", "offline"],
      description: "Real-time presence state dot indicator.",
      table: {
        type: { summary: '"online" | "away" | "busy" | "offline"' },
        defaultValue: { summary: "online" },
      },
    },
    avatarUrl: {
      control: "text",
      description: "Remote avatar photo URL. When omitted, renders monogram fallback.",
      table: {
        type: { summary: "string" },
      },
    },
    tenantName: {
      control: "text",
      description: "Tenant or organization workspace name.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Acme Global Industries" },
      },
    },
    variant: {
      control: "select",
      options: ["compact", "full"],
      description: "Visual layout density and footprint.",
      table: {
        type: { summary: '"compact" | "full"' },
        defaultValue: { summary: "compact" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    tenantName: "Acme Global Industries",
    status: "online",
    variant: "compact",
  },
};

export const Compact: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "Admin",
    status: "online",
    variant: "compact",
  },
};

export const Full: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    tenantName: "Acme Global Industries",
    status: "online",
    variant: "full",
  },
};

export const WithAvatar: Story = {
  args: {
    name: "Alex Rivera",
    email: "alex.rivera@unierp.io",
    role: "Chief Financial Officer",
    tenantName: "Apex FinTech Cloud",
    status: "busy",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
    variant: "full",
  },
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of ProfileCard sub-elements: decorative banner strip, elevated avatar container, presence status dot, display name, role badge, tenant scope icon, and action button slots.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Full Composition (Banner + Avatar + Role + Tenant + Actions)
        </div>
        <ProfileCard
          name="Sarah Connor"
          email="sarah.connor@acme.corp"
          role="Platform Architect"
          tenantName="Acme Industrial Global"
          status="online"
          variant="full"
          avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces"
          actions={
            <div style={{ display: "flex", gap: "var(--space-2)", width: "100%" }}>
              <Button variant="primary" size="sm" style={{ flex: 1 }}>
                Manage Account
              </Button>
              <Button variant="outline" size="sm">
                Switch Tenant
              </Button>
            </div>
          }
        />
      </div>

      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Dropdown Header Integration (Compact Mode)
        </div>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-elevated)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--space-2)",
          }}
        >
          <ProfileCard
            name="Kannan Admin"
            email="test.agent@unierp.com"
            role="SUPER_ADMIN"
            status="online"
            variant="compact"
          />
          <div
            style={{
              height: 1,
              background: "var(--color-border)",
              margin: "var(--space-2) 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "var(--space-1) var(--space-2)",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Tenant: Acme Corp
            </span>
            <Badge variant="success" size="sm">ENTERPRISE_TIER</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Comprehensive matrix of ProfileCard: Compact variants across Presence Statuses (online, away, busy, offline) and Full variants with rich metadata and actions.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Compact Cards Across Presence States (Online, Away, Busy, Offline)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <ProfileCard
            name="Marcus Vance"
            email="marcus.v@acme.corp"
            role="Auditor"
            status="online"
            variant="compact"
          />
          <ProfileCard
            name="Elena Rostova"
            email="elena.r@acme.corp"
            role="Finance Lead"
            status="busy"
            avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces"
            variant="compact"
          />
          <ProfileCard
            name="David Kim"
            email="david.kim@acme.corp"
            role="DevOps"
            status="away"
            variant="compact"
          />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          2. Full Variant with Role, Tenant, and Action Controls
        </div>
        <ProfileCard
          name="Devon Chen"
          email="devon.chen@unierp.org"
          role="Chief Technology Officer"
          tenantName="Apex FinTech Cloud"
          status="online"
          variant="full"
          actions={
            <div style={{ display: "flex", gap: "var(--space-2)", width: "100%" }}>
              <Button variant="outline" size="sm" style={{ flex: 1 }}>
                Switch Tenant
              </Button>
              <Button variant="danger" size="sm">
                Log Out
              </Button>
            </div>
          }
        />
      </div>
    </div>
  ),
};
