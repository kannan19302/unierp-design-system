import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea Primitive", () => {
  it("renders viewport with accessible role", () => {
    render(
      <ScrollArea maxHeight={200}>
        <div>Scrollable content item</div>
      </ScrollArea>
    );

    const region = screen.getByRole("region", { name: "Scrollable content" });
    expect(region).toBeInTheDocument();
    expect(screen.getByText("Scrollable content item")).toBeInTheDocument();
  });

  it("exposes data-slot and cva variants", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal" hideScrollbar>
        <div>Item</div>
      </ScrollArea>
    );

    const root = container.querySelector('[data-slot="scroll-area"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-orientation", "horizontal");
    expect(container.querySelector('[data-slot="scroll-area-viewport"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ScrollArea maxHeight={200} aria-label="Transaction history">
        <ul>
          <li>Transaction TX-001</li>
          <li>Transaction TX-002</li>
        </ul>
      </ScrollArea>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
