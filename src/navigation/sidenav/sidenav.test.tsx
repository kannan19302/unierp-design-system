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

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SideNav
        items={[{ key: "1", label: "Home", active: true }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
