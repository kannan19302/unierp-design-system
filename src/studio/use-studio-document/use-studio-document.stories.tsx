import type { Meta, StoryObj } from "@storybook/react";
import { useStudioDocument } from "./use-studio-document";
import styles from "./use-studio-document.module.css";

const DocumentDemo = () => {
  const { doc, update, undo, redo, canUndo, canRedo, dirty, historyDepth } =
    useStudioDocument({ heading: "Initial Title", count: 0 });

  return (
    <div className={styles.container}>
      <h4 style={{ margin: 0 }}>useStudioDocument Document Store</h4>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Dirty: <strong>{dirty ? "Yes (Unsaved)" : "No"}</strong> • Undo Depth: <strong>{historyDepth}</strong>
      </p>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          value={doc.heading}
          onChange={(e) => update((prev) => ({ ...prev, heading: e.target.value }))}
          style={{ padding: "6px 12px", border: "1px solid var(--color-border-default)", borderRadius: "4px" }}
        />
        <button
          type="button"
          onClick={() => update((prev) => ({ ...prev, count: prev.count + 1 }))}
          style={{ padding: "6px 12px", background: "var(--color-brand, #3b82f6)", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          Increment ({doc.count})
        </button>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Studio/UseStudioDocument",
  component: DocumentDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <DocumentDemo />,
};
