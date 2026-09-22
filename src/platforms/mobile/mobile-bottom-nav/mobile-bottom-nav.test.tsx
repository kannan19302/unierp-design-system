import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MobileBottomNav } from "./mobile-bottom-nav";

describe("MobileBottomNav Component", () => {
  it("renders mobile navigation bar with items", () => {
    render(<MobileBottomNav />);
    expect(screen.getByRole("navigation", { name: /mobile bottom navigation/i })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("calls onSelect when nav item is tapped", () => {
    const onSelect = vi.fn();
    render(<MobileBottomNav onSelect={onSelect} />);
    const ordersBtn = screen.getByRole("button", { name: /orders/i });
    fireEvent.click(ordersBtn);
    expect(onSelect).toHaveBeenCalledWith("orders");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MobileBottomNav />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
