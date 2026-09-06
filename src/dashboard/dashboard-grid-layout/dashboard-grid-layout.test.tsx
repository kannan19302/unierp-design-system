import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DashboardGridLayout } from "./dashboard-grid-layout";

const defaultProps = {} as any;

describe("DashboardGridLayout", () => {
  it("renders without crashing", () => {
    render(<DashboardGridLayout {...defaultProps} columns={3} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DashboardGridLayout {...defaultProps} columns={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
