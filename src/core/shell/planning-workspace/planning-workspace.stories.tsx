import type { Meta, StoryObj } from "@storybook/react";
import { PlanningWorkspace } from "./planning-workspace";
import { Button } from "../../primitives/button";

const meta: Meta<typeof PlanningWorkspace> = {
  title: "Core/Shell/Floorplans/PlanningWorkspace",
  component: PlanningWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    action: { control: false },
    segments: { control: false },
    state: { control: false },
    legend: { control: false },
    actions: { control: false },
    children: { control: false },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
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

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...ProjectRoadmap.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>On-Track Plan</h4>
        <PlanningWorkspace
          {...ProjectRoadmap.args}
          title="Q3 Strategic Plan"
          state={{ label: "On Track", tone: "success" }}
        />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Critical Path Alert State</h4>
        <PlanningWorkspace
          {...ProjectRoadmap.args}
          title="Capacity Over-Allocation Plan"
          state={{ label: "Capacity Exceeded", tone: "danger" }}
          legend={
            <div style={{ color: "var(--color-status-danger)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              ⚠️ Team allocation exceeded by 40 hours in Week 38.
            </div>
          }
        />
      </div>
    </div>
  ),
};

