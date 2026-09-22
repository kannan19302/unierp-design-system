import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FactBox, FactBoxTile, FactBoxField, FactBoxMetric } from "./fact-box";

describe("FactBox Component", () => {
  it("renders FactBox title, tiles, fields, and metrics", () => {
    render(
      <FactBox title="Customer Telemetry">
        <FactBoxTile id="overview" title="Financial KPIs">
          <FactBoxMetric label="Credit Balance" value="$50,000.00" trend="up" trendValue="5%" />
          <FactBoxField label="Payment Terms" value="Net 30" />
        </FactBoxTile>
      </FactBox>
    );

    expect(screen.getByText("Customer Telemetry")).toBeInTheDocument();
    expect(screen.getByText("Financial KPIs")).toBeInTheDocument();
    expect(screen.getByText("Credit Balance")).toBeInTheDocument();
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
    expect(screen.getByText("Payment Terms")).toBeInTheDocument();
    expect(screen.getByText("Net 30")).toBeInTheDocument();
  });

  it("toggles tile expansion on header button click", () => {
    render(
      <FactBox title="Customer Telemetry">
        <FactBoxTile id="collapsible-tile" title="Collapsible Section">
          <FactBoxField label="Sensitive Field" value="Protected Value" />
        </FactBoxTile>
      </FactBox>
    );

    expect(screen.getByText("Sensitive Field")).toBeInTheDocument();
    const toggleBtn = screen.getByRole("button", { name: /Collapsible Section/i });
    fireEvent.click(toggleBtn);
    expect(screen.queryByText("Sensitive Field")).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText("Sensitive Field")).toBeInTheDocument();
  });

  it("toggles FactBox sidebar collapse", () => {
    const onCollapsedChange = vi.fn();
    render(
      <FactBox title="Sidebar Rail" collapsible onCollapsedChange={onCollapsedChange}>
        <FactBoxTile title="Content">
          <FactBoxField label="Label" value="Value" />
        </FactBoxTile>
      </FactBox>
    );

    const collapseBtn = screen.getByRole("button", { name: /Collapse FactBox/i });
    fireEvent.click(collapseBtn);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);

    const expandBtn = screen.getByRole("button", { name: /Expand FactBox/i });
    fireEvent.click(expandBtn);
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FactBox title="Accessibility Audit FactBox">
        <FactBoxTile id="a11y-tile" title="A11y Verified Section">
          <FactBoxMetric label="Operational Uptime" value="99.99%" />
          <FactBoxField label="Jurisdiction" value="EU West" />
        </FactBoxTile>
      </FactBox>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
