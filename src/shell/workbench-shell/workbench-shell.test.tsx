import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WorkbenchShell } from "./workbench-shell";

describe("WorkbenchShell Primitive", () => {
  it("renders classification, record list, and detail workspace panes", () => {
    render(
      <WorkbenchShell
        classificationTree={<div>Classification Hierarchy</div>}
        recordList={<div>SKU Items</div>}
        detailWorkspace={<div>Item Details</div>}
      />
    );

    expect(screen.getByText("Classification Hierarchy")).toBeInTheDocument();
    expect(screen.getByText("SKU Items")).toBeInTheDocument();
    expect(screen.getByText("Item Details")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WorkbenchShell
        classificationTree={<div>Classification Hierarchy</div>}
        recordList={<div>SKU Items</div>}
        detailWorkspace={<div>Item Details</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
