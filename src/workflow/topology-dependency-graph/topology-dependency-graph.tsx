import React, { useState, useId, useMemo } from "react";
import styles from "./topology-dependency-graph.module.css";

export type TopologyNodeType = "gateway" | "service" | "database" | "queue" | "external";
export type TopologyHealth = "healthy" | "warning" | "error";

export interface TopologyNode {
  id: string;
  name: string;
  type: TopologyNodeType;
  health: TopologyHealth;
  x: number; // SVG coordinate 0-800
  y: number; // SVG coordinate 0-500
  p99Ms?: number;
  rps?: number;
  errorRate?: number;
}

export interface TopologyEdge {
  id: string;
  source: string; // source node ID
  target: string; // target node ID
  trafficFlow?: "normal" | "degraded" | "blocked";
}

export interface TopologyDependencyGraphProps {
  /** Graph Title */
  title?: string;
  /** Topology Nodes */
  nodes: TopologyNode[];
  /** Directional Edges */
  edges: TopologyEdge[];
  /** Callback fired when a node is selected */
  onSelectNode?: (node: TopologyNode) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_NODES: TopologyNode[] = [
  { id: "edge-gw", name: "Global Edge Envoy Gateway", type: "gateway", health: "healthy", x: 80, y: 220, p99Ms: 14, rps: 12500, errorRate: 0.01 },
  { id: "auth-svc", name: "UniERP Auth & IDP Service", type: "service", health: "healthy", x: 280, y: 120, p99Ms: 22, rps: 4200, errorRate: 0.02 },
  { id: "ledger-svc", name: "Subledger Distribution Engine", type: "service", health: "warning", x: 280, y: 320, p99Ms: 185, rps: 8300, errorRate: 1.45 },
  { id: "pg-cluster", name: "PostgreSQL 17 Multi-Tenant DB", type: "database", health: "healthy", x: 520, y: 180, p99Ms: 8, rps: 9800, errorRate: 0.0 },
  { id: "kafka-broker", name: "Kafka Event Distribution Stream", type: "queue", health: "healthy", x: 520, y: 360, p99Ms: 4, rps: 15400, errorRate: 0.0 },
  { id: "stripe-api", name: "Stripe Payment Settlement API", type: "external", health: "healthy", x: 720, y: 280, p99Ms: 220, rps: 450, errorRate: 0.1 },
];

const DEFAULT_EDGES: TopologyEdge[] = [
  { id: "e1", source: "edge-gw", target: "auth-svc" },
  { id: "e2", source: "edge-gw", target: "ledger-svc", trafficFlow: "degraded" },
  { id: "e3", source: "auth-svc", target: "pg-cluster" },
  { id: "e4", source: "ledger-svc", target: "pg-cluster" },
  { id: "e5", source: "ledger-svc", target: "kafka-broker" },
  { id: "e6", source: "ledger-svc", target: "stripe-api" },
];

export const TopologyDependencyGraph: React.FC<TopologyDependencyGraphProps> = ({
  title = "Enterprise Service Topology & Cluster Dependency Graph",
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  onSelectNode,
  density = "compact",
  className,
}) => {
  const graphId = useId();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("ledger-svc");
  const [filterType, setFilterType] = useState<"all" | TopologyNodeType>("all");

  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  const handleNodeClick = (node: TopologyNode) => {
    setSelectedNodeId(node.id);
    onSelectNode?.(node);
  };

  const getHealthClass = (health: TopologyHealth) => {
    if (health === "error") return styles.healthError;
    if (health === "warning") return styles.healthWarning;
    return styles.healthHealthy;
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${graphId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.topBadge}>TOPOLOGY</span>
          <h3 id={`${graphId}-title`} className={styles.title}>
            {title}
          </h3>
          <span className={styles.metricPill}>
            {nodes.length} Nodes • {edges.length} Dependency Edges
          </span>
        </div>

        {/* Filter Buttons */}
        <div className={styles.filterGroup} role="group" aria-label="Filter topology by category">
          <button
            type="button"
            className={`${styles.filterBtn} ${filterType === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterType === "service" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterType("service")}
          >
            Services
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterType === "database" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterType("database")}
          >
            Databases
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterType === "queue" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterType("queue")}
          >
            Streams
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Viewport */}
      <div className={styles.workspace}>
        {/* SVG Interactive Canvas */}
        <div className={styles.canvasContainer}>
          <svg
            viewBox="0 0 820 460"
            className={styles.svgCanvas}
            aria-label="Service dependency architecture diagram"
          >
            <defs>
              <marker
                id={`${graphId}-arrow`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--color-border-hover)" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge) => {
              const src = nodeMap.get(edge.source);
              const tgt = nodeMap.get(edge.target);
              if (!src || !tgt) return null;

              const isDegraded = edge.trafficFlow === "degraded";
              const pathD = `M ${src.x + 60} ${src.y + 25} C ${(src.x + tgt.x) / 2} ${src.y + 25}, ${(src.x + tgt.x) / 2} ${tgt.y + 25}, ${tgt.x - 10} ${tgt.y + 25}`;

              return (
                <g key={edge.id} className={styles.edgeGroup}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isDegraded ? "var(--color-warning)" : "var(--color-border)"}
                    strokeWidth={isDegraded ? 3 : 2}
                    markerEnd={`url(#${graphId}-arrow)`}
                    className={`${styles.edgePath} ${isDegraded ? styles.edgeDegraded : ""}`}
                  />
                </g>
              );
            })}

