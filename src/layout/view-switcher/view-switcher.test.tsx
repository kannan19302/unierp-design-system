import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ViewSwitcher } from "./view-switcher";

describe("ViewSwitcher Primitive", () => {
  it("renders active view and triggers onViewChange", () => {
    const onViewChange = vi.fn();
    render(
      <ViewSwitcher
        activeView="list"
        onViewChange={onViewChange}
        availableViews={["list", "chart", "kanban", "grid"]}
      />
    );

    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Chart")).toBeInTheDocument();
    expect(screen.getByText("Kanban")).toBeInTheDocument();
    expect(screen.getByText("Grid")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Kanban"));
    expect(onViewChange).toHaveBeenCalledWith("kanban");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ViewSwitcher
        activeView="list"
        onViewChange={() => {}}
        availableViews={["list", "chart"]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
