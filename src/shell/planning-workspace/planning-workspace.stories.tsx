import type { Meta, StoryObj } from "@storybook/react";
import { PlanningWorkspace } from "./planning-workspace";
import { Button } from "../../primitives/button";

const meta: Meta<typeof PlanningWorkspace> = {
  title: "Shell/Floorplans/PlanningWorkspace",
  component: PlanningWorkspace,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    action: { control: false },
    segments: { control: false },
    state: { control: false },
    legend: { control: false },
    actions: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof PlanningWorkspace>;

export const ProjectRoadmap: Story = {
  args: {
    segments: [
      { label: "Acme Enterprise", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Roadmap 2026", href: "/projects/roadmap" },
      { label: "Gantt Timeline" },
    ],
    state: { label: "On Track", tone: "success" },
    action: { label: "Add Milestone", onClick: () => alert("Add Milestone") },
    title: "Engineering Roadmap & Milestone Schedule",
    subtitle: "Cross-functional dependency and resource allocation planner.",
    periodLabel: "September 2026",
    onPrevPeriod: () => console.log("prev"),
    onNextPeriod: () => console.log("next"),
    onToday: () => console.log("today"),
    legend: (
      <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-xs)" }}>
        <span>🟢 Completed (14)</span>
        <span>🔵 In Progress (8)</span>
        <span>🟡 Critical Path (3)</span>
      </div>
    ),
    children: (
      <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-secondary)" }}>
        Timeline Canvas Placeholder (Interactive Gantt Grid)
      </div>
    ),
    actions: <Button variant="primary">Export Plan</Button>,
  },
};
