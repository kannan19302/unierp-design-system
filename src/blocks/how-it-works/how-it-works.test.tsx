import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { HowItWorksBlock } from "./how-it-works";

describe("HowItWorksBlock Primitive", () => {
  it("renders numbered steps and instructions", () => {
    render(<HowItWorksBlock title="Getting Started" />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Connect your data")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<HowItWorksBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
