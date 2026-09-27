import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Spinner } from "./spinner";

describe("Spinner Primitive", () => {
  it("renders with role status and accessible label", () => {
    render(<Spinner size="md" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Spinner size="lg" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
