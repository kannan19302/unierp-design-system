import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FeaturesGridBlock } from "./features-grid";

describe("FeaturesGridBlock Primitive", () => {
  it("renders feature items and headers", () => {
    render(<FeaturesGridBlock title="Platform Capabilities" />);
    expect(screen.getByText("Platform Capabilities")).toBeInTheDocument();
    expect(screen.getByText("Lightning Fast")).toBeInTheDocument();
    expect(screen.getByText("Bank-grade Security")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FeaturesGridBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
