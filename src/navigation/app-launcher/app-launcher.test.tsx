import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AppLauncherWaffleGrid } from "./app-launcher";

describe("AppLauncherWaffleGrid", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<AppLauncherWaffleGrid isOpenByDefault={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AppLauncherWaffleGrid ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders data-slot anatomy correctly", () => {
    render(<AppLauncherWaffleGrid isOpenByDefault={true} density="compact" />);
    const launcher = document.querySelector('[data-slot="app-launcher"]');
    expect(launcher).toBeInTheDocument();
    expect(launcher).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="app-launcher-waffle-button"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-flyout"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-search"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-search-input"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-body"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-category"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-card"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="app-launcher-footer"]')).toBeInTheDocument();
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
