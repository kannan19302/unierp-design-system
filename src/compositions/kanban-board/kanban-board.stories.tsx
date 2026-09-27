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

const KanbanDemo = ({ density = "standard" }: { density?: "ultra-compact" | "compact" | "standard" | "comfortable" }) => {
  const [cards, setCards] = useState<KanbanItem[]>(INITIAL_CARDS);

  const handleCardMove = (itemId: string, _from: string, to: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, columnKey: to } : c)),
    );
  };

  return (
    <div style={{ paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <KanbanBoard
        columns={MOCK_COLUMNS}
        items={cards}
        density={density}
        onCardMove={handleCardMove}
        renderCard={(item) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", marginBlockEnd: "var(--space-1)" }}>
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
  title: "Compositions/KanbanBoard",
  component: KanbanBoard,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => <KanbanDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => <KanbanDemo />,
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (200px columns)</h4>
        <KanbanDemo density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (240px columns)</h4>
        <KanbanDemo density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (260px columns)</h4>
        <KanbanDemo density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (300px columns)</h4>
        <KanbanDemo density="comfortable" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Active Kanban Workflow</h4>
        <KanbanDemo />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Empty Columns Board</h4>
        <KanbanBoard
          columns={MOCK_COLUMNS}
          items={[]}
          renderCard={(item) => <div>{String(item.title)}</div>}
        />
      </div>
    </div>
  ),
};
