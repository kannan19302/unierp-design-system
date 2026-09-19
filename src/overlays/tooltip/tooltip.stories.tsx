import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./tooltip";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Exports current grid rows to CSV (Alt+E)",
    children: <Button variant="secondary">Export Data</Button>,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-6)" }}>
      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
        <strong>Tooltip Anatomy:</strong> Interactive trigger element, aria-describedby linkage, floating portal container, and directional offset positioning.
      </div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <Tooltip content="Re-runs automated quality gate validations on this commit" side="top">
          <Button variant="primary" size="sm">Validate Pipeline</Button>
        </Tooltip>
        <Tooltip content="Permanently purges unsaved workspace changes" side="bottom">
          <Button variant="danger" size="sm">Discard Edits</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Top Placement Tooltip
        </h4>
        <div style={{ padding: "var(--space-4)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Tooltip content="Keyboard shortcut: Ctrl+S" side="top">
            <Button variant="secondary" size="sm">Save Draft</Button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Right Placement Tooltip
        </h4>
        <div style={{ padding: "var(--space-4)", background: "var(--color-bg-surface)", borderRadius: "var(--radius-md)" }}>
          <Tooltip content="Inspect database schema definitions" side="right">
            <Button variant="outline" size="sm">Schema Inspector</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};
