import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { OmniJumpNavigator } from "./omni-jump-navigator";

const sampleItems = [
  { id: "1", title: "Elena Rostova", subtitle: "Lead Finance Controller", prefix: "@" as const, category: "People" },
  { id: "5", title: "INV-2026-8891", subtitle: "Acme Industrial Corp", prefix: "!" as const, category: "Records" },
];

describe("OmniJumpNavigator", () => {
  it("renders jump results and filters by prefix", () => {
    render(
      <OmniJumpNavigator
        items={sampleItems}
        isOpen={true}
      />
    );

    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText("INV-2026-8891")).toBeInTheDocument();

    const peopleChip = screen.getByRole("tab", { name: /@ People/i });
    fireEvent.click(peopleChip);

    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.queryByText("INV-2026-8891")).not.toBeInTheDocument();
  });

  it("handles selection and escape dismissal", () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <OmniJumpNavigator
        items={sampleItems}
        isOpen={true}
        onSelect={handleSelect}
        onClose={handleClose}
      />
    );

    const itemBtn = screen.getByRole("button", { name: /Elena Rostova/i });
    fireEvent.click(itemBtn);
    expect(handleSelect).toHaveBeenCalledWith(sampleItems[0]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <OmniJumpNavigator
        items={sampleItems}
        isOpen={true}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
