import type { Meta, StoryObj } from "@storybook/react";
import { BillableTimerDock } from "./billable-timer-dock";
import type { MatterOrProject } from "./billable-timer-dock";

const mockProjects: MatterOrProject[] = [
  {
    id: "proj-1",
    name: "Series B Financing Due Diligence",
    code: "CORP-2026-08",
    clientName: "Acme Quantum Technologies",
    hourlyRate: 450.0,
  },
  {
    id: "proj-2",
    name: "Cross-Border IP Licensing Agreement",
    code: "IP-2026-44",
    clientName: "Nordic Biotech AB",
    hourlyRate: 520.0,
  },
  {
    id: "proj-3",
    name: "GDPR / EU AI Act Compliance Audit",
    code: "REG-2026-12",
    clientName: "Global FinCloud Inc",
    hourlyRate: 380.0,
  },
];

const meta: Meta<typeof BillableTimerDock> = {
  title: "Layout/BillableTimerDock",
  component: BillableTimerDock,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BillableTimerDock>;

export const ExpandedDock: Story = {
  args: {
    projects: mockProjects,
    initialMinimized: false,
    currency: "$",
    density: "compact",
  },
};

export const MinimizedFloatingState: Story = {
  args: {
    projects: mockProjects,
    initialMinimized: true,
    currency: "$",
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    projects: mockProjects,
    initialMinimized: false,
    currency: "$",
    density: "ultra-compact",
  },
};
