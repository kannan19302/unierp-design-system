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
