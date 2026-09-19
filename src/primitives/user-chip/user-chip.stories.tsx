import type { Meta, StoryObj } from "@storybook/react";
import { UserChip } from "./user-chip";

const meta: Meta<typeof UserChip> = {
  title: "Primitives/UserChip",
  component: UserChip,
  tags: ["autodocs"],
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

