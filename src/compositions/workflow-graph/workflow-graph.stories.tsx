import type { Meta, StoryObj } from "@storybook/react";
import { WorkflowGraph, type WorkflowNode, type WorkflowEdge } from "./workflow-graph";

const sampleNodes: WorkflowNode[] = [
  {
    id: "step-1",
    title: "Draft Created",
    subtitle: "By requester",
    status: "completed",
    assignee: "Sarah Jenkins",
    duration: "2m",
    x: 40,
    y: 120,
  },
  {
    id: "step-2",
    title: "Manager Approval",
    subtitle: "Department sign-off",
    status: "completed",
    assignee: "Alex Rivera",
    duration: "4h 12m",
    x: 320,
    y: 60,
  },
  {
    id: "step-3",
    title: "Compliance Audit",
    subtitle: "Policy adherence check",
    status: "running",
    assignee: "Audit Bot #4",
    duration: "In progress",
    x: 320,
    y: 200,
  },
  {
    id: "step-4",
    title: "Financial Posting",
    subtitle: "General ledger entry",
    status: "pending",
    assignee: "ERP Outbox Worker",
    x: 600,
    y: 120,
  },
];

const sampleEdges: WorkflowEdge[] = [
  { id: "e1", from: "step-1", to: "step-2", label: "Amount > $5k" },
  { id: "e2", from: "step-1", to: "step-3", label: "High Risk" },
  { id: "e3", from: "step-2", to: "step-4", label: "Approved" },
  { id: "e4", from: "step-3", to: "step-4", label: "Passed", animated: true },
];

const meta: Meta<typeof WorkflowGraph> = {
  title: "Compositions/WorkflowGraph",
  component: WorkflowGraph,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata DL 4-tier density scaling",
    },
    nodes: {
      control: "object",
      description: "Array of workflow graph nodes",
    },
    edges: {
      control: "object",
      description: "Array of directed bezier edges connecting nodes",
    },
    height: {
      control: "number",
      description: "Canvas minimum block size in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowGraph>;

export const ApprovalChainDAG: Story = {
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
    height: 400,
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <WorkflowGraph {...args} nodes={sampleNodes} edges={sampleEdges} height={400} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Multi-Tier Approval DAG</h3>
        <WorkflowGraph nodes={sampleNodes} edges={sampleEdges} height={380} />
      </div>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Linear 2-Stage Pipeline</h3>
        <WorkflowGraph
          nodes={[
            { id: "s1", title: "Input Validation", status: "completed", x: 40, y: 100 },
            { id: "s2", title: "Batch Processing", status: "running", x: 340, y: 100 },
          ]}
          edges={[{ id: "e1", from: "s1", to: "s2", label: "Triggered" }]}
          height={260}
        />
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => {
    const linearNodes: WorkflowNode[] = [
      { id: "n1", title: "Validation", status: "completed", x: 20, y: 40 },
      { id: "n2", title: "Execution", status: "running", x: 280, y: 40 },
    ];
    const linearEdges: WorkflowEdge[] = [
      { id: "e1", from: "n1", to: "n2", label: "Valid" },
    ];
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;

    return (
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {densities.map((d) => (
          <div key={d} style={{ display: "grid", gap: "var(--space-2)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Density: {d}
            </div>
            <WorkflowGraph
              density={d}
              nodes={linearNodes}
              edges={linearEdges}
              height={180}
            />
          </div>
        ))}
      </div>
    );
  },
};
