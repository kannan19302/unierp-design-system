import type { Meta, StoryObj } from "@storybook/react";
import { TopologyDependencyGraph } from "./topology-dependency-graph";

const meta: Meta<typeof TopologyDependencyGraph> = {
  title: "Workflow/TopologyDependencyGraph",
  component: TopologyDependencyGraph,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TopologyDependencyGraph>;

export const DefaultServiceGraph: Story = {
  args: {
    title: "Production Cluster Topology (us-east-1)",
  },
};
