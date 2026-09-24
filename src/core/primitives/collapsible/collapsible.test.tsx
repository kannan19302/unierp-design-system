import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";

describe("Collapsible Primitive", () => {
  it("toggles content visibility and updates aria-expanded", () => {
    const handleOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden Account Data</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Toggle Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden Account Data")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden Account Data")).toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Hidden Account Data")).not.toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders open when defaultOpen is true", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Open Section</CollapsibleTrigger>
        <CollapsibleContent>Visible Information</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByText("Visible Information")).toBeInTheDocument();
  });

  it("has zero accessibility violations in open and closed states", async () => {
    const { container, rerender } = render(
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger>Audit Logs</CollapsibleTrigger>
        <CollapsibleContent>Log stream content</CollapsibleContent>
      </Collapsible>
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Audit Logs</CollapsibleTrigger>
        <CollapsibleContent>Log stream content</CollapsibleContent>
      </Collapsible>
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
