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
  title: "Workflow/WorkflowGraph",
  component: WorkflowGraph,
  parameters: {
    layout: "padded",
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
