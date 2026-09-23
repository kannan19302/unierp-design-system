import type { Meta, StoryObj } from "@storybook/react";
import {
  ComputeClusterTopologyMap,
  ClusterNodeSpecification,
} from "./compute-cluster-topology-map";

const sampleNodes: ClusterNodeSpecification[] = [
  {
    id: "node_ch_01",
    nodeName: "clickhouse-prd-01.us-east",
    role: "PRIMARY",
    shardIndex: 1,
    cpuPercent: 68,
    memoryPercent: 82,
    replicationLagMs: 0,
    status: "HEALTHY",
    activeQueries: 24,
  },
  {
    id: "node_ch_02",
    nodeName: "clickhouse-prd-02.us-east",
    role: "READ_REPLICA",
    shardIndex: 1,
    cpuPercent: 54,
    memoryPercent: 74,
    replicationLagMs: 14,
    status: "HEALTHY",
    activeQueries: 12,
  },
  {
    id: "node_ch_03",
    nodeName: "clickhouse-prd-03.us-east",
    role: "PRIMARY",
    shardIndex: 2,
    cpuPercent: 91,
    memoryPercent: 88,
    replicationLagMs: 120,
    status: "DEGRADED",
    activeQueries: 38,
  },
  {
    id: "node_ch_04",
    nodeName: "clickhouse-prd-04.us-east",
    role: "READ_REPLICA",
    shardIndex: 2,
    cpuPercent: 12,
    memoryPercent: 30,
    replicationLagMs: 0,
    status: "DRAINING",
    activeQueries: 0,
  },
];

const meta: Meta<typeof ComputeClusterTopologyMap> = {
  title: "Platforms/DeveloperPlatform/ComputeClusterTopologyMap",
  component: ComputeClusterTopologyMap,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComputeClusterTopologyMap>;

export const Default: Story = {
  args: {
    clusterName: "Production ClickHouse OLAP Cluster",
    clusterRegion: "us-east-1 (N. Virginia)",
    nodes: sampleNodes,
  },
};

export const UltraCompact: Story = {
  args: {
    clusterName: "Production ClickHouse OLAP Cluster",
    clusterRegion: "us-east-1 (N. Virginia)",
    nodes: sampleNodes,
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
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Standard Density Topology</h4>
        <ComputeClusterTopologyMap
          clusterName="ClickHouse Production Primary"
          clusterRegion="us-east-1"
          nodes={sampleNodes}
          density="standard"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Ultra-Compact Topology</h4>
        <ComputeClusterTopologyMap
          clusterName="ClickHouse Production Compact"
          clusterRegion="us-west-2"
          nodes={sampleNodes}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};
