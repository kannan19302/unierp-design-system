import type { Meta, StoryObj } from "@storybook/react";
import {
  GanttMilestoneScheduler,
  GanttChart,
  GanttTask,
} from "./gantt-chart";

const mockTasks: GanttTask[] = [
  {
    id: "task-1",
    name: "Architectural RFC & Threat Model",
    assignee: "Sarah Chen",
    startDate: "2026-10-01",
    endDate: "2026-10-06",
    startDayOffset: 0,
    durationDays: 6,
    progressPercent: 100,
    isCriticalPath: true,
  },
  {
    id: "task-2",
    name: "Core Kernel Event Bus Implementation",
    assignee: "Alex Rivera",
    startDate: "2026-10-07",
    endDate: "2026-10-18",
    startDayOffset: 6,
    durationDays: 12,
    progressPercent: 75,
    isCriticalPath: true,
  },
  {
    id: "task-3",
    name: "Hardware Testbench Integration",
    assignee: "Elena Rostova",
    startDate: "2026-10-10",
    endDate: "2026-10-20",
    startDayOffset: 9,
    durationDays: 11,
    progressPercent: 40,
    isCriticalPath: false,
  },
  {
    id: "task-4",
    name: "DO-178C Flight Safety Review Milestone",
    assignee: "FAA Audit Board",
    startDate: "2026-10-22",
    endDate: "2026-10-22",
    startDayOffset: 21,
    durationDays: 1,
    progressPercent: 0,
    isMilestone: true,
    isCriticalPath: true,
  },
  {
    id: "task-5",
    name: "Suborbital Test Flight Telemetry Validation",
    assignee: "Flight Control Team",
    startDate: "2026-10-25",
    endDate: "2026-10-30",
    startDayOffset: 24,
    durationDays: 6,
    progressPercent: 0,
    isCriticalPath: false,
  },
];

const meta: Meta<typeof GanttMilestoneScheduler> = {
  title: "Compositions/GanttMilestoneScheduler",
  component: GanttMilestoneScheduler,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    projectTitle: {
      control: "text",
      description: "Project title displayed in header.",
    },
    projectCode: {
      control: "text",
      description: "Code identifier badge.",
    },
    timeframeLabel: {
      control: "text",
      description: "Timeframe period label.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GanttMilestoneScheduler>;

export const Default: Story = {
  args: {
    projectTitle: "Project Hyperion: Autonomous Flight Software Migration",
    projectCode: "PRJ-HYP-801",
    timeframeLabel: "October 2026 (30-Day Milestone Sprint)",
    totalDays: 30,
    tasks: mockTasks,
    density: "compact",
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact Density (24px row)</h4>
        <GanttChart
          projectTitle="Sprint Alpha Fast-Track"
          projectCode="PRJ-A1"
          tasks={mockTasks.slice(0, 3)}
          density="ultra-compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact Density (28px row)</h4>
        <GanttChart
          projectTitle="Sprint Beta Normal"
          projectCode="PRJ-B2"
          tasks={mockTasks.slice(0, 3)}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Density (32px row)</h4>
        <GanttChart
          projectTitle="Sprint Gamma Standard"
          projectCode="PRJ-C3"
          tasks={mockTasks.slice(0, 3)}
          density="standard"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable Density (40px row)</h4>
        <GanttChart
          projectTitle="Sprint Delta Executive"
          projectCode="PRJ-D4"
          tasks={mockTasks.slice(0, 3)}
          density="comfortable"
        />
      </div>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <GanttMilestoneScheduler
        projectTitle="Project Hyperion: Suborbital Test Schedule"
        projectCode="PRJ-HYP-801"
        timeframeLabel="October 2026 (30-Day Milestone Sprint)"
        totalDays={30}
        tasks={mockTasks}
        density="compact"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-fg-muted)" }}>Compact Density</h3>
        <GanttMilestoneScheduler
          projectTitle="Sprint Alpha Delivery"
          projectCode="PRJ-A1"
          tasks={mockTasks.slice(0, 3)}
          density="compact"
        />
      </div>
      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-fg-muted)" }}>Ultra Compact Density</h3>
        <GanttMilestoneScheduler
          projectTitle="Sprint Beta Fast-Track"
          projectCode="PRJ-B2"
          tasks={mockTasks.slice(0, 3)}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};
