import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EnterpriseCommandRibbon } from "./enterprise-command-ribbon";

describe("EnterpriseCommandRibbon", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<EnterpriseCommandRibbon />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders command tabs and primary action button", () => {
    render(<EnterpriseCommandRibbon />);
    expect(screen.getByRole("tab", { name: "Home / Actions" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Navigate & Related" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Post & Release/i })).toBeInTheDocument();
    expect(screen.getByText("Preview GL")).toBeInTheDocument();
  });

  it("switches ribbon tabs and triggers action execution", () => {
    const onAction = vi.fn();
    render(<EnterpriseCommandRibbon onExecuteAction={onAction} />);

    const navTab = screen.getByRole("tab", { name: "Navigate & Related" });
    fireEvent.click(navTab);

    expect(screen.getByRole("button", { name: "Customer 360" })).toBeInTheDocument();

    const custButton = screen.getByRole("button", { name: "Customer 360" });
    fireEvent.click(custButton);

    expect(onAction).toHaveBeenCalledWith("act_cust_card");
  });
});
