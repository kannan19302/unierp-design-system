import React, { useId, useState, useMemo } from "react";
import styles from "./kafka-consumer-group-lag-matrix.module.css";

export type ConsumerLagStatus = "healthy" | "warning" | "critical";

export interface KafkaPartitionLag {
  partitionId: number; // e.g. 0
  topic: string; // "erp.orders.v1"
  currentOffset: number; // 1492040
  logEndOffset: number; // 1492150
  lagMessages: number; // 110
  lagMilliseconds: number; // 420ms
  assignedClientId?: string; // "order-worker-7f9a"
  clientHost?: string; // "10.244.3.42"
  status: ConsumerLagStatus;
}

export interface KafkaConsumerGroupLagMatrixProps {
  consumerGroupId: string; // "order-fulfillment-group"
  clusterBootstrap?: string; // "kafka-prod-broker:9092"
  protocolType?: string; // "consumer (round-robin)"
  partitions: KafkaPartitionLag[];
  onSelectPartition?: (partition: KafkaPartitionLag) => void;
  onResetOffset?: (partitionId: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const KafkaConsumerGroupLagMatrix: React.FC<KafkaConsumerGroupLagMatrixProps> = ({
  consumerGroupId,
  clusterBootstrap = "kafka-prod-broker:9092",
  protocolType = "consumer (round-robin)",
  partitions,
  onSelectPartition,
  onResetOffset,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [selectedPartitionId, setSelectedPartitionId] = useState<number | null>(
    partitions[0]?.partitionId ?? null
  );

  const availableTopics = useMemo(() => {
    return Array.from(new Set(partitions.map((p) => p.topic)));
  }, [partitions]);

  const filteredPartitions = useMemo(() => {
    if (topicFilter === "all") return partitions;
    return partitions.filter((p) => p.topic === topicFilter);
  }, [partitions, topicFilter]);

  const totalLag = useMemo(() => {
    return filteredPartitions.reduce((sum, p) => sum + p.lagMessages, 0);
  }, [filteredPartitions]);

  const maxLagMs = useMemo(() => {
    return filteredPartitions.reduce((max, p) => Math.max(max, p.lagMilliseconds), 0);
  }, [filteredPartitions]);

  const getStatusBadge = (status: ConsumerLagStatus) => {
    switch (status) {
      case "critical":
        return <span className={`${styles.statusBadge} ${styles.stCritical}`}>Critical Lag</span>;
      case "warning":
        return <span className={`${styles.statusBadge} ${styles.stWarning}`}>Lagging</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.stHealthy}`}>Healthy</span>;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaGroup}>
          <div className={styles.taglineRow}>
            <span className={styles.kafkaBadge}>KAFKA EVENT STREAMING</span>
            <span className={styles.bootstrapText}>{clusterBootstrap}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Consumer Group: {consumerGroupId}
          </h2>
          <p className={styles.subtitle}>Protocol: {protocolType}</p>
        </div>

        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Message Lag</span>
            <strong className={styles.kpiValueHighlight}>
              {totalLag.toLocaleString()} msgs
            </strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Max Consumer Latency</span>
            <strong className={styles.kpiValue}>{maxLagMs} ms</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Active Partitions</span>
            <strong className={styles.kpiValue}>{filteredPartitions.length}</strong>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <label htmlFor="kafka-topic-filter" className={styles.filterLabel}>
          Topic Filter:
        </label>
        <select
          id="kafka-topic-filter"
          className={styles.filterSelect}
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        >
          <option value="all">All Topics ({availableTopics.length})</option>
          {availableTopics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* High Density Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Kafka Partitions and Consumer Lag Metrics">
          <caption className={styles.srOnly}>
            Kafka consumer group partition offsets, message lag, and consumer assignment
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thCenter}>Partition</th>
              <th scope="col" className={styles.thLeft}>Topic</th>
              <th scope="col" className={styles.thRight}>Current Offset</th>
              <th scope="col" className={styles.thRight}>Log-End Offset</th>
              <th scope="col" className={styles.thRight}>Lag (Messages)</th>
              <th scope="col" className={styles.thRight}>Lag (ms)</th>
              <th scope="col" className={styles.thLeft}>Assigned Client ID</th>
              <th scope="col" className={styles.thCenter}>Status</th>
              <th scope="col" className={styles.thCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartitions.map((p) => {
              const isSelected = selectedPartitionId === p.partitionId;
              return (
                <tr
                  key={`${p.topic}-${p.partitionId}`}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                  onClick={() => {
                    setSelectedPartitionId(p.partitionId);
                    onSelectPartition?.(p);
                  }}
                >
                  <td className={styles.tdCenter}>
                    <span className={styles.partitionId}>P-{p.partitionId}</span>
                  </td>
                  <td className={styles.tdLeft}>
                    <span className={styles.topicName}>{p.topic}</span>
                  </td>
                  <td className={styles.tdRight}>{p.currentOffset.toLocaleString()}</td>
                  <td className={styles.tdRight}>{p.logEndOffset.toLocaleString()}</td>
                  <td className={styles.tdRight}>
                    <strong
                      className={`${styles.lagMsgNum} ${
                        p.status === "critical"
                          ? styles.txtCritical
                          : p.status === "warning"
                          ? styles.txtWarning
                          : ""
                      }`}
                    >
                      {p.lagMessages.toLocaleString()}
                    </strong>
                  </td>
                  <td className={styles.tdRight}>{p.lagMilliseconds} ms</td>
                  <td className={styles.tdLeft}>
                    {p.assignedClientId ? (
                      <div>
                        <div className={styles.clientId}>{p.assignedClientId}</div>
                        <span className={styles.clientHost}>{p.clientHost}</span>
                      </div>
                    ) : (
                      <span className={styles.unassigned}>Unassigned / Rebalancing</span>
                    )}
                  </td>
                  <td className={styles.tdCenter}>{getStatusBadge(p.status)}</td>
                  <td className={styles.tdCenter}>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onResetOffset?.(p.partitionId);
                      }}
                      aria-label={`Reset offset for partition ${p.partitionId}`}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
