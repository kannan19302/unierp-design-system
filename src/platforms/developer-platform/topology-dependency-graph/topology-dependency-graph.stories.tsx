import type { Meta, StoryObj } from "@storybook/react";
import { TopologyDependencyGraph } from "./topology-dependency-graph";

const meta: Meta<typeof TopologyDependencyGraph> = {
  title: "Platforms/DeveloperPlatform/TopologyDependencyGraph",
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

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <TopologyDependencyGraph {...args} title="Core Distributed Topology" />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Standard Topology View</h3>
        <TopologyDependencyGraph title="Production Cluster Topology (us-east-1)" density="compact" />
      </div>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Comfortable Density View</h3>
        <TopologyDependencyGraph title="Staging Service Mesh Topology" density="comfortable" />
      </div>
    </div>
  ),
};
