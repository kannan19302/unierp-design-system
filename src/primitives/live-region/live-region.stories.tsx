import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LiveRegion, type LiveRegionProps } from "./live-region";
import { Button } from "../button";

const meta: Meta<typeof LiveRegion> = {
  title: "Core/Primitives/LiveRegion",
  component: LiveRegion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### LiveRegion — Dynamic ARIA Announcer & Stream Beacon

The **LiveRegion** primitive ensures dynamic DOM content mutations (such as async worker progress, Kafka event ingestion, background syncs, and fiscal batch completions) are proactively and accurately announced to assistive technology without disrupting user focus.

#### Strata Design Specifications
- **Visual Display Modes**:
  - \`hidden\`: Invisible to sighted users via screen-reader only utility (\`.sr-only\`), strictly broadcasting to assistive devices.
  - \`badge\`: Compact pill with glowing radar ping, ideal for telemetry bars and status monitors.
  - \`banner\`: Full-width or inline enterprise alert box with real-time status beacon.
  - \`hud\`: Dense monospace telemetry console for distributed infrastructure or database replication status.
- **Politeness Levels**:
  - \`polite\`: Queues announcement until user finishes their current voiceover/action (default).
  - \`assertive\`: Immediately interrupts user for critical system alerts or failure conditions.
- **WCAG 2.2 AA Compliance**: Implements \`aria-live\`, \`aria-atomic\`, and \`aria-relevant\` according to W3C ARIA Authoring Practices.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    politeness: {
      control: "select",
      options: ["polite", "assertive", "off"],
      description: "Aria politeness level indicating urgency to screen readers.",
      table: {
        type: { summary: '"polite" | "assertive" | "off"' },
        defaultValue: { summary: "polite" },
      },
    },
    variant: {
      control: "select",
      options: ["banner", "badge", "hud", "hidden"],
      description: "Visual container styling and beacon presence.",
      table: {
        type: { summary: '"banner" | "badge" | "hud" | "hidden"' },
        defaultValue: { summary: "banner" },
      },
    },
    role: {
      control: "select",
      options: ["status", "alert", "log"],
      description: "ARIA role assigned to the container.",
      table: {
        type: { summary: '"status" | "alert" | "log"' },
        defaultValue: { summary: "status" },
      },
    },
    atomic: {
      control: "boolean",
      description: "Whether assistive tech announces the entire region when any part changes.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    visuallyHidden: {
      control: "boolean",
      description: "Deprecated shortcut for variant='hidden'.",
      table: {
        type: { summary: "boolean" },
      },
    },
    children: {
      control: "text",
      description: "Announced message or stream nodes.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LiveRegion>;

function InteractiveLiveRegionDemo(props: Partial<LiveRegionProps>) {
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("Batch #4820 initiated in background.");

  const handleUpdate = () => {
    const next = count + 1;
    setCount(next);
    setMessage(`Reconciled batch #${4820 + next}: ${next * 14} journal vouchers posted.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 440 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Simulate background worker dispatch
        </span>
        <Button variant="primary" size="sm" onClick={handleUpdate}>
          Dispatch Announcement
        </Button>
      </div>

      <LiveRegion variant="banner" politeness="polite" {...props}>
        {message}
      </LiveRegion>
    </div>
  );
}

export const Default: Story = {
  args: {
    variant: "banner",
    politeness: "polite",
    children: "Financial year-end ledger close is running in background.",
  },
};

export const PoliteBanner: Story = {
  render: () => <InteractiveLiveRegionDemo politeness="polite" />,
};

export const AssertiveAlert: Story = {
  render: () => (
    <InteractiveLiveRegionDemo
      politeness="assertive"
      children="Critical: Fiscal period Q3 reconciliation threshold exceeded!"
    />
  ),
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of LiveRegion anatomy: radar beacon ping animation, politeness tag indicator, and live text broadcast container.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 460 }}>
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
          Banner Anatomy (Beacon Dot + Radar Wave + Politeness Pill + Live Body)
        </div>
        <LiveRegion variant="banner" politeness="polite">
          <span>Worker node [us-east-1a] synchronizing 1,240 journal entries</span>
        </LiveRegion>
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
          Telemetry HUD Anatomy (Monospace Stream Indicator)
        </div>
        <LiveRegion variant="hud" politeness="polite">
          <span>SYNC: ACTIVE</span>
          <span>|</span>
          <span>LATENCY: 14ms</span>
          <span>|</span>
          <span>OUTBOX: 0 PENDING</span>
        </LiveRegion>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Complete matrix of LiveRegion variants: Banner, Badge, and HUD modes with polite vs assertive priority triggers.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 480 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Banner Variants (Polite vs Assertive)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <LiveRegion variant="banner" politeness="polite">
            Normal background task: CSV export file ready for download.
          </LiveRegion>
          <LiveRegion variant="banner" politeness="assertive">
            Security alert: Concurrent login detected from unknown IP 198.51.100.42.
          </LiveRegion>
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
          2. Badge Capsule Variants
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <LiveRegion variant="badge" politeness="polite">
            Connected to Kafka stream (cluster us-east-1)
          </LiveRegion>
          <LiveRegion variant="badge" politeness="assertive">
            Failover active: Read-only replica mode
          </LiveRegion>
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
          3. Real-Time Telemetry HUD
        </div>
        <LiveRegion variant="hud" politeness="polite">
          <span>EVENT_STORE: REPLICATED</span>
          <span>|</span>
          <span>CDC_LAG: 0.2s</span>
          <span>|</span>
          <span>TENANT_ISOLATION: STRICT</span>
        </LiveRegion>
      </div>
    </div>
  ),
};
