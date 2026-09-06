import React, { useState, useId } from "react";
import styles from "./query-execution-plan-viewer.module.css";

export type PlanOperationType =
  | "seq_scan"
  | "index_scan"
  | "index_only_scan"
  | "nested_loop"
  | "hash_join"
  | "sort"
  | "aggregate";

export interface PlanNode {
  id: string;
  operation: PlanOperationType;
  relationName?: string;
  indexName?: string;
  costPercent: number; // e.g. 65 for 65% of total query
  totalCost: number;
  actualRows: number;
  estimatedRows: number;
  durationMs: number;
  filterPredicate?: string;
  children?: PlanNode[];
}

export interface QueryExecutionPlanViewerProps {
  /** Query title or SQL preview */
  queryTitle?: string;
  /** Overall execution duration */
  totalDurationMs?: number;
  /** Total query cost units */
  totalCostUnits?: number;
  /** Root execution plan node */
  rootNode: PlanNode;
  /** Callback fired when a node is selected */
  onSelectNode?: (node: PlanNode) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const QueryExecutionPlanViewer: React.FC<QueryExecutionPlanViewerProps> = ({
  queryTitle = "SELECT o.id, c.name, SUM(i.amount) FROM orders o JOIN customers c ON ...",
  totalDurationMs = 142.8,
  totalCostUnits = 12450,
  rootNode,
  onSelectNode,
  density = "compact",
  className = "",
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(rootNode.id);
  const headingId = useId();

  // Flatten nodes for quick selection search
  const findNode = (node: PlanNode, id: string): PlanNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNode(rootNode, selectedNodeId) || rootNode;

  const handleNodeClick = (node: PlanNode) => {
    setSelectedNodeId(node.id);
    onSelectNode?.(node);
  };

  const getOpBadgeClass = (op: PlanOperationType) => {
    switch (op) {
      case "seq_scan":
        return styles.opSeqScan;
      case "index_scan":
      case "index_only_scan":
        return styles.opIndexScan;
      case "hash_join":
      case "nested_loop":
        return styles.opJoin;
      case "sort":
      case "aggregate":
        return styles.opAgg;
    }
  };

  // Render tree branch recursively
  const renderTree = (node: PlanNode, depth = 0) => {
    const isSelected = node.id === selectedNodeId;
    const isHighCost = node.costPercent >= 40;
    const rowsDisparityRatio =
      node.estimatedRows > 0 ? node.actualRows / node.estimatedRows : 1;
    const hasStaleStats = rowsDisparityRatio > 5 || rowsDisparityRatio < 0.2;

    return (
      <div key={node.id} className={styles.treeBranch}>
        <div
          className={`${styles.planNodeCard} ${isSelected ? styles.nodeCardSelected : ""}`}
          onClick={() => handleNodeClick(node)}
          role="button"
          tabIndex={0}
          aria-pressed={isSelected}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNodeClick(node);
            }
          }}
        >
          <div className={styles.nodeHeaderRow}>
            <span className={`${styles.opPill} ${getOpBadgeClass(node.operation)}`}>
              {node.operation.replace("_", " ").toUpperCase()}
            </span>
            <span
              className={`${styles.costBadge} ${
                isHighCost ? styles.costBadgeHigh : styles.costBadgeNormal
              }`}
            >
              {node.costPercent}% Cost
            </span>
          </div>

          <div className={styles.nodeBody}>
            {node.relationName && (
              <span className={styles.relationText}>on {node.relationName}</span>
            )}
            {node.indexName && (
              <span className={styles.indexText}>using {node.indexName}</span>
            )}
            <div className={styles.metricStrip}>
              <span>{node.durationMs.toFixed(1)} ms</span>
              <span>{node.actualRows.toLocaleString()} rows</span>
            </div>
            {hasStaleStats && (
              <span className={styles.statsAlert}>
                ⚠️ Est: {node.estimatedRows} vs Act: {node.actualRows}
              </span>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className={styles.childrenWrapper}>
            {node.children.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ⚡
          </div>
          <div>
            <div className={styles.queryPreview}>
              <code>{queryTitle}</code>
            </div>
            <h2 id={headingId} className={styles.title}>PostgreSQL Execution Plan Explorer</h2>
          </div>
        </div>

        {/* Global Query Telemetry */}
        <div className={styles.telemetryBox}>
          <span className={styles.durationPill}>
            ⏱️ {totalDurationMs.toFixed(1)} ms Duration
          </span>
          <span className={styles.costTotalText}>
            Total Cost: {totalCostUnits.toLocaleString()} units
          </span>
        </div>
      </header>

      {/* Main Flow: Tree Canvas + Detail Inspector */}
      <div className={styles.mainFlow}>
        <div className={styles.treeCanvas} role="region" aria-label="Query Plan Tree">
          {renderTree(rootNode)}
        </div>

        {/* Detail Inspection Drawer */}
        <aside className={styles.inspectorCard} aria-label="Selected Operator Details">
          <div className={styles.inspectorHeader}>
            <span className={`${styles.opPill} ${getOpBadgeClass(selectedNode.operation)}`}>
              {selectedNode.operation.replace("_", " ").toUpperCase()}
            </span>
            <span className={styles.inspectorCost}>
              {selectedNode.costPercent}% of total cost
            </span>
          </div>

          <div className={styles.inspectorGrid}>
            <div className={styles.inspectItem}>
              <span className={styles.inspectLabel}>Execution Duration:</span>
              <span className={styles.inspectVal}>{selectedNode.durationMs} ms</span>
            </div>
            <div className={styles.inspectItem}>
              <span className={styles.inspectLabel}>Planner Total Cost:</span>
              <span className={styles.inspectVal}>{selectedNode.totalCost.toLocaleString()} units</span>
            </div>
            <div className={styles.inspectItem}>
              <span className={styles.inspectLabel}>Actual Rows Scanned:</span>
              <span className={styles.inspectVal}>{selectedNode.actualRows.toLocaleString()}</span>
            </div>
            <div className={styles.inspectItem}>
              <span className={styles.inspectLabel}>Estimated Rows:</span>
              <span className={styles.inspectVal}>{selectedNode.estimatedRows.toLocaleString()}</span>
            </div>
          </div>

          {selectedNode.filterPredicate && (
            <div className={styles.predicateBox}>
              <span className={styles.inspectLabel}>Filter Predicate:</span>
              <code className={styles.predicateCode}>{selectedNode.filterPredicate}</code>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
