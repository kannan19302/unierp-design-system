import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PinnedBookmarksBar } from "./pinned-bookmarks-bar";

const sampleBookmarks = [
  { id: "b1", label: "Open Invoices Q3", hotkeyNumber: 1, isActive: true },
  { id: "b2", label: "Pending Wire Approvals", hotkeyNumber: 2 },
];

describe("PinnedBookmarksBar", () => {
  it("renders bookmarks and handles selection", () => {
    const handleSelect = vi.fn();
    render(
      <PinnedBookmarksBar
        bookmarks={sampleBookmarks}
        onSelect={handleSelect}
      />
    );

    expect(screen.getByText("Open Invoices Q3")).toBeInTheDocument();
    expect(screen.getByText("Pending Wire Approvals")).toBeInTheDocument();

    const itemBtn = screen.getByRole("button", { name: "Pending Wire Approvals" });
    fireEvent.click(itemBtn);
    expect(handleSelect).toHaveBeenCalledWith(sampleBookmarks[1]);
  });

  it("handles remove bookmark and add pin current", () => {
    const handleRemove = vi.fn();
    const handleAddCurrent = vi.fn();

    render(
      <PinnedBookmarksBar
        bookmarks={sampleBookmarks}
        onRemove={handleRemove}
        onAddCurrent={handleAddCurrent}
      />
    );

    const removeBtn = screen.getByRole("button", { name: "Unpin Open Invoices Q3" });
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith("b1");

    const addBtn = screen.getByRole("button", { name: "Pin current page" });
    fireEvent.click(addBtn);
    expect(handleAddCurrent).toHaveBeenCalled();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <PinnedBookmarksBar
        bookmarks={sampleBookmarks}
        onAddCurrent={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
