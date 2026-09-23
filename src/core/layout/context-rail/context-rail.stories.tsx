import type { Meta, StoryObj } from "@storybook/react";
import { ContextRail } from "./context-rail";

const meta: Meta<typeof ContextRail> = {
  title: "Core/Layout/ContextRail",
  component: ContextRail,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextRail>;

const SAMPLE_TABS = [
  { id: "details", label: "Details", content: <div style={{ padding: "var(--space-3)" }}>Invoice #INV-2026 details and billing metadata</div> },
  { id: "activity", label: "Activity", badge: 3, content: <div style={{ padding: "var(--space-3)" }}>3 recorded audit events in activity ledger</div> },
  { id: "comments", label: "Comments", badge: 1, content: <div style={{ padding: "var(--space-3)" }}>1 open comment thread regarding purchase order</div> },
];

export const Default: Story = {
  args: {
    title: "Document Inspector",
    tabs: SAMPLE_TABS,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", height: 450, width: "100%", background: "var(--color-bg)" }}>
      <div style={{ flex: 1, padding: "var(--space-4)" }}>
        <h3>Primary Workspace Canvas</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Active record content sits on the left while the context rail stays docked on the right.
        </p>
      </div>
      <ContextRail
        title="Inspector"
        tabs={SAMPLE_TABS}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-4)", height: 400 }}>
      <div style={{ width: 320, height: "100%" }}>
        <ContextRail title="Expanded Context" tabs={SAMPLE_TABS} collapsed={false} />
      </div>
      <div style={{ width: 80, height: "100%" }}>
        <ContextRail title="Collapsed Rail" tabs={SAMPLE_TABS} collapsed={true} />
      </div>
    </div>
  ),
};
