import type { Meta, StoryObj } from "@storybook/react";
import { ProgressNotification } from "./progress-notification";

const meta: Meta<typeof ProgressNotification> = {
  title: "Core/Feedback/ProgressNotification",
  component: ProgressNotification,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressNotification>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ProgressNotification
        title="Deploying v3.2.1 to Production"
        progress={67}
        status="running"
        message="Building container images..."
        onCancel={() => {}}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ProgressNotification
        title="Database Migration in Progress"
        progress={45}
        status="running"
        message="Transforming table records (45,000 / 100,000)..."
        onCancel={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <ProgressNotification
        title="Data Export"
        progress={30}
        status="running"
        message="Generating CSV rows..."
        onCancel={() => {}}
      />
      <ProgressNotification
        title="Sync Completed"
        progress={100}
        status="success"
        message="All records synchronized with cloud ledger."
      />
      <ProgressNotification
        title="Artifact Upload Failed"
        progress={78}
        status="error"
        message="Connection reset by peer at 78%."
        onRetry={() => {}}
      />
      <ProgressNotification
        title="Process Paused"
        progress={50}
        status="paused"
        message="Waiting for tenant dual-signoff authorization."
      />
    </div>
  ),
};
