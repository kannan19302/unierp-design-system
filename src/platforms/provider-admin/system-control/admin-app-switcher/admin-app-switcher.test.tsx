import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AdminAppSwitcher } from "./admin-app-switcher";

describe("AdminAppSwitcher Platform Component", () => {
  it("renders waffle trigger button with accessible label", () => {
    render(<AdminAppSwitcher />);
    const trigger = screen.getByRole("button", { name: /Admin OS App Switcher/i });
    expect(trigger).toBeInTheDocument();
  });

  it("opens modal flyout and displays application list", () => {
    render(<AdminAppSwitcher />);
    const trigger = screen.getByRole("button", { name: /Admin OS App Switcher/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tenant Orchestrator")).toBeInTheDocument();
  });

  it("filters applications when search query is entered", () => {
    render(<AdminAppSwitcher />);
    const trigger = screen.getByRole("button", { name: /Admin OS App Switcher/i });
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText(/Search workspaces/i);
    fireEvent.change(searchInput, { target: { value: "Identity" } });

    expect(screen.getByText("Identity & Access")).toBeInTheDocument();
    expect(screen.queryByText("Tenant Orchestrator")).not.toBeInTheDocument();
  });

  it("invokes onLaunchApp when an app card is clicked", () => {
    const onLaunch = vi.fn();
    render(<AdminAppSwitcher onLaunchApp={onLaunch} />);
    const trigger = screen.getByRole("button", { name: /Admin OS App Switcher/i });
    fireEvent.click(trigger);

    const appBtn = screen.getByText("Tenant Orchestrator");
    fireEvent.click(appBtn);
    expect(onLaunch).toHaveBeenCalledTimes(1);
    expect(onLaunch).toHaveBeenCalledWith(expect.objectContaining({ id: "pao-tenants" }));
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AdminAppSwitcher />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
