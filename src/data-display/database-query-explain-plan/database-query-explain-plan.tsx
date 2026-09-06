import React, { useId, useState, useMemo } from "react";
import styles from "./database-query-explain-plan.module.css";

export type ExplainNodeType =
  | "Seq Scan"
  | "Index Scan"
  | "Index Only Scan"
  | "Bitmap Heap Scan"
  | "Bitmap Index Scan"
  | "Hash Join"
  | "Nested Loop"
  | "Merge Join"
  | "Hash"
  | "Sort"
  | "Aggregate"
  | "Limit"
  | "CTE Scan"
  | string;

export interface ExplainPlanNode {
  id: string;
  nodeType: ExplainNodeType;
  relationName?: string;
  indexName?: string;
  actualStartupTimeMs: number;
  actualTotalTimeMs: number;
  actualRows: number;
  planRows: number;
  totalCost: number;
  filter?: string;
  indexCond?: string;
  sharedHitBlocks?: number;
  sharedReadBlocks?: number;
  isProblematic?: boolean;
  problemWarning?: string;
  children?: ExplainPlanNode[];
}

export interface DatabaseQueryExplainPlanProps {
  querySql: string;
  planningTimeMs: number;
  executionTimeMs: number;
  totalCost: number;
  rootNode: ExplainPlanNode;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const DatabaseQueryExplainPlan: React.FC<DatabaseQueryExplainPlanProps> = ({
  querySql,
  planningTimeMs,
  executionTimeMs,
  totalCost,
  rootNode,
  selectedNodeId: initialSelectedId,
  onSelectNode,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId ?? rootNode.id
  );

  const findNode = (node: ExplainPlanNode, id: string): ExplainPlanNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = useMemo(() => {
    return findNode(rootNode, selectedId) ?? rootNode;
  }, [rootNode, selectedId]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedId(nodeId);
    onSelectNode?.(nodeId);
  };

  const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(num);

  const getNodeTypeBadgeClass = (nodeType: string) => {
    if (nodeType.includes("Seq Scan")) return styles.nodeSeqScan;
    if (nodeType.includes("Index")) return styles.nodeIndexScan;
    if (nodeType.includes("Join")) return styles.nodeJoin;
    if (nodeType.includes("Sort")) return styles.nodeSort;
    return styles.nodeDefault;
  };

  const renderNodeTree = (node: ExplainPlanNode, depth: number = 0) => {
    const isSelected = node.id === selectedId;
    const percentTime = Math.min(
      100,
      Math.max(1, Math.round((node.actualTotalTimeMs / executionTimeMs) * 100))
    );
    const rowDiscrepancy =
      node.planRows > 0 ? Math.round(node.actualRows / node.planRows) : 1;
    const hasRowWarning = rowDiscrepancy >= 5 || (node.actualRows > 0 && node.planRows === 0);

    return (
      <div key={node.id} className={styles.treeBranch}>
        <div
          className={`${styles.treeNodeRow} ${isSelected ? styles.selectedRow : ""}`}
          style={{ paddingLeft: `calc(${depth} * var(--space-4, 1rem) + var(--space-2, 0.5rem))` }}
        >
          <button
            type="button"
            className={styles.nodeSelectBtn}
            onClick={() => handleNodeClick(node.id)}
            aria-pressed={isSelected}
            aria-label={`Select plan node ${node.nodeType} on ${node.relationName ?? "query"} (${node.actualTotalTimeMs}ms)`}
          >
            <span className={`${styles.nodeBadge} ${getNodeTypeBadgeClass(node.nodeType)}`}>
              {node.nodeType}
            </span>
            <span className={styles.nodeRelation}>
              {node.relationName ? (
                <>on <strong>{node.relationName}</strong></>
              ) : (
                node.indexName ? <>using <em>{node.indexName}</em></> : ""
              )}
            </span>
          </button>

          {/* Time and Cost bar */}
          <div className={styles.nodeTiming}>
            <div className={styles.timingBarTrack}>
              <div
                className={`${styles.timingBarFill} ${
                  percentTime > 50 ? styles.barHot : ""
                }`}
                style={{ width: `${percentTime}%` }}
              />
            </div>
            <span className={styles.timingText}>{node.actualTotalTimeMs} ms ({percentTime}%)</span>
          </div>

          <div className={styles.nodeRows}>
            <span className={styles.rowsCount}>{formatNumber(node.actualRows)} rows</span>
            {hasRowWarning && (
              <span
                className={styles.warningPill}
                title={`Estimate miscalculated: estimated ${node.planRows}, got ${node.actualRows}`}
              >
                ⚠️ Misestimate
              </span>
            )}
            {node.isProblematic && (
              <span className={styles.problemPill} title={node.problemWarning}>
                🚨 Alert
              </span>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className={styles.treeChildren}>
            {node.children.map((child) => renderNodeTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.engineBadge}>PostgreSQL Explain Plan</span>
            <span className={styles.optStatus}>EXPLAIN (ANALYZE, BUFFERS)</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Database Query Execution Plan & Cost Visualizer
          </h2>
          <pre className={styles.sqlPreview}>
            <code>{querySql}</code>
          </pre>
        </div>

        {/* Global Execution Metrics */}
        <div className={styles.metricsSummary}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Execution Time</span>
            <span className={styles.metricValuePrimary}>{executionTimeMs} ms</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Planning Time</span>
            <span className={styles.metricValue}>{planningTimeMs} ms</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Total Cost</span>
            <span className={styles.metricValue}>{totalCost.toFixed(1)}</span>
          </div>
        </div>
      </header>

      {/* Main Layout: Visual Plan Tree + Node Detail Panel */}
      <div className={styles.mainLayout}>
        {/* Tree Container */}
        <div className={styles.treeContainer}>
          <div className={styles.treeHeaderRow}>
            <span className={styles.thNode}>Plan Operation</span>
            <span className={styles.thTime}>Execution Time</span>
            <span className={styles.thRows}>Rows (Actual / Estimated)</span>
          </div>
          <div className={styles.treeBody}>{renderNodeTree(rootNode)}</div>
        </div>

        {/* Node Inspection Drawer */}
        {selectedNode && (
          <aside className={styles.inspector} aria-label="Plan Node Inspector">
            <div className={styles.inspectorHeader}>
              <h3 className={styles.inspectorTitle}>{selectedNode.nodeType} Details</h3>
              <span className={styles.nodeIdTag}>{selectedNode.id}</span>
            </div>

            {selectedNode.isProblematic && selectedNode.problemWarning && (
              <div className={styles.problemBanner}>
                <strong>Performance Bottleneck:</strong>
                <p>{selectedNode.problemWarning}</p>
              </div>
            )}

            <div className={styles.detailGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Relation Table:</span>
                <span className={styles.detailVal}>{selectedNode.relationName ?? "N/A"}</span>
              </div>
              {selectedNode.indexName && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Index Utilized:</span>
                  <span className={styles.detailVal}>{selectedNode.indexName}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Actual Time:</span>
                <span className={styles.detailVal}>
                  {selectedNode.actualStartupTimeMs} ms startup &bull; {selectedNode.actualTotalTimeMs} ms total
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Rows Returned:</span>
                <span className={styles.detailVal}>
                  {formatNumber(selectedNode.actualRows)} actual (planner estimated {formatNumber(selectedNode.planRows)})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Planner Cost:</span>
                <span className={styles.detailVal}>{selectedNode.totalCost}</span>
              </div>
              {selectedNode.sharedHitBlocks !== undefined && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Buffer Shared Hit:</span>
                  <span className={styles.detailVal}>{selectedNode.sharedHitBlocks} blocks</span>
                </div>
              )}
            </div>

            {selectedNode.filter && (
              <div className={styles.codeBlockWrap}>
                <h4 className={styles.codeHeader}>Filter Expression</h4>
                <code className={styles.codeContent}>{selectedNode.filter}</code>
              </div>
            )}

            {selectedNode.indexCond && (
              <div className={styles.codeBlockWrap}>
                <h4 className={styles.codeHeader}>Index Condition</h4>
                <code className={styles.codeContent}>{selectedNode.indexCond}</code>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
};
