import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { HealthScore } from "./health-score";

describe("HealthScore Primitive", () => {
  it("renders health percentage and status text", () => {
    render(<HealthScore score={88} />);
    expect(screen.getByText(/88%/)).toBeInTheDocument();
    expect(screen.getByText(/(Good)/)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<HealthScore score={42} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
