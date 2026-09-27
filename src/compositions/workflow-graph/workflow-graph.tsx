"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { CheckCircle2, Clock, AlertCircle, PlayCircle, User } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./workflow-graph.module.css";

export type WorkflowGraphDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const workflowGraphVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type WorkflowNodeStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export interface WorkflowNode {
  id: string;
  title: string;
  subtitle?: string;
  status: WorkflowNodeStatus;
  assignee?: string;
  duration?: string;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface WorkflowGraphProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof workflowGraphVariants> {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  onNodeSelect?: (node: WorkflowNode) => void;
  width?: number | string;
  height?: number;
  density?: WorkflowGraphDensity;
  className?: string;
}

const getNodeDimensions = (density: WorkflowGraphDensity) => {
  switch (density) {
    case "ultra-compact":
      return { width: 170, height: 80 };
    case "compact":
      return { width: 195, height: 90 };
    case "comfortable":
      return { width: 260, height: 110 };
    case "standard":
    default:
      return { width: 220, height: 100 };
  }
};

/**
 * WorkflowGraph renders directed acyclic graphs representing business process workflows and state transitions.
 *
 * @maturity stable
 */
export const WorkflowGraph = forwardRef<HTMLDivElement, WorkflowGraphProps>(
  (
    {
      nodes,
      edges,
      selectedNodeId,
      onNodeSelect,
      width = "100%",
      height = 420,
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(selectedNodeId);
    const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(density);

    const handleSelect = (node: WorkflowNode) => {
      setSelectedId(node.id);
      onNodeSelect?.(node);
    };

    const getStatusIcon = (status: WorkflowNodeStatus) => {
      switch (status) {
        case "completed":
          return <CheckCircle2 size={14} style={{ color: "var(--color-success, #10b981)" }} />;
        case "running":
          return <PlayCircle size={14} style={{ color: "var(--color-brand, #3b82f6)" }} />;
        case "failed":
          return <AlertCircle size={14} style={{ color: "var(--color-danger, #ef4444)" }} />;
        case "pending":
        default:
          return <Clock size={14} style={{ color: "var(--color-warning, #f59e0b)" }} />;
      }
    };

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    return (
      <div
        ref={ref}
        className={`${workflowGraphVariants({ density })} ${className}`.trim()}
        data-slot="workflow-graph"
        data-density={density}
        {...props}
      >
        <div className={styles.toolbar} data-slot="workflow-graph-toolbar">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 600 }}>
            <span>Workflow Execution Graph</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              ({nodes.length} stages, {edges.length} transitions)
            </span>
          </div>
        </div>

        <div className={styles.canvas} style={{ inlineSize: width, minBlockSize: height }} data-slot="workflow-graph-canvas">
          {/* SVG Bezier Connection Lines */}
          <svg className={styles.svgLayer} width="100%" height="100%" data-slot="workflow-graph-svg-layer">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border-subtle, #94a3b8)" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const source = nodeMap.get(edge.from);
              const target = nodeMap.get(edge.to);
              if (!source || !target) return null;

              const startX = source.x + nodeWidth;
              const startY = source.y + nodeHeight / 2;
              const endX = target.x;
              const endY = target.y + nodeHeight / 2;

              const deltaX = Math.abs(endX - startX) / 2;
              const pathData = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

              return (
                <g key={edge.id}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke="var(--color-border-subtle, #cbd5e1)"
                    strokeWidth="2"
                    strokeDasharray={edge.animated ? "4 4" : undefined}
                    markerEnd="url(#arrowhead)"
                  />
                  {edge.label && (
                    <text
                      x={(startX + endX) / 2}
                      y={(startY + endY) / 2 - 8}
                      fill="var(--color-text-secondary)"
                      fontSize="11"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedId === node.id;
            const statusClass =
              node.status === "completed"
                ? styles.statusCompleted
                : node.status === "running"
                ? styles.statusRunning
                : node.status === "failed"
                ? styles.statusFailed
                : styles.statusPending;

            return (
              <div
                key={node.id}
                className={`${styles.node} ${statusClass} ${isSelected ? styles.nodeSelected : ""}`}
                style={{ insetInlineStart: node.x, insetBlockStart: node.y }}
                onClick={() => handleSelect(node)}
                role="button"
                tabIndex={0}
                aria-label={`Workflow stage ${node.title}, status ${node.status}`}
                data-slot="workflow-graph-node"
              >
                <div className={styles.nodeHeader} data-slot="workflow-graph-node-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                    {getStatusIcon(node.status)}
                    <span style={{ textTransform: "capitalize" }}>{node.status}</span>
                  </div>
                  {node.duration && <span>{node.duration}</span>}
                </div>

                <div className={styles.nodeBody} data-slot="workflow-graph-node-body">
                  <h5 className={styles.nodeTitle} data-slot="workflow-graph-node-title">{node.title}</h5>
                  {node.subtitle && <span className={styles.nodeSubtitle} data-slot="workflow-graph-node-subtitle">{node.subtitle}</span>}
                  {node.assignee && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        color: "var(--color-text-secondary)",
                        marginBlockStart: "var(--space-1)",
                      }}
                      data-slot="workflow-graph-node-assignee"
                    >
                      <User size={12} />
                      <span>{node.assignee}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

WorkflowGraph.displayName = "WorkflowGraph";
