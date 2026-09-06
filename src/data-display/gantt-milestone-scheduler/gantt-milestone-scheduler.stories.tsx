import type { Meta, StoryObj } from "@storybook/react";
import {
  GanttMilestoneScheduler,
  GanttTask,
} from "./gantt-milestone-scheduler";

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
  title: "Data Display/GanttMilestoneScheduler",
  component: GanttMilestoneScheduler,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
