import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { KanbanBoard, kanbanBoardVariants, type KanbanColumn, type KanbanItem } from "./kanban-board";

const MOCK_COLS: KanbanColumn[] = [
  { key: "todo", title: "To Do" },
  { key: "done", title: "Completed" },
];

const MOCK_ITEMS: KanbanItem[] = [
  { id: "task-1", columnKey: "todo", title: "Build Design System" },
  { id: "task-2", columnKey: "done", title: "Setup Monorepo" },
];

describe("KanbanBoard Component", () => {
  it("renders columns and card items", () => {
    render(
      <KanbanBoard
        columns={MOCK_COLS}
        items={MOCK_ITEMS}
        renderCard={(item) => <div>{String(item.title)}</div>}
      />
    );

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Build Design System")).toBeInTheDocument();
    expect(screen.getByText("Setup Monorepo")).toBeInTheDocument();
  });

  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <KanbanBoard
        ref={ref}
        columns={MOCK_COLS}
        items={MOCK_ITEMS}
        renderCard={(item) => <div>{String(item.title)}</div>}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "kanban-board");
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <KanbanBoard
        columns={MOCK_COLS}
        items={MOCK_ITEMS}
        renderCard={(item) => <div>{String(item.title)}</div>}
      />
    );
    expect(container.querySelector('[data-slot="kanban-board"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="kanban-board-column"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="kanban-board-column-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="kanban-board-column-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="kanban-board-card"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <KanbanBoard
          density={density}
          columns={MOCK_COLS}
          items={MOCK_ITEMS}
          renderCard={(item) => <div>{String(item.title)}</div>}
        />
      );
      const root = container.querySelector('[data-slot="kanban-board"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = kanbanBoardVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <KanbanBoard
        columns={MOCK_COLS}
        items={MOCK_ITEMS}
        renderCard={(item) => <div>{String(item.title)}</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
