import type { Meta, StoryObj } from "@storybook/react";
import {
  ContainerExecTerminalConsole,
  TerminalSessionTab,
} from "./container-exec-terminal-console";

const sampleSessions: TerminalSessionTab[] = [
  {
    id: "sess-1",
    containerName: "api-worker-0",
    podName: "unierp-api-7b89f-2m19a",
    state: "running",
    restartCount: 0,
  },
  {
    id: "sess-2",
    containerName: "redis-sentinel-1",
    podName: "redis-ha-cluster-01",
    state: "running",
    restartCount: 1,
  },
  {
    id: "sess-3",
    containerName: "billing-batch-cron",
    podName: "cron-billing-nightly-8x92",
    state: "crash_loop",
    restartCount: 5,
  },
];

const meta: Meta<typeof ContainerExecTerminalConsole> = {
  title: "Data Display/ContainerExecTerminalConsole",
  component: ContainerExecTerminalConsole,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContainerExecTerminalConsole>;

export const Default: Story = {
  args: {
    clusterName: "aws-eks-prod-us-east-1",
    namespace: "production",
    sessions: sampleSessions,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Compact TTY Session</h4>
        <ContainerExecTerminalConsole
          clusterName="prod-eks-us-east-1"
          namespace="production"
          sessions={sampleSessions}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Ultra-Compact Session</h4>
        <ContainerExecTerminalConsole
          clusterName="staging-eks-us-west-2"
          namespace="staging"
          sessions={sampleSessions}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};
