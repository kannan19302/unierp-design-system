import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SideNav } from "./sidenav";

describe("SideNav Primitive", () => {
  it("renders navigation items and handles clicks", () => {
    const onClick = vi.fn();
    render(
      <SideNav
        items={[
          { key: "1", label: "Dashboard", active: true },
          { key: "2", label: "Ledger", onClick },
        ]}
      />
    );
    expect(screen.getByRole("complementary", { name: "Side Navigation" })).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Ledger"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("filters items in real time when searchable is enabled", () => {
    render(
      <SideNav
        searchable
        items={[
          { key: "1", label: "Dashboard", active: true },
          { key: "2", label: "General Ledger" },
          { key: "3", label: "Accounts Receivable" },
        ]}
      />
    );

    const searchInput = screen.getByRole("searchbox", { name: "Search navigation" });
    expect(searchInput).toBeInTheDocument();

    // Type query
    fireEvent.change(searchInput, { target: { value: "Ledger" } });
    expect(screen.getByText("General Ledger")).toBeInTheDocument();
    expect(screen.queryByText("Accounts Receivable")).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clearBtn);
    expect(screen.getByText("Accounts Receivable")).toBeInTheDocument();
  });

  it("renders global search results across applications", () => {
    const onSelect = vi.fn();
    render(
      <SideNav
        searchable
        searchQuery="tax"
        items={[{ key: "1", label: "Dashboard" }]}
        globalResults={[
          { key: "g1", label: "Tax Configuration", group: "Finance" },
          { key: "g2", label: "Employee Tax Forms", group: "HR" },
        ]}
        onSelectResult={onSelect}
      />
    );

    expect(screen.getByText("Tax Configuration")).toBeInTheDocument();
    expect(screen.getByText("Employee Tax Forms")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Tax Configuration"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: "g1", label: "Tax Configuration" })
    );
  });

  it("renders collapsible sections and toggles visibility", () => {
    render(
      <SideNav
        sections={[
          {
            id: "sec-core",
            title: "Executive & Core",
            collapsible: true,
            defaultOpen: true,
            items: [{ key: "dash", label: "Executive Dashboard" }],
          },
          {
            id: "sec-ops",
            title: "Operations",
            collapsible: true,
            defaultOpen: false,
            items: [{ key: "ap", label: "Accounts Payable" }],
          },
        ]}
      />
    );

    expect(screen.getByText("Executive & Core")).toBeInTheDocument();
    expect(screen.getByText("Executive Dashboard")).toBeInTheDocument();

    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.queryByText("Accounts Payable")).not.toBeInTheDocument();

    // Expand operations section
    fireEvent.click(screen.getByRole("button", { name: /Toggle Operations section/i }));
    expect(screen.getByText("Accounts Payable")).toBeInTheDocument();
  });

  it("handles favorites and triggers onToggleFavorite", () => {
    const onToggleFav = vi.fn();
    render(
      <SideNav
        allowFavorites
        favorites={["gl"]}
        onToggleFavorite={onToggleFav}
        items={[
          { key: "gl", label: "General Ledger" },
          { key: "tax", label: "Tax & Compliance" },
        ]}
      />
    );

    // Starred section rendered
    expect(screen.getByText("Starred")).toBeInTheDocument();
    const starButtons = screen.getAllByRole("button", { name: /favorites/i });
    expect(starButtons.length).toBeGreaterThan(0);

    // Toggle favorite on Tax
    const taxStar = screen.getByRole("button", { name: /Add Tax & Compliance to favorites/i });
    fireEvent.click(taxStar);
    expect(onToggleFav).toHaveBeenCalledWith("tax");
  });

  it("triggers quick actions when provided", () => {
    const onQuickCreate = vi.fn();
    render(
      <SideNav
        items={[
          {
            key: "gl",
            label: "General Ledger",
            quickAction: {
              label: "New Journal",
              icon: <span>+</span>,
              onClick: onQuickCreate,
            },
          },
        ]}
      />
    );

    const quickActionBtn = screen.getByRole("button", { name: "New Journal" });
    expect(quickActionBtn).toBeInTheDocument();
    fireEvent.click(quickActionBtn);
    expect(onQuickCreate).toHaveBeenCalledTimes(1);
  });

  it("supports mini-rail collapsed mode and toggle shortcut", () => {
    const onToggle = vi.fn();
    render(
      <SideNav
        collapsed={true}
        onToggleCollapse={onToggle}
        items={[{ key: "1", label: "Dashboard", icon: <span>D</span> }]}
      />
    );

    const expandBtn = screen.getByRole("button", { name: /Expand sidebar/i });
    expect(expandBtn).toBeInTheDocument();
    fireEvent.click(expandBtn);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SideNav
        searchable
        allowFavorites
        favorites={["home"]}
        sections={[
          {
            id: "s1",
            title: "General",
            items: [{ key: "home", label: "Home", active: true }],
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

