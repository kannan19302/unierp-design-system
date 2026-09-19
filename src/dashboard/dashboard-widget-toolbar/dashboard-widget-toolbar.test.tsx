import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DashboardWidgetToolbar } from "./dashboard-widget-toolbar";

describe("DashboardWidgetToolbar", () => {
  it("renders without crashing", () => {
    render(
      <DashboardWidgetToolbar
        title="Revenue by Region"
        lastUpdated="2 min ago"
        onRefresh={() => {}}
        onExpand={() => {}}
        onExport={() => {}}
        onEdit={() => {}}
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DashboardWidgetToolbar ref={ref} title="Revenue" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DashboardWidgetToolbar
        title="Revenue by Region"
        lastUpdated="2 min ago"
        onRefresh={() => {}}
        onExpand={() => {}}
        onExport={() => {}}
        onEdit={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
