import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ViewSwitcher, type ViewMode } from "./view-switcher";

const meta: Meta<typeof ViewSwitcher> = {
  title: "Layout/ViewSwitcher",
  component: ViewSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
  argTypes: {
    activeView: {
      control: { type: "select" },
      options: ["list", "chart", "kanban", "grid"],
      description: "The currently active layout view mode",
    },
    onViewChange: {
      action: "viewChanged",
      description: "Callback invoked when a view button is selected",
    },
    availableViews: {
      control: "check",
      options: ["list", "chart", "kanban", "grid"],
      description: "Set of view options to display in switcher",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ViewSwitcher>;

export const Default: Story = {
  render: () => {
    const [view, setView] = useState<ViewMode>("list");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
        <ViewSwitcher
          activeView={view}
          onViewChange={setView}
          availableViews={["list", "chart", "kanban", "grid"]}
        />
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-surface-elevated)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          Active Layout: <strong>{view.toUpperCase()}</strong>
        </div>
      </div>
    );
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [view, setView] = useState<ViewMode>("kanban");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
        <h4>Anatomy and Composition</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          The ViewSwitcher exposes an enterprise-grade segmented control with SVG vector icons,
          ARIA state semantics (<code>aria-pressed</code>), and responsive token layouts.
        </p>
        <ViewSwitcher
          activeView={view}
          onViewChange={setView}
          availableViews={["list", "chart", "kanban", "grid"]}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>List Active</h5>
          <ViewSwitcher
            activeView="list"
            onViewChange={() => {}}
            availableViews={["list", "chart", "kanban", "grid"]}
          />
        </div>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Chart Active</h5>
          <ViewSwitcher
            activeView="chart"
            onViewChange={() => {}}
            availableViews={["list", "chart", "kanban", "grid"]}
          />
        </div>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Kanban Active</h5>
          <ViewSwitcher
            activeView="kanban"
            onViewChange={() => {}}
            availableViews={["list", "chart", "kanban", "grid"]}
          />
        </div>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Grid Active (Dual Toggle)</h5>
          <ViewSwitcher
            activeView="grid"
            onViewChange={() => {}}
            availableViews={["list", "grid"]}
          />
        </div>
      </div>
    );
  },
};
