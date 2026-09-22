import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SocialProofBlock } from "./social-proof";

describe("SocialProofBlock Primitive", () => {
  it("renders testimonials and authors", () => {
    render(<SocialProofBlock title="Customer Success Stories" />);
    expect(screen.getByText("Customer Success Stories")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText(/CEO, TechCorp/)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SocialProofBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
