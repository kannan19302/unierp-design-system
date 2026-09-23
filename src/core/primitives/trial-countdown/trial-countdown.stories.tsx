import type { Meta, StoryObj } from "@storybook/react";
import { TrialCountdown } from "./trial-countdown";

const meta: Meta<typeof TrialCountdown> = {
  title: "Core/Primitives/TrialCountdown",
  component: TrialCountdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### TrialCountdown — Second-Accurate Tenancy Trial Monitor

The **TrialCountdown** primitive renders a high-precision countdown timer for tenant trial evaluation windows, dynamic feature flags, and time-restricted sandbox environments.

#### Strata Design Specifications
- **Dynamic Urgency States**:
  - **Standard Active**: Days remaining &gt; 3. Calm accent palette.
  - **Warning**: Days remaining &le; 3. Amber accent indicating upcoming expiration.
  - **Critical**: Hours remaining &lt; 24. High-contrast red urgent state prompting subscription upgrade.
  - **Expired**: Deadline reached. Clear terminal notification.
- **Screen Reader Safety**: Uses hidden accessible labels and semantic \`<time>\` tag with ISO 8601 \`dateTime\` string to avoid noisy screen reader announcements on every tick.
- **Lifecycle Triggers**: Dispatches \`onExpired()\` callback upon hitting zero.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    endsAt: {
      control: "text",
      description: "ISO date string or Date object representing the trial expiration deadline.",
      table: {
        type: { summary: "string | Date" },
      },
    },
    onExpired: {
      action: "expired",
      description: "Callback triggered when countdown reaches zero seconds.",
      table: {
        type: { summary: "() => void" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TrialCountdown>;

export const Default: Story = {
  args: {
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const Active: Story = {
  args: {
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const Expired: Story = {
  args: {
    endsAt: new Date(Date.now() - 1000).toISOString(),
  },
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of TrialCountdown: screen reader announcement banner, formatted tabular timer values, and urgency accent container.",
      },
    },
  },
  render: () => {
    const activeEndsAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    return (
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
            Banner Integration (Tenant Header / Billing Ribbon)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <TrialCountdown endsAt={activeEndsAt} />
          </div>
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Complete urgency matrix: Standard Active (>3d), Warning (<=3d), Critical (<24h), and Expired states.",
      },
    },
  },
  render: () => {
    const now = Date.now();
    const normalEndsAt = new Date(now + 12 * 24 * 60 * 60 * 1000).toISOString();
    const warningEndsAt = new Date(now + 2 * 24 * 60 * 60 * 1000 + 4 * 3600 * 1000).toISOString();
    const criticalEndsAt = new Date(now + 5 * 3600 * 1000 + 30 * 60 * 1000).toISOString();
    const expiredEndsAt = new Date(now - 1000).toISOString();

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
            1. Standard Active State (&gt; 3 Days)
          </div>
          <TrialCountdown endsAt={normalEndsAt} />
        </div>
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
            2. Warning State (&le; 3 Days)
          </div>
          <TrialCountdown endsAt={warningEndsAt} />
        </div>
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
            3. Critical State (&lt; 24 Hours)
          </div>
          <TrialCountdown endsAt={criticalEndsAt} />
        </div>
        <div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
            4. Expired State
          </div>
          <TrialCountdown endsAt={expiredEndsAt} />
        </div>
      </div>
    );
  },
};
