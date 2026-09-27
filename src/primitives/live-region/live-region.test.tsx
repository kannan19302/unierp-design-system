import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LiveRegion, liveRegionVariants } from "./live-region";

describe("LiveRegion Component", () => {
  it("renders with status role and polite politeness by default with data-slot attributes", () => {
    render(<LiveRegion>Operation completed</LiveRegion>);

    const region = screen.getByRole("status");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toHaveAttribute("data-slot", "live-region");
    expect(region).toHaveAttribute("data-politeness", "polite");
    expect(region).toHaveTextContent("Operation completed");
  });

  it("renders with alert role when politeness is assertive", () => {
    render(<LiveRegion politeness="assertive">Critical warning alert</LiveRegion>);

    const region = screen.getByRole("alert");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "assertive");
    expect(region).toHaveAttribute("data-politeness", "assertive");
    expect(region).toHaveTextContent("Critical warning alert");
  });

  it("renders beacon in visible banner mode", () => {
    render(
      <LiveRegion variant="banner" politeness="polite">
        Syncing transactions...
      </LiveRegion>
    );

    expect(document.querySelector("[data-slot='live-region-beacon']")).toBeInTheDocument();
  });

  it("generates correct classes via liveRegionVariants cva helper", () => {
    const classes = liveRegionVariants({ variant: "banner", politeness: "assertive" });
    expect(classes).toContain("banner");
    expect(classes).toContain("assertive");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LiveRegion>Accessible screen reader notification message</LiveRegion>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
