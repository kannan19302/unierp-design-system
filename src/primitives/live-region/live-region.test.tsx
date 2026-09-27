import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LiveRegion } from "./live-region";

describe("LiveRegion Component", () => {
  it("renders with status role and polite politeness by default", () => {
    render(<LiveRegion>Operation completed</LiveRegion>);

    const region = screen.getByRole("status");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toHaveTextContent("Operation completed");
  });

  it("renders with alert role when politeness is assertive", () => {
    render(<LiveRegion politeness="assertive">Critical warning alert</LiveRegion>);

    const region = screen.getByRole("alert");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-live", "assertive");
    expect(region).toHaveTextContent("Critical warning alert");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LiveRegion>Accessible screen reader notification message</LiveRegion>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
