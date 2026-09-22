import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BrandMark } from "./brand-mark";

describe("BrandMark Primitive", () => {
  it("renders with aria-label UniERP", () => {
    render(<BrandMark />);
    expect(screen.getByLabelText("UniERP")).toBeInTheDocument();
  });

  it("hides text in compact mode", () => {
    render(<BrandMark compact />);
    expect(screen.queryByText("Uni")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BrandMark size="lg" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
