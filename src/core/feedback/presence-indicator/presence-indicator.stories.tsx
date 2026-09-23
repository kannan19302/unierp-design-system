import type { Meta, StoryObj } from "@storybook/react";
import { PresenceIndicator } from "./presence-indicator";

const meta: Meta<typeof PresenceIndicator> = {
  title: "Core/Feedback/PresenceIndicator",
  component: PresenceIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PresenceIndicator>;

export const Default: Story = {
  args: {
    status: "online",
    name: "Jane Smith",
    statusMessage: "In a meeting until 3 PM",
    size: "md",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <PresenceIndicator
        status="busy"
        name="Marcus Rivera"
        statusMessage="Reviewing quarterly general ledger signoffs"
        size="lg"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", fontFamily: "var(--font-sans)" }}>
      <PresenceIndicator status="online" name="Alice Walker" statusMessage="Available" />
      <PresenceIndicator status="away" name="Bob Chen" statusMessage="Away for lunch" />
      <PresenceIndicator status="busy" name="Carlos Cruz" statusMessage="In high-stakes dual-signoff" />
      <PresenceIndicator status="dnd" name="Diana Prince" statusMessage="Focus mode enabled" />
      <PresenceIndicator status="offline" name="Edward Stark" statusMessage="Last seen 2h ago" />
    </div>
  ),
};
