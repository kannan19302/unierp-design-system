import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SystemStatusBar, StatusBar } from "./status-bar";

describe("SystemStatusBar", () => {
  it("renders without crashing", () => {
    render(<SystemStatusBar status="operational" lastChecked="30s ago" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies data-slot annotations throughout component anatomy", () => {
    const { container } = render(
      <SystemStatusBar
        status="degraded"
        message="High response time in us-east-1"
        lastChecked="Just now"
        incidentUrl="https://status.unierp.com/incidents/inc-4892"
      />
    );

    expect(container.querySelector('[data-slot="status-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-bar-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-bar-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-bar-message"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-bar-timestamp"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="status-bar-incident"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { rerender, container } = render(
      <SystemStatusBar status="operational" density="ultra-compact" />
    );
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("densityUltraCompact");

    rerender(<SystemStatusBar status="operational" density="compact" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("densityCompact");

    rerender(<SystemStatusBar status="operational" density="standard" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("densityStandard");

    rerender(<SystemStatusBar status="operational" density="comfortable" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("densityComfortable");
  });

  it("renders all status variants with correct classes", () => {
    const { rerender, container } = render(<SystemStatusBar status="operational" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("statusOperational");

    rerender(<SystemStatusBar status="degraded" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("statusDegraded");

    rerender(<SystemStatusBar status="outage" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("statusOutage");

    rerender(<SystemStatusBar status="maintenance" />);
    expect(container.querySelector('[data-slot="status-bar"]')?.className).toContain("statusMaintenance");
  });

  it("exports StatusBar alias identically", () => {
    render(<StatusBar status="operational" message="Alias test" />);
    expect(screen.getByText("— Alias test")).toBeInTheDocument();
  });

  it("has zero accessibility violations across operational and incident states", async () => {
    const { container, rerender } = render(
      <SystemStatusBar status="operational" lastChecked="30s ago" />
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <SystemStatusBar
        status="outage"
        message="Service disruption detected"
        lastChecked="Just now"
        incidentUrl="https://status.example.com"
      />
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
