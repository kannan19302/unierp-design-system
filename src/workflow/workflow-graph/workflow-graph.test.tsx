import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WorkflowGraph, type WorkflowNode, type WorkflowEdge } from "../workflow-graph";

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

  it("has zero accessibility violations", async () => {
    const { container } = render(<WorkflowGraph nodes={mockNodes} edges={mockEdges} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
