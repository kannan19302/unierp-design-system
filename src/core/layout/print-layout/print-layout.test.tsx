import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PrintLayout } from "./print-layout";

describe("PrintLayout Primitive", () => {
  it("renders print container", () => {
    render(<PrintLayout>Print Content</PrintLayout>);
    expect(screen.getByText("Print Content")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PrintLayout><h1>Print Title</h1></PrintLayout>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
