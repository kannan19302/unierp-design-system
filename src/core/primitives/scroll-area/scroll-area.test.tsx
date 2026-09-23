import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("applies orientation and hideScrollbar styles", () => {
    const { container } = render(
      <ScrollArea orientation="horizontal" hideScrollbar>
        <div>Item</div>
      </ScrollArea>
    );

    const root = container.querySelector("div");
    expect(root?.className).toContain("horizontal");
    expect(root?.className).toContain("hideScrollbar");
  });
});
