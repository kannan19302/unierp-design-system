import type { Meta, StoryObj } from "@storybook/react";
import { ResourceCapacityHeatmap, ResourceRow } from "./resource-capacity-heatmap";

const SAMPLE_PERIODS = [
  { key: "sprint-34", label: "Sprint 34 (Sep 1–14)" },
  { key: "sprint-35", label: "Sprint 35 (Sep 15–28)" },
  { key: "sprint-36", label: "Sprint 36 (Sep 29–Oct 12)" },
];

const SAMPLE_RESOURCES: ResourceRow[] = [
  {
    id: "res-1",
    name: "Devin Vance",
    role: "Principal Architect",
    cells: [
      {
        periodKey: "sprint-34",
        allocatedHours: 42,
        capacityHours: 40,
        tasks: [
          { id: "t1", title: "Distributed Subledger Sharding", project: "UniERP Core", hours: 26 },
          { id: "t2", title: "Security Keyring Rotation RFC", project: "Infra", hours: 16 },
        ],
      },
      {
        periodKey: "sprint-35",
        allocatedHours: 36,
        capacityHours: 40,
        tasks: [{ id: "t3", title: "Kafka Event Broker Tuning", project: "UniERP Core", hours: 36 }],
      },
      {
        periodKey: "sprint-36",
        allocatedHours: 20,
        capacityHours: 40,
        tasks: [{ id: "t4", title: "Architecture Review & Mentoring", project: "Engineering", hours: 20 }],
      },
    ],
  },
  {
    id: "res-2",
    name: "Elena Rostova",
    role: "Senior SRE",
    cells: [
      {
        periodKey: "sprint-34",
        allocatedHours: 32,
        capacityHours: 40,
      },
      {
        periodKey: "sprint-35",
        allocatedHours: 48, // Overloaded
        capacityHours: 40,
        tasks: [
          { id: "t5", title: "PostgreSQL 17 Multi-Region Migration", project: "Database Ops", hours: 32 },
          { id: "t6", title: "Datadog P99 Alarm Remediation", project: "SRE On-Call", hours: 16 },
        ],
      },
      {
        periodKey: "sprint-36",
        allocatedHours: 38,
        capacityHours: 40,
      },
    ],
  },
];

const meta: Meta<typeof ResourceCapacityHeatmap> = {
  title: "DataDisplay/ResourceCapacityHeatmap",
  component: ResourceCapacityHeatmap,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResourceCapacityHeatmap>;

export const Default: Story = {
  args: {
    title: "Engineering Squad Alpha — Capacity Allocation",
    periods: SAMPLE_PERIODS,
    resources: SAMPLE_RESOURCES,
  },
};
