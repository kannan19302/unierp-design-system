import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ViewSwitcher, type ViewMode } from "./view-switcher";

const SwitcherDemo = () => {
  const [view, setView] = useState<ViewMode>("list");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <ViewSwitcher
        activeView={view}
        onViewChange={setView}
        availableViews={["list", "chart", "kanban", "grid"]}
      />
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-default)" }}>
        Active Layout: <strong>{view.toUpperCase()}</strong>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Layout/ViewSwitcher",
  component: SwitcherDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <SwitcherDemo />,
};
