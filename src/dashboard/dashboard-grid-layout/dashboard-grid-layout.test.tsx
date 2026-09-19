import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DashboardGridLayout } from "./dashboard-grid-layout";

describe("DashboardGridLayout", () => {
  it("renders without crashing", () => {
    render(<DashboardGridLayout columns={3} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DashboardGridLayout ref={ref} columns={3} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
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
