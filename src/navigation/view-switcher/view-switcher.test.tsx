import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ViewSwitcher } from "./view-switcher";

describe("ViewSwitcher Component", () => {
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

  it("applies data-slot annotations throughout component anatomy", () => {
    const { container } = render(
      <ViewSwitcher
        activeView="list"
        onViewChange={() => {}}
        availableViews={["list", "chart"]}
      />
    );

    expect(container.querySelector('[data-slot="view-switcher"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="view-switcher-button"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="view-switcher-icon"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="view-switcher-label"]')).toHaveLength(2);
  });

  it("supports 4-tier density scaling", () => {
    const { rerender, container } = render(
      <ViewSwitcher activeView="list" onViewChange={() => {}} density="ultra-compact" />
    );
    expect(container.querySelector('[data-slot="view-switcher"]')?.className).toContain("densityUltraCompact");

    rerender(<ViewSwitcher activeView="list" onViewChange={() => {}} density="compact" />);
    expect(container.querySelector('[data-slot="view-switcher"]')?.className).toContain("densityCompact");

    rerender(<ViewSwitcher activeView="list" onViewChange={() => {}} density="standard" />);
    expect(container.querySelector('[data-slot="view-switcher"]')?.className).toContain("densityStandard");

    rerender(<ViewSwitcher activeView="list" onViewChange={() => {}} density="comfortable" />);
    expect(container.querySelector('[data-slot="view-switcher"]')?.className).toContain("densityComfortable");
  });

  it("supports custom options", () => {
    const onViewChange = vi.fn();
    render(
      <ViewSwitcher
        activeView="grid"
        onViewChange={onViewChange}
        options={[
          { mode: "grid", label: "Compact Grid", icon: <span>G</span> },
          { mode: "list", label: "Detailed Table", icon: <span>T</span> },
        ]}
      />
    );

    expect(screen.getByText("Compact Grid")).toBeInTheDocument();
    expect(screen.getByText("Detailed Table")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Detailed Table"));
    expect(onViewChange).toHaveBeenCalledWith("list");
  });

  it("forwards ref correctly to the container", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ViewSwitcher
        ref={ref}
        activeView="list"
        onViewChange={() => {}}
        availableViews={["list", "chart"]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "group");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ViewSwitcher
        activeView="list"
        onViewChange={() => {}}
        availableViews={["list", "chart", "kanban", "grid"]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
