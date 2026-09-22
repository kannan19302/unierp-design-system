import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MobileActionSheet } from "./mobile-action-sheet";

describe("MobileActionSheet Component", () => {
  it("renders modal dialog with action items", () => {
    render(<MobileActionSheet title="Batch Actions" />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Batch Actions")).toBeInTheDocument();
  });

  it("calls option onSelect callback", () => {
    const onSelect = vi.fn();
    render(
      <MobileActionSheet
        options={[{ id: "op1", label: "Approve Order", onSelect }]}
      />
    );
    const btn = screen.getByRole("menuitem", { name: "Approve Order" });
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MobileActionSheet />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
