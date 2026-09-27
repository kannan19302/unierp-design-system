import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PrintLayout, PrintPageTemplate } from "./print-page";

describe("PrintLayout Primitive", () => {
  it("renders print container with enterprise data slots", () => {
    const { container } = render(<PrintLayout>Print Content</PrintLayout>);
    expect(screen.getByText("Print Content")).toBeInTheDocument();
    const root = container.querySelector('[data-slot="print-page"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-density", "standard");
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <PrintLayout density="ultra-compact">Content</PrintLayout>
    );
    let root = container.querySelector('[data-slot="print-page"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("densityUltraCompact");

    rerender(<PrintLayout density="comfortable">Content</PrintLayout>);
    root = container.querySelector('[data-slot="print-page"]');
    expect(root).toHaveAttribute("data-density", "comfortable");
    expect(root?.className).toContain("densityComfortable");
  });

  it("exports PrintPageTemplate alias successfully", () => {
    expect(PrintPageTemplate).toBe(PrintLayout);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PrintLayout><h1>Print Title</h1></PrintLayout>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
