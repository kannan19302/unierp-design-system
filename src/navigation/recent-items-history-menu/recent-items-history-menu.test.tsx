import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RecentItemsHistoryMenu } from "./recent-items-history-menu";

const sampleItems = [
  {
    id: "inv-001",
    title: "INV-2026-0089",
    subtitle: "Acme Industrial Corp",
    module: "Finance",
    pinned: true,
  },
  {
    id: "so-102",
    title: "SO-9921",
    subtitle: "Global Freight Systems",
    module: "Sales",
    pinned: false,
  },
];

describe("RecentItemsHistoryMenu", () => {
  it("renders history items and filters by query", () => {
    const handleItemClick = vi.fn();
    render(
      <RecentItemsHistoryMenu
        items={sampleItems}
        title="Recent Items"
        onItemClick={handleItemClick}
      />
    );

    expect(screen.getByText("INV-2026-0089")).toBeInTheDocument();
    expect(screen.getByText("SO-9921")).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Finance" } });

    expect(screen.getByText("INV-2026-0089")).toBeInTheDocument();
    expect(screen.queryByText("SO-9921")).not.toBeInTheDocument();
  });

  it("handles item click and pin toggling", () => {
    const handleItemClick = vi.fn();
    const handleTogglePin = vi.fn();

    render(
      <RecentItemsHistoryMenu
        items={sampleItems}
        onItemClick={handleItemClick}
        onTogglePin={handleTogglePin}
      />
    );

    const itemBtn = screen.getByRole("button", { name: /INV-2026-0089, Acme Industrial Corp/i });
    fireEvent.click(itemBtn);
    expect(handleItemClick).toHaveBeenCalledWith(sampleItems[0]);

    const pinBtn = screen.getByRole("button", { name: /Unpin INV-2026-0089/i });
    fireEvent.click(pinBtn);
    expect(handleTogglePin).toHaveBeenCalledWith("inv-001", false);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <RecentItemsHistoryMenu
        items={sampleItems}
        title="Recent Items"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
