import type { Meta, StoryObj } from "@storybook/react";
import { useStudioDocument } from "./use-studio-document";
import styles from "./use-studio-document.module.css";
import { Button } from "../../primitives/button";

const DocumentDemo = ({ initialTitle = "Initial Title", initialCount = 0 }: { initialTitle?: string; initialCount?: number }) => {
  const { doc, update, undo, redo, canUndo, canRedo, dirty, historyDepth } =
    useStudioDocument({ heading: initialTitle, count: initialCount });

  return (
    <div className={styles.container} style={{ width: 440 }}>
      <h4 style={{ margin: 0 }}>Studio Document State Store</h4>
      <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>
        Dirty: <strong>{dirty ? "Yes (Unsaved)" : "No"}</strong> • History Depth: <strong>{historyDepth}</strong>
      </p>

      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", margin: "var(--space-3) 0" }}>
        <input
          type="text"
          value={doc.heading}
          onChange={(e) => update((prev) => ({ ...prev, heading: e.target.value }))}
          aria-label="Document Title"
          style={{
            padding: "var(--space-1-5) var(--space-3)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-sm)",
            flex: 1,
            background: "var(--color-surface-base)",
            color: "var(--color-fg-default)",
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => update((prev) => ({ ...prev, count: prev.count + 1 }))}
        >
          Count: {doc.count}
        </Button>
      </div>

      <div className={styles.controls} style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
          Redo
        </Button>
      </div>
    </div>
  );
};

/**
 * Headless studio document hook providing immutable revision history, undo/redo stacks, and dirty tracking.
 */
const meta: Meta = {
  title: "Core/Studio/UseStudioDocument",
  component: DocumentDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Studio document state management hook featuring linear undo/redo stacks, deep change tracking, and dirty state management for low-code canvases.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <DocumentDemo />,
};

export const Prepopulated: Story = {
  render: () => <DocumentDemo initialTitle="Report Template v2" initialCount={5} />,
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Clean State (No History)
        </h4>
        <DocumentDemo initialTitle="Untitled Document" initialCount={0} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Active Session with Seed Data
        </h4>
        <DocumentDemo initialTitle="Customer Invoice Configuration" initialCount={12} />
      </div>
    </div>
  ),
};
