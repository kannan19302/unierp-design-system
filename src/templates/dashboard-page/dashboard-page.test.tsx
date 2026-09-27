import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DashboardGridLayout, DashboardPageTemplate } from "./dashboard-page";

describe("DashboardGridLayout", () => {
  it("renders with enterprise data slots and density attributes", () => {
    const { container } = render(
      <DashboardGridLayout columns={3}>
        <div>Card 1</div>
      </DashboardGridLayout>
    );
    const root = container.querySelector('[data-slot="dashboard-page"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-density", "standard");
    expect(container.querySelector('[data-slot="dashboard-page-grid"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DashboardGridLayout ref={ref} columns={3} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <DashboardGridLayout density="ultra-compact">
        <div>Item</div>
      </DashboardGridLayout>
    );
    let root = container.querySelector('[data-slot="dashboard-page"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("densityUltraCompact");

    rerender(
      <DashboardGridLayout density="comfortable">
        <div>Item</div>
      </DashboardGridLayout>
    );
    root = container.querySelector('[data-slot="dashboard-page"]');
    expect(root).toHaveAttribute("data-density", "comfortable");
    expect(root?.className).toContain("densityComfortable");
  });

  it("exports DashboardPageTemplate alias successfully", () => {
    expect(DashboardPageTemplate).toBe(DashboardGridLayout);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DashboardGridLayout columns={3}>
        <div>Card 1</div>
        <div>Card 2</div>
      </DashboardGridLayout>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
