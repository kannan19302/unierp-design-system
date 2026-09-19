import type { Meta, StoryObj } from "@storybook/react";
import { UserChip } from "./user-chip";

const meta: Meta<typeof UserChip> = {
  title: "Primitives/UserChip",
  component: UserChip,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compact interactive identity capsule representing assigned team members, approvers, auditors, or active session participants. Features presence status indicators and optional removal affordances.",
      },
    },
  },
  argTypes: {
    name: {
      control: "text",
      description: "User display name for initials and label text.",
    },
    role: {
      control: "text",
      description: "Optional role or designation subtitle.",
    },
    shape: {
      control: "radio",
      options: ["pill", "rounded"],
      description: "Border-radius geometry (pill: 9999px capsule, rounded: 6px).",
    },
    size: {
      control: "radio",
      options: ["sm", "md"],
      description: "Ergonomic height tier (sm: 24px, md: 32px).",
    },
    status: {
      control: "select",
      options: ["online", "busy", "away", "offline"],
      description: "Real-time activity status dot.",
    },
    onRemove: {
      action: "removed",
      description: "Callback invoked when remove cross icon is triggered.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserChip>;

export const Default: Story = {
  args: {
    name: "Alex Rivera",
    role: "Financial Controller",
    status: "online",
    shape: "pill",
    size: "md",
  },
};

export const BusyState: Story = {
  args: {
    name: "Dr. Elena Rostova",
    role: "Lead Auditor",
    status: "busy",
    shape: "pill",
    size: "md",
  },
};

export const ShapesAndSizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <UserChip name="Alex Rivera" role="Financial Controller" status="online" shape="pill" size="md" />
      <UserChip name="Marcus Vance" role="Senior Accountant" status="away" shape="rounded" size="md" />
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <UserChip name="Sarah Connor" role="Admin" status="busy" shape="pill" size="sm" />
      <UserChip name="David Kim" role="Staff Auditor" status="offline" shape="rounded" size="sm" />
    </div>
  </div>
);

export const InteractiveAndRemovable = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <UserChip
      name="Alex Rivera"
      role="Financial Controller"
      status="online"
      shape="pill"
      onClick={() => alert("Clicked Alex Rivera")}
    />
    <UserChip
      name="Elena Rostova"
      role="Lead Auditor"
      status="busy"
      shape="pill"
      onRemove={() => alert("Removed Elena")}
    />
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Avatar Initials + Presence Dot + Name Label + Role Subtitle + Remove Button
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <UserChip
        name="Sarah Connor"
        role="Operations Architect"
        status="online"
        shape="pill"
        size="md"
        onRemove={() => {}}
      />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: Shapes */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Shapes (Capsule Pill vs Rounded 6px)
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <UserChip name="Alex Rivera" role="Controller" status="online" shape="pill" />
        <UserChip name="Elena Rostova" role="Auditor" status="busy" shape="rounded" />
      </div>
    </div>

    {/* Row 2: Real-time Presence Indicators */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Real-time Presence Statuses
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <UserChip name="Online User" status="online" shape="pill" size="sm" />
        <UserChip name="Busy User" status="busy" shape="pill" size="sm" />
        <UserChip name="Away User" status="away" shape="pill" size="sm" />
        <UserChip name="Offline User" status="offline" shape="pill" size="sm" />
      </div>
    </div>

    {/* Row 3: Removable Tags */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Removable Approver Chips
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <UserChip name="Marcus Vance" role="CFO" status="online" shape="pill" onRemove={() => {}} />
        <UserChip name="David Kim" role="Staff" status="away" shape="pill" onRemove={() => {}} />
      </div>
    </div>
  </div>
);

