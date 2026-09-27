import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WorkflowGraph, type WorkflowNode, type WorkflowEdge } from "./workflow-graph";

const mockNodes: WorkflowNode[] = [
  { id: "1", title: "Stage 1", status: "completed", x: 10, y: 10 },
  { id: "2", title: "Stage 2", status: "running", x: 200, y: 10 },
];

const mockEdges: WorkflowEdge[] = [
  { id: "e1", from: "1", to: "2", label: "Approve" },
];

describe("WorkflowGraph Primitive", () => {
  it("renders workflow nodes and edge label", () => {
    render(<WorkflowGraph nodes={mockNodes} edges={mockEdges} />);

    expect(screen.getByText("Stage 1")).toBeInTheDocument();
    expect(screen.getByText("Stage 2")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
  });

  it("handles node click selection", () => {
    const onNodeSelect = vi.fn();
    render(<WorkflowGraph nodes={mockNodes} edges={mockEdges} onNodeSelect={onNodeSelect} />);

    const node1 = screen.getByLabelText("Workflow stage Stage 1, status completed");
    fireEvent.click(node1);

    expect(onNodeSelect).toHaveBeenCalledWith(mockNodes[0]);
  });

  it("supports forwarded ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<WorkflowGraph nodes={mockNodes} edges={mockEdges} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<WorkflowGraph nodes={mockNodes} edges={mockEdges} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <WorkflowGraph nodes={mockNodes} edges={mockEdges} density="ultra-compact" />
    );
    const root = container.querySelector('[data-slot="workflow-graph"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");

    rerender(<WorkflowGraph nodes={mockNodes} edges={mockEdges} density="compact" />);
    expect(root).toHaveAttribute("data-density", "compact");

    rerender(<WorkflowGraph nodes={mockNodes} edges={mockEdges} density="standard" />);
    expect(root).toHaveAttribute("data-density", "standard");

    rerender(<WorkflowGraph nodes={mockNodes} edges={mockEdges} density="comfortable" />);
    expect(root).toHaveAttribute("data-density", "comfortable");
  });

  it("renders data-slot annotations on workflow graph elements", () => {
    const nodesWithAssignee: WorkflowNode[] = [
      { id: "1", title: "Stage 1", subtitle: "Initial", status: "completed", assignee: "Sarah", duration: "5m", x: 10, y: 10 },
    ];
    const { container } = render(<WorkflowGraph nodes={nodesWithAssignee} edges={[]} />);

    expect(container.querySelector('[data-slot="workflow-graph"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-canvas"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-svg-layer"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node-subtitle"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="workflow-graph-node-assignee"]')).toBeInTheDocument();
  });
});