            {/* Render Nodes as SVG foreignObjects / Groups */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isDimmed = filterType !== "all" && node.type !== filterType;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`${styles.nodeGroup} ${isDimmed ? styles.nodeDimmed : ""}`}
                  onClick={() => handleNodeClick(node)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${node.name} (${node.type}, ${node.health})`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNodeClick(node);
                    }
                  }}
                >
                  <rect
                    width="140"
                    height="54"
                    rx="6"
                    className={`${styles.nodeRect} ${getHealthClass(node.health)} ${
                      isSelected ? styles.nodeRectSelected : ""
                    }`}
                  />
                  <text x="10" y="20" className={styles.nodeTypeText}>
                    {node.type.toUpperCase()}
                  </text>
                  <text x="10" y="38" className={styles.nodeTitleText}>
                    {node.name.length > 18 ? `${node.name.slice(0, 16)}…` : node.name}
                  </text>
                  <circle
                    cx="126"
                    cy="16"
                    r="5"
                    className={`${styles.healthIndicatorDot} ${
                      node.health === "healthy"
                        ? styles.dotHealthy
                        : node.health === "warning"
                        ? styles.dotWarning
                        : styles.dotError
                    }`}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Drawer */}
        <aside className={styles.inspector} aria-label="Selected node details">
          {selectedNode ? (
            <div className={styles.inspectorBody}>
              <div className={styles.inspHeader}>
                <span className={styles.inspCategory}>{selectedNode.type.toUpperCase()} NODE</span>
                <h4 className={styles.inspTitle}>{selectedNode.name}</h4>
              </div>

              <div className={styles.healthStatusRow}>
                <span className={styles.statusLabel}>Cluster State:</span>
                <span
                  className={`${styles.statusBadge} ${
                    selectedNode.health === "healthy"
                      ? styles.badgeHealthy
                      : selectedNode.health === "warning"
                      ? styles.badgeWarning
                      : styles.badgeError
                  }`}
                >
                  {selectedNode.health.toUpperCase()}
                </span>
              </div>

              <div className={styles.metricGrid}>
                {selectedNode.p99Ms !== undefined && (
                  <div className={styles.metricBlock}>
                    <span className={styles.mLabel}>P99 Latency</span>
                    <span className={styles.mValue}>{selectedNode.p99Ms} ms</span>
                  </div>
                )}
                {selectedNode.rps !== undefined && (
                  <div className={styles.metricBlock}>
                    <span className={styles.mLabel}>Throughput</span>
                    <span className={styles.mValue}>{selectedNode.rps.toLocaleString()} RPS</span>
                  </div>
                )}
                {selectedNode.errorRate !== undefined && (
                  <div className={styles.metricBlock}>
                    <span className={styles.mLabel}>Error Rate</span>
                    <span
                      className={`${styles.mValue} ${
                        selectedNode.errorRate > 1 ? styles.textDanger : ""
                      }`}
                    >
                      {selectedNode.errorRate.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>

              {selectedNode.health === "warning" && (
                <div className={styles.incidentNotice}>
                  ⚠ <strong>Degraded Performance:</strong> Elevated P99 write latency detected on partition 4.
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyInspector}>
              Select a node in the graph to inspect runtime health, latency, and downstream dependencies.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
