import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DashboardWidgetToolbar } from "./dashboard-widget-toolbar";

const defaultProps = {} as any;

describe("DashboardWidgetToolbar", () => {
  it("renders without crashing", () => {
    render(<DashboardWidgetToolbar {...defaultProps} title="Revenue by Region" lastUpdated="2 min ago" onRefresh={() => {}} onExpand={() => {}} onExport={() => {}} onEdit={() => {}} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DashboardWidgetToolbar {...defaultProps} title="Revenue by Region" lastUpdated="2 min ago" onRefresh={() => {}} onExpand={() => {}} onExport={() => {}} onEdit={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
