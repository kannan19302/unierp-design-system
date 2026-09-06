import type { Meta, StoryObj } from "@storybook/react";
import { IncidentEscalationTree, type EscalationTier } from "./incident-escalation-tree";

const mockTiers: EscalationTier[] = [
  {
    id: "tier-1",
    tierNumber: 1,
    name: "Primary SRE On-Call",
    timeoutMinutes: 10,
    status: "paging",
    responders: [
      {
        id: "resp-1",
        name: "Devon Vance",
        role: "Principal SRE",
        status: "on_call",
        channels: ["push", "sms", "phone"],
      },
      {
        id: "resp-2",
        name: "Elena Rostova",
        role: "Senior Systems Engineer",
        status: "backup",
        channels: ["push", "email"],
      },
    ],
  },
  {
    id: "tier-2",
    tierNumber: 2,
    name: "Secondary Infrastructure Escalation",
    timeoutMinutes: 15,
    status: "waiting",
    responders: [
      {
        id: "resp-3",
        name: "Marcus Aurel",
        role: "Staff Infrastructure Architect",
        status: "backup",
        channels: ["phone", "webhook"],
      },
    ],
  },
  {
    id: "tier-3",
    tierNumber: 3,
    name: "Incident Commander & VP Eng",
    timeoutMinutes: 30,
    status: "waiting",
    responders: [
      {
        id: "resp-4",
        name: "Sarah Chen",
        role: "VP of Cloud Reliability",
        status: "backup",
        channels: ["phone", "sms"],
      },
    ],
  },
];

const meta: Meta<typeof IncidentEscalationTree> = {
  title: "Workflow/IncidentEscalationTree",
  component: IncidentEscalationTree,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IncidentEscalationTree>;

export const Default: Story = {
  args: {
    title: "P1 Infrastructure Critical Escalation Policy",
    tiers: mockTiers,
    policyStatus: "active",
    activeTierIndex: 0,
  },
};

export const Standby: Story = {
  args: {
    title: "Weekend Datacenter Rotation",
    tiers: mockTiers.map((t) => ({ ...t, status: "waiting" })),
    policyStatus: "standby",
    activeTierIndex: 0,
  },
};
