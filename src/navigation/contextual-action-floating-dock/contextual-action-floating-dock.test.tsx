import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContextualActionFloatingDock } from "./contextual-action-floating-dock";

const sampleActions = [
  { id: "dup", label: "Duplicate", onClick: vi.fn() },
  { id: "del", label: "Delete", isDanger: true, onClick: vi.fn() },
];

describe("ContextualActionFloatingDock", () => {
  it("renders selected count and triggers action clicks", () => {
    render(
      <ContextualActionFloatingDock
        selectedCount={3}
        actions={sampleActions}
        isOpen={true}
      />
    );

    expect(screen.getByText("3 selected")).toBeInTheDocument();

    const dupBtn = screen.getByRole("button", { name: /Duplicate/i });
    fireEvent.click(dupBtn);
    expect(sampleActions[0].onClick).toHaveBeenCalled();
  });

  it("handles dismiss trigger", () => {
    const handleDismiss = vi.fn();
    render(
      <ContextualActionFloatingDock
        selectedCount={2}
        actions={sampleActions}
        isOpen={true}
        onDismiss={handleDismiss}
      />
    );

    const dismissBtn = screen.getByRole("button", { name: /Clear selection and dismiss dock/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalled();
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <ContextualActionFloatingDock
        selectedCount={3}
        actions={sampleActions}
        isOpen={true}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
