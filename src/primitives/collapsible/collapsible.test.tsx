import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleVariants,
} from "./collapsible";

describe("Collapsible Primitive", () => {
  it("toggles content visibility and updates aria-expanded with data-slot attributes", () => {
    const handleOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden Account Data</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Toggle Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(screen.queryByText("Hidden Account Data")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(screen.getByText("Hidden Account Data")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='collapsible-content']")).toBeInTheDocument();
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
    expect(document.querySelector("[data-slot='collapsible']")).toHaveAttribute(
      "data-state",
      "open"
    );
  });

  it("supports polymorphic asChild trigger", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <div role="button" tabIndex={0}>
            Custom Trigger
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>Custom Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Custom Trigger" });
    expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
  });

  it("generates base class via collapsibleVariants", () => {
    const classes = collapsibleVariants();
    expect(classes).toContain("collapsible");
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
