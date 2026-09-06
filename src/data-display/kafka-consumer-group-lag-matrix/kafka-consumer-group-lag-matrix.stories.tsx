import type { Meta, StoryObj } from "@storybook/react";
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
    assignedClientId: "order-worker-7f9a-pod-1",
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
    assignedClientId: "order-worker-7f9a-pod-2",
    clientHost: "10.244.3.43",
    status: "critical",
  },
  {
    partitionId: 2,
    topic: "erp.orders.v1",
    currentOffset: 941030,
    logEndOffset: 941450,
    lagMessages: 420,
    lagMilliseconds: 1200,
    assignedClientId: "order-worker-7f9a-pod-3",
    clientHost: "10.244.3.44",
    status: "warning",
  },
  {
    partitionId: 3,
    topic: "erp.orders.v1",
    currentOffset: 1120400,
    logEndOffset: 1120402,
    lagMessages: 2,
    lagMilliseconds: 15,
    assignedClientId: "order-worker-7f9a-pod-4",
    clientHost: "10.244.3.45",
    status: "healthy",
  },
  {
    partitionId: 0,
    topic: "erp.inventory.sync",
    currentOffset: 504920,
    logEndOffset: 504935,
    lagMessages: 15,
    lagMilliseconds: 50,
    assignedClientId: "inventory-sync-worker-1",
    clientHost: "10.244.4.12",
    status: "healthy",
  },
];

const meta: Meta<typeof KafkaConsumerGroupLagMatrix> = {
  title: "Data Display/KafkaConsumerGroupLagMatrix",
  component: KafkaConsumerGroupLagMatrix,
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
type Story = StoryObj<typeof KafkaConsumerGroupLagMatrix>;

export const Default: Story = {
  args: {
    consumerGroupId: "order-fulfillment-stream-group",
    clusterBootstrap: "kafka-prod-broker-01.internal:9092",
    partitions: samplePartitions,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
