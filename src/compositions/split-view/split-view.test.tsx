import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SplitView, ResizablePanel, splitViewVariants } from "./split-view";

describe("SplitView Component", () => {
  it("renders left and right pane content", () => {
    render(<SplitView left={<div>Left View</div>} right={<div>Right View</div>} />);
    expect(screen.getByText("Left View")).toBeInTheDocument();
    expect(screen.getByText("Right View")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <SplitView left={<div>Left</div>} right={<div>Right</div>} />
    );
    expect(container.querySelector('[data-slot="split-view"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="split-view-pane"]').length).toBe(2);
    expect(container.querySelector('[data-slot="split-view-splitter"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <SplitView density={density} left={<div>L</div>} right={<div>R</div>} />
      );
      const root = container.querySelector('[data-slot="split-view"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = splitViewVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SplitView ref={ref} left={<div>Left</div>} right={<div>Right</div>} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "split-view");
  });

  it("renders ResizablePanel with data-slot", () => {
    const { container } = render(<ResizablePanel>Content</ResizablePanel>);
    expect(container.querySelector('[data-slot="resizable-panel"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitView left={<div>Left</div>} right={<div>Right</div>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
