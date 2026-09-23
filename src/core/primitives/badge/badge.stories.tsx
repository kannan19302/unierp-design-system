import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { StatusBadge } from "./status-badge";

const meta: Meta<typeof Badge> = {
  title: "Core/Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compact status indicator and metadata tag for labeling record states, workflow phases, numerical counts, and live activity streams.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info"],
      description: "Semantic color intent of the badge.",
      table: {
        type: { summary: "default | primary | success | warning | danger | info" },
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Ergonomic badge height (sm: 20px, md: 24px).",
      table: {
        type: { summary: "sm | md" },
        defaultValue: { summary: "sm" },
      },
    },
    dot: {
      control: "boolean",
      description: "Renders an integrated 6px status dot indicator.",
    },
    pulse: {
      control: "boolean",
      description: "Applies a smooth radar beacon pulse animation for live activity.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Draft",
    variant: "default",
    size: "sm",
    dot: true,
  },
};

export const Success: Story = {
  args: {
    children: "Approved",
    variant: "success",
    size: "sm",
    dot: true,
  },
};

export const Warning: Story = {
  args: {
    children: "Pending Review",
    variant: "warning",
    size: "sm",
    dot: true,
  },
};

export const Danger: Story = {
  args: {
    children: "Rejected",
    variant: "danger",
    size: "sm",
    dot: true,
  },
};

export const StatusMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
    <StatusBadge status="ACTIVE" />
    <StatusBadge status="PENDING" />
    <StatusBadge status="PARTIALLY_PAID" />
    <StatusBadge status="OVERDUE" />
    <StatusBadge status="CANCELLED" />
    <StatusBadge status="DRAFT" />
  </div>
);

export const PulsingLiveBadges = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Badge variant="success" dot pulse>Live Production</Badge>
    <Badge variant="warning" dot pulse>Syncing (42%)</Badge>
    <Badge variant="danger" dot pulse>Degraded API</Badge>
    <Badge variant="info" dot pulse>Deploying v2.4</Badge>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Badge variant="primary" size="sm" dot>Small (20px)</Badge>
      <Badge variant="success" size="sm" dot>Approved</Badge>
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Badge variant="primary" size="md" dot>Medium (24px)</Badge>
      <Badge variant="success" size="md" dot>Approved</Badge>
    </div>
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Status Dot + Text Label + Radar Ping Animation Ring
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Badge variant="success" dot pulse>Live Streaming</Badge>
      <Badge variant="primary" dot>Version 2.4</Badge>
      <Badge variant="default">Plain Tag</Badge>
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: Semantic Tones */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Semantic Tones (Default, Primary, Success, Warning, Danger, Info)
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <Badge variant="default" dot>Default</Badge>
        <Badge variant="primary" dot>Primary</Badge>
        <Badge variant="success" dot>Success</Badge>
        <Badge variant="warning" dot>Warning</Badge>
        <Badge variant="danger" dot>Danger</Badge>
        <Badge variant="info" dot>Info</Badge>
      </div>
    </div>

    {/* Row 2: Live Activity Indicators */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Real-time Activity & Radar Beacons
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
        <Badge variant="success" dot pulse>Live Sync (Active)</Badge>
        <Badge variant="warning" dot pulse>Processing Reconciliation</Badge>
        <Badge variant="danger" dot pulse>Failed Heartbeat</Badge>
        <Badge variant="info" dot pulse>Deploying</Badge>
      </div>
    </div>

    {/* Row 3: Domain Record Status Mappings */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        ERP Domain Record States
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <StatusBadge status="ACTIVE" />
        <StatusBadge status="PENDING" />
        <StatusBadge status="PARTIALLY_PAID" />
        <StatusBadge status="OVERDUE" />
        <StatusBadge status="CANCELLED" />
        <StatusBadge status="DRAFT" />
      </div>
    </div>
  </div>
);

