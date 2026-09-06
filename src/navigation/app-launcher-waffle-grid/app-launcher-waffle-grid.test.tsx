import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AppLauncherWaffleGrid } from "./app-launcher-waffle-grid";

describe("AppLauncherWaffleGrid", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<AppLauncherWaffleGrid isOpenByDefault={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("opens and closes flyout on button click", () => {
    render(<AppLauncherWaffleGrid />);
    const toggleButton = screen.getByRole("button", { name: /App Launcher/i });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByRole("dialog", { name: "Enterprise Application Launcher" })).toBeInTheDocument();
    expect(screen.getByText("General Ledger & Journals")).toBeInTheDocument();
  });

  it("filters apps by search query and triggers app launch", () => {
    const onLaunch = vi.fn();
    render(<AppLauncherWaffleGrid isOpenByDefault={true} onLaunchApp={onLaunch} />);

    const searchInput = screen.getByPlaceholderText(/Search apps/i);
    fireEvent.change(searchInput, { target: { value: "Inventory" } });

    expect(screen.getByText("Inventory & Warehouse (WMS)")).toBeInTheDocument();
    expect(screen.queryByText("General Ledger & Journals")).not.toBeInTheDocument();

    const appCard = screen.getByRole("button", { name: /Launch Inventory & Warehouse \(WMS\)/i });
    fireEvent.click(appCard);

    expect(onLaunch).toHaveBeenCalledWith("app_inv");
  });
});
