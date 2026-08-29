import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Presence } from "./presence";

describe("Presence Primitive", () => {
  it("renders with aria-label", () => {
    render(<Presence status="online" showLabel />);
    expect(screen.getByLabelText("Online")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Presence status="busy" showLabel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
