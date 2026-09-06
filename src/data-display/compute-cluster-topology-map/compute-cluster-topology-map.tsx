import React, { useId, useState } from "react";
import styles from "./compute-cluster-topology-map.module.css";

export type ClusterNodeRole = "PRIMARY" | "READ_REPLICA" | "SHARD_COORDINATOR";
export type ClusterNodeStatus = "HEALTHY" | "DEGRADED" | "DRAINING" | "OFFLINE";

export interface ClusterNodeSpecification {
  id: string; // "node_ch_01"
  nodeName: string; // "clickhouse-prd-node-01"
  role: ClusterNodeRole;
  shardIndex: number; // 1
  cpuPercent: number; // 64
  memoryPercent: number; // 82
  replicationLagMs: number; // 12
  status: ClusterNodeStatus;
  activeQueries: number; // 18
}

export interface ComputeClusterTopologyMapProps {
  clusterName?: string;
  clusterRegion?: string;
  nodes: ClusterNodeSpecification[];
  onPromoteNode?: (nodeId: string) => void;
  onDrainNode?: (nodeId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ComputeClusterTopologyMap: React.FC<ComputeClusterTopologyMapProps> = ({
  clusterName = "Production ClickHouse OLAP Cluster",
  clusterRegion = "us-east-1 (N. Virginia)",
  nodes: initialNodes,
  onPromoteNode,
  onDrainNode,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [nodes, setNodes] = useState<ClusterNodeSpecification[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const healthyCount = nodes.filter((n) => n.status === "HEALTHY").length;
  const degradedCount = nodes.filter((n) => n.status === "DEGRADED").length;
  const offlineCount = nodes.filter((n) => n.status === "OFFLINE" || n.status === "DRAINING").length;

  const handlePromote = (id: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, role: "PRIMARY" as ClusterNodeRole }
          : n.role === "PRIMARY"
          ? { ...n, role: "READ_REPLICA" as ClusterNodeRole }
          : n
      )
    );
    onPromoteNode?.(id);
  };

  const handleDrain = (id: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "DRAINING" as ClusterNodeStatus } : n
      )
    );
    onDrainNode?.(id);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.topologyBadge}>CLUSTER TOPOLOGY MAP</span>
            <span className={styles.regionBadge}>{clusterRegion}</span>
          </div>

          <div className={styles.kpiPills}>
            <span className={styles.kpiHealthy}>{healthyCount} Healthy</span>
            {degradedCount > 0 && (
              <span className={styles.kpiDegraded}>{degradedCount} Degraded</span>
            )}
            {offlineCount > 0 && (
              <span className={styles.kpiOffline}>{offlineCount} Draining/Offline</span>
            )}
          </div>
        </div>

        <h2 id={headingId} className={styles.title}>
          {clusterName}
        </h2>
      </header>

      {/* Node Grid */}
      <div className={styles.nodeGrid} role="region" aria-label="Cluster compute nodes">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isPrimary = node.role === "PRIMARY";
          const isDegraded = node.status === "DEGRADED";
          const isOffline = node.status === "OFFLINE" || node.status === "DRAINING";

          return (
            <article
              key={node.id}
              className={`${styles.nodeCard} ${isSelected ? styles.nodeSelected : ""} ${
                isDegraded ? styles.cardDegraded : isOffline ? styles.cardOffline : ""
              }`}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.nameRow}>
                  <span className={styles.nodeName}>{node.nodeName}</span>
                  <span
                    className={`${styles.roleBadge} ${
                      isPrimary ? styles.rolePrimary : styles.roleReplica
                    }`}
                  >
                    {node.role.replace(/_/g, " ")}
                  </span>
                </div>
                <div className={styles.shardRow}>
                  <span className={styles.shardText}>Shard #{node.shardIndex}</span>
                  <span
                    className={`${styles.statusBadge} ${
                      node.status === "HEALTHY"
                        ? styles.statusHealthy
                        : isDegraded
                        ? styles.statusDegraded
                        : styles.statusOffline
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
              </div>

              <div className={styles.telemetryGrid}>
                <div className={styles.telemetryItem}>
                  <span className={styles.telemetryLabel}>CPU Load</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${
                        node.cpuPercent > 80 ? styles.barCrit : node.cpuPercent > 60 ? styles.barWarn : ""
                      }`}
                      style={{ width: `${Math.min(node.cpuPercent, 100)}%` }}
                    />
                  </div>
                  <span className={styles.telemetryValue}>{node.cpuPercent}%</span>
                </div>

                <div className={styles.telemetryItem}>
                  <span className={styles.telemetryLabel}>Memory Saturation</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${
                        node.memoryPercent > 85 ? styles.barCrit : node.memoryPercent > 70 ? styles.barWarn : ""
                      }`}
                      style={{ width: `${Math.min(node.memoryPercent, 100)}%` }}
                    />
                  </div>
                  <span className={styles.telemetryValue}>{node.memoryPercent}%</span>
                </div>

                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Replication Lag:</span>
                  <span className={`${styles.specValue} ${styles.monoCell}`}>
                    {node.replicationLagMs} ms
                  </span>
                </div>

                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Active Queries:</span>
                  <span className={`${styles.specValue} ${styles.monoCell}`}>
                    {node.activeQueries} concurrent
                  </span>
                </div>
              </div>

              <div className={styles.cardActions}>
                {!isPrimary && (
                  <button
                    type="button"
                    className={styles.promoteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePromote(node.id);
                    }}
                    aria-label={`Promote ${node.nodeName} to Primary Coordinator`}
                  >
                    Promote to Primary
                  </button>
                )}
                {node.status !== "DRAINING" && node.status !== "OFFLINE" && (
                  <button
                    type="button"
                    className={styles.drainBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDrain(node.id);
                    }}
                    aria-label={`Drain traffic from ${node.nodeName}`}
                  >
                    Drain Node
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Synchronized via Apache ZooKeeper / ClickHouse Keeper consensus quorum. Multi-shard routing verified.
        </span>
      </footer>
    </section>
  );
};
