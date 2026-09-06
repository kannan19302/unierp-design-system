import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  KafkaConsumerGroupLagMatrix,
  KafkaPartitionLag,
} from "./kafka-consumer-group-lag-matrix";

const samplePartitions: KafkaPartitionLag[] = [
  {
    partitionId: 0,
    topic: "erp.orders.v1",
    currentOffset: 1492040,
    logEndOffset: 1492150,
    lagMessages: 110,
    lagMilliseconds: 420,
    assignedClientId: "order-worker-1",
    clientHost: "10.244.3.42",
    status: "healthy",
  },
  {
    partitionId: 1,
    topic: "erp.orders.v1",
    currentOffset: 2841920,
    logEndOffset: 2844520,
    lagMessages: 2600,
    lagMilliseconds: 18400,
    assignedClientId: "order-worker-2",
    clientHost: "10.244.3.43",
    status: "critical",
  },
];

describe("KafkaConsumerGroupLagMatrix", () => {
  it("renders consumer group title, KPI summaries, and partitions", () => {
    render(
      <KafkaConsumerGroupLagMatrix
        consumerGroupId="order-fulfillment-group"
        partitions={samplePartitions}
      />
    );

    expect(screen.getByText("Consumer Group: order-fulfillment-group")).toBeDefined();
    expect(screen.getByText("2,710 msgs")).toBeDefined();
    expect(screen.getByText("P-0")).toBeDefined();
    expect(screen.getByText("P-1")).toBeDefined();
    expect(screen.getByText("order-worker-1")).toBeDefined();
  });

  it("invokes onResetOffset when reset button is clicked", () => {
    const handleReset = vi.fn();

    render(
      <KafkaConsumerGroupLagMatrix
        consumerGroupId="order-fulfillment-group"
        partitions={samplePartitions}
        onResetOffset={handleReset}
      />
    );

    const resetBtn = screen.getByRole("button", {
      name: /Reset offset for partition 0/i,
    });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledWith(0);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <KafkaConsumerGroupLagMatrix
        consumerGroupId="order-fulfillment-group"
        partitions={samplePartitions}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
