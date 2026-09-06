import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { InspectorShell } from "./inspector-shell";

describe("InspectorShell Primitive", () => {
  it("renders navigation rail, working list, and inspector panel", () => {
    render(
      <InspectorShell
        navigation={<div>Nav Items</div>}
        topBar={<div>Filter Bar</div>}
        list={<div>Invoices Table</div>}
        inspector={<div>Invoice Details Panel</div>}
      />
    );

    expect(screen.getByText("Nav Items")).toBeInTheDocument();
    expect(screen.getByText("Filter Bar")).toBeInTheDocument();
    expect(screen.getByText("Invoices Table")).toBeInTheDocument();
    expect(screen.getByText("Invoice Details Panel")).toBeInTheDocument();
  });

  it("supports canonical floorplan and density attributes", () => {
    const { container } = render(
      <InspectorShell
        density="compact"
        list={<div>Invoices Table</div>}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-floorplan")).toBe("inspector-shell");
    expect(root.getAttribute("data-density")).toBe("compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <InspectorShell
        list={<div>Invoices Table</div>}
        inspector={<div>Invoice Details Panel</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
