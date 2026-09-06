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
    expect(screen.getByText("Q3_Close_Ledger_Reconciliation.sql")).toBeInTheDocument();
    expect(screen.getByText("PO-88219 (Titanium Blades)")).toBeInTheDocument();
    expect(screen.getByTitle("Unsaved changes")).toBeInTheDocument();
  });

  it("handles selecting and closing tabs", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<DocumentTabBar onSelectTab={onSelect} onCloseTab={onClose} />);

    const poTab = screen.getByText("PO-88219 (Titanium Blades)");
    fireEvent.click(poTab);
    expect(onSelect).toHaveBeenCalledWith("tab_po_approval");

    const closeButtons = screen.getAllByRole("button", { name: /Close tab:/i });
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
