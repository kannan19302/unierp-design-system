import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard, type KanbanColumn, type KanbanItem } from "./kanban-board";

const MOCK_COLUMNS: KanbanColumn[] = [
  { key: "backlog", title: "Backlog", color: "var(--color-text-tertiary)" },
  { key: "in_progress", title: "In Progress", color: "var(--color-primary, #3b82f6)" },
  { key: "review", title: "Review", color: "var(--color-warning, #f59e0b)" },
  { key: "done", title: "Done", color: "var(--color-success, #10b981)" },
];

const INITIAL_CARDS: KanbanItem[] = [
  { id: "c1", columnKey: "backlog", title: "Multi-currency invoicing", priority: "Medium" },
  { id: "c2", columnKey: "in_progress", title: "Design tokens sync", priority: "High" },
  { id: "c3", columnKey: "review", title: "Axe accessibility sweep", priority: "Urgent" },
  { id: "c4", columnKey: "done", title: "WCAG AA Contrast Audit", priority: "Low" },
];

const KanbanDemo = () => {
  const [cards, setCards] = useState<KanbanItem[]>(INITIAL_CARDS);

  const handleCardMove = (itemId: string, _from: string, to: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, columnKey: to } : c)),
    );
  };

  return (
    <div style={{ padding: "var(--space-4)" }}>
      <KanbanBoard
        columns={MOCK_COLUMNS}
        items={cards}
        onCardMove={handleCardMove}
        renderCard={(item) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBottom: "var(--space-1)" }}>
              {String(item.title)}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Priority: <strong>{String(item.priority)}</strong>
            </div>
          </div>
        )}
      />
    </div>
  );
};

const meta: Meta<typeof KanbanBoard> = {
  title: "DataGrid/KanbanBoard",
  component: KanbanDemo,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <KanbanDemo />,
};
