import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TrustBarBlock } from "./trust-bar";

describe("TrustBarBlock Primitive", () => {
  it("renders logos and header banner", () => {
    render(<TrustBarBlock title="Used by Fortune 500 Leaders" />);
    expect(screen.getByText("Used by Fortune 500 Leaders")).toBeInTheDocument();
    expect(screen.getByText("Apex Dynamics")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TrustBarBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
