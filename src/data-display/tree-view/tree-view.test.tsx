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
});
