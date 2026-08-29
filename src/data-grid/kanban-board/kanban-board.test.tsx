import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { KanbanBoard, type KanbanColumn, type KanbanItem } from "./kanban-board";

const MOCK_COLS: KanbanColumn[] = [
  { key: "todo", title: "To Do" },
  { key: "done", title: "Completed" },
];

const MOCK_ITEMS: KanbanItem[] = [
  { id: "task-1", columnKey: "todo", title: "Build Design System" },
  { id: "task-2", columnKey: "done", title: "Setup Monorepo" },
];

describe("KanbanBoard Primitive", () => {
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
