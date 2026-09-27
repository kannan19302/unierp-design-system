import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TreeView } from "./tree-view";

describe("TreeView Primitive", () => {
  it("renders tree nodes and expands children on toggle", () => {
    const onSelect = vi.fn();
    render(
      <TreeView
        nodes={[
          {
            id: "1",
            label: "Assets",
            children: [{ id: "1-1", label: "Cash" }],
          },
        ]}
        onNodeSelect={onSelect}
      />
    );
    expect(screen.getByRole("tree")).toBeInTheDocument();
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.queryByText("Cash")).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Expand"));
    expect(screen.getByText("Cash")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cash"));
    expect(onSelect).toHaveBeenCalledWith({ id: "1-1", label: "Cash" });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <TreeView
        nodes={[{ id: "1", label: "Root" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("forwards ref to container div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TreeView ref={ref} nodes={[{ id: "1", label: "Root" }]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("supports 4-tier density scaling", () => {
    const nodes = [{ id: "1", label: "Root" }];
    const { container, rerender } = render(<TreeView nodes={nodes} density="ultra-compact" />);
    const root = container.querySelector('[data-slot="tree-view"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");

    rerender(<TreeView nodes={nodes} density="compact" />);
    expect(root).toHaveAttribute("data-density", "compact");

    rerender(<TreeView nodes={nodes} density="standard" />);
    expect(root).toHaveAttribute("data-density", "standard");

    rerender(<TreeView nodes={nodes} density="comfortable" />);
    expect(root).toHaveAttribute("data-density", "comfortable");
  });

  it("renders data-slot annotations on tree-view elements", () => {
    const { container } = render(
      <TreeView
        nodes={[
          {
            id: "1",
            label: "Parent",
            badge: "3",
            children: [{ id: "1-1", label: "Child" }],
          },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="tree-view"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-toggle"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-badge"]')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Expand"));
    expect(container.querySelector('[data-slot="tree-view-group"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tree-view-indent"]')).toBeInTheDocument();
  });
});

