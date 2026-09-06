import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BladeNavigationStack } from "./blade-navigation-stack";

describe("BladeNavigationStack", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<BladeNavigationStack />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders blade stack with cascading drill-down columns", () => {
    render(<BladeNavigationStack />);
    expect(screen.getByText("Azure-Grade Blade Navigator")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cloud Subscriptions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resource Groups" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Virtual Networks & Subnets" })).toBeInTheDocument();
  });

  it("handles clicking an item and closing a child blade", () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(<BladeNavigationStack onOpenItem={onOpen} onCloseBlade={onClose} />);

    const itemBtn = screen.getByRole("button", { name: /rg-prod-us-east-virginia/i });
    fireEvent.click(itemBtn);
    expect(onOpen).toHaveBeenCalledWith(1, expect.objectContaining({ id: "rg_us_east" }));

    const closeButtons = screen.getAllByRole("button", { name: /Close blade:/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(onClose).toHaveBeenCalled();
  });
});
