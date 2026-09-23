import type { Meta, StoryObj } from "@storybook/react";
import { Presence } from "./presence";

const meta: Meta<typeof Presence> = {
  title: "Core/Primitives/Presence",
  component: Presence,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Real-time user and agent activity indicator. Supports standalone dots with radar pulse beacon animations, pill badges, and accessible screen-reader status announcements.",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["online", "busy", "away", "offline"],
      description: "Active presence lifecycle state.",
      table: {
        type: { summary: "online | busy | away | offline" },
        defaultValue: { summary: "online" },
      },
    },
    variant: {
      control: "radio",
      options: ["dot", "pill", "badge"],
      description: "Visual container format.",
      table: {
        type: { summary: "dot | pill | badge" },
        defaultValue: { summary: "dot" },
      },
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Dot diameter (sm: 6px, md: 8px, lg: 10px).",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
      },
    },
    pulse: {
      control: "boolean",
      description: "Emits expanding concentric radar ring animation for active sessions.",
    },
    showLabel: {
      control: "boolean",
      description: "Renders textual state label adjacent to dot.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Presence>;

export const Online: Story = {
  args: { status: "online", showLabel: true },
};

export const Busy: Story = {
  args: { status: "busy", showLabel: true },
};

export const Away: Story = {
  args: { status: "away", showLabel: true },
};

export const DotVariant: Story = {
  args: { status: "online", variant: "dot", size: "md", showLabel: true },
};

export const PulsingRadarDot: Story = {
  args: { status: "online", variant: "dot", pulse: true, size: "lg", showLabel: true },
};

export const StatusPills = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <Presence status="online" variant="pill" pulse />
    <Presence status="busy" variant="pill" />
    <Presence status="away" variant="pill" />
    <Presence status="offline" variant="pill" />
  </div>
);

export const StandaloneDots = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Presence status="online" variant="dot" size="sm" />
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Small (6px)</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Presence status="online" variant="dot" size="md" pulse />
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Medium Radar (8px)</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Presence status="busy" variant="dot" size="lg" pulse />
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Large Radar (10px)</span>
    </div>
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Status Core Indicator + Concentric Radar Ping Wave + Activity Label
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Presence status="online" variant="pill" pulse showLabel />
      <Presence status="busy" variant="dot" size="lg" pulse showLabel />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: All Status Tones in Pill Format */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Lifecycle Statuses (Pill Capsules)
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <Presence status="online" variant="pill" pulse />
        <Presence status="busy" variant="pill" />
        <Presence status="away" variant="pill" />
        <Presence status="offline" variant="pill" />
      </div>
    </div>

    {/* Row 2: Standalone Dots with Ping Animation */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Standalone Dots Across Sizing Scale
      </div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
          <Presence status="online" variant="dot" size="sm" />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Small (6px)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
          <Presence status="online" variant="dot" size="md" pulse />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Medium (8px)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
          <Presence status="online" variant="dot" size="lg" pulse />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Large (10px)</span>
        </div>
      </div>
    </div>
  </div>
);

