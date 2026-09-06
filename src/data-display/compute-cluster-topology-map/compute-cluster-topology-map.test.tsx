import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
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
];

describe("ComputeClusterTopologyMap", () => {
  it("renders cluster header and compute node cards truthfully", () => {
    render(
      <ComputeClusterTopologyMap
        clusterName="Production ClickHouse OLAP Cluster"
        nodes={sampleNodes}
      />
    );
    expect(screen.getByText("Production ClickHouse OLAP Cluster")).toBeInTheDocument();
    expect(screen.getByText("clickhouse-prd-01.us-east")).toBeInTheDocument();
    expect(screen.getByText("clickhouse-prd-02.us-east")).toBeInTheDocument();
    expect(screen.getByText("2 Healthy")).toBeInTheDocument();
  });

  it("handles promoting replica node and draining node", () => {
    const handlePromote = vi.fn();
    const handleDrain = vi.fn();
    render(
      <ComputeClusterTopologyMap
        nodes={sampleNodes}
        onPromoteNode={handlePromote}
        onDrainNode={handleDrain}
      />
    );

    const promoteBtn = screen.getByRole("button", {
      name: "Promote clickhouse-prd-02.us-east to Primary Coordinator",
    });
    fireEvent.click(promoteBtn);
    expect(handlePromote).toHaveBeenCalledWith("node_ch_02");

    const drainBtn = screen.getByRole("button", {
      name: "Drain traffic from clickhouse-prd-01.us-east",
    });
    fireEvent.click(drainBtn);
    expect(handleDrain).toHaveBeenCalledWith("node_ch_01");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ComputeClusterTopologyMap nodes={sampleNodes} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
