import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FaqBlock } from "./faq";

describe("FaqBlock Primitive", () => {
  it("renders questions and answers", () => {
    render(<FaqBlock title="General Inquiries" />);
    expect(screen.getByText("General Inquiries")).toBeInTheDocument();
    expect(screen.getByText("Do you offer a free trial?")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FaqBlock />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
