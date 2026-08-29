"use client";

import { useState, type FC } from "react";
import { CheckCircle2, Clock, AlertCircle, PlayCircle, User } from "lucide-react";
import styles from "./workflow-graph.module.css";


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

export interface WorkflowGraphProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  onNodeSelect?: (node: WorkflowNode) => void;
  width?: number | string;
  height?: number;
  className?: string;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

export const WorkflowGraph: FC<WorkflowGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
  width = "100%",
  height = 420,
  className = "",
}) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedNodeId);

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
    <div className={`${styles.container} ${className}`}>
      <div className={styles.toolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 600 }}>
          <span>Workflow Execution Graph</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            ({nodes.length} stages, {edges.length} transitions)
          </span>
        </div>
      </div>

      <div className={styles.canvas} style={{ width, height }}>
        {/* SVG Bezier Connection Lines */}
        <svg className={styles.svgLayer} width="100%" height="100%">
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

            const startX = source.x + NODE_WIDTH;
            const startY = source.y + NODE_HEIGHT / 2;
            const endX = target.x;
            const endY = target.y + NODE_HEIGHT / 2;

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
              style={{ left: node.x, top: node.y }}
              onClick={() => handleSelect(node)}
              role="button"
              tabIndex={0}
              aria-label={`Workflow stage ${node.title}, status ${node.status}`}
            >
              <div className={styles.nodeHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                  {getStatusIcon(node.status)}
                  <span style={{ textTransform: "capitalize" }}>{node.status}</span>
                </div>
                {node.duration && <span>{node.duration}</span>}
              </div>

              <div className={styles.nodeBody}>
                <h5 className={styles.nodeTitle}>{node.title}</h5>
                {node.subtitle && <span className={styles.nodeSubtitle}>{node.subtitle}</span>}
                {node.assignee && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-1)",
                      color: "var(--color-text-secondary)",
                      marginTop: "var(--space-1)",
                    }}
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
};
