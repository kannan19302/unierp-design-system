import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DocumentTabBar } from "./document-tab-bar";

describe("DocumentTabBar", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<DocumentTabBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders document tabs and dirty indicator", () => {
    render(<DocumentTabBar />);
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Supplier portal")).toBeInTheDocument();
    expect(screen.getByTitle("Unsaved changes")).toBeInTheDocument();
  });

  it("handles selecting and closing tabs", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<DocumentTabBar onSelectTab={onSelect} onCloseTab={onClose} />);

    const supplierTab = screen.getByText("Supplier portal");
    fireEvent.click(supplierTab);
    expect(onSelect).toHaveBeenCalledWith("tab_supplier_portal");

    const closeButtons = screen.getAllByRole("button", { name: /Close tab:/i });
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
