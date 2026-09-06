import React, { useId, useState } from "react";
import styles from "./org-chart-hierarchy-tree.module.css";

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarInitials: string;
  email: string;
  directReportsCount: number;
  openHeadcountCount?: number;
  children?: OrgNode[];
}

export interface OrgChartHierarchyTreeProps {
  rootNode: OrgNode;
  organizationName?: string;
  onSelectEmployee?: (employee: OrgNode) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const OrgChartHierarchyTree: React.FC<OrgChartHierarchyTreeProps> = ({
  rootNode,
  organizationName = "UniERP Global Aerospace Engineering",
  onSelectEmployee,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set([rootNode.id])
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>(rootNode.id);

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedNodeIds);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    setExpandedNodeIds(next);
  };

  const handleNodeClick = (node: OrgNode) => {
    setSelectedNodeId(node.id);
    onSelectEmployee?.(node);
  };

  const renderNode = (node: OrgNode, level = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const isHighSpan = node.directReportsCount > 7;

    return (
      <li
        key={node.id}
        className={styles.treeItem}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        <div
          className={`${styles.nodeCard} ${isSelected ? styles.nodeSelected : ""}`}
          onClick={() => handleNodeClick(node)}
        >
          {/* Avatar and Info */}
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>{node.avatarInitials}</div>
            <div className={styles.nodeText}>
              <h3 className={styles.empName}>{node.name}</h3>
              <p className={styles.empTitle}>{node.title}</p>
              <span className={styles.empDept}>{node.department}</span>
            </div>
          </div>


          {/* Badges / Metrics */}
          <div className={styles.cardFooter}>
            <span
              className={`${styles.reportsPill} ${isHighSpan ? styles.highSpanPill : ""}`}
              title={isHighSpan ? "Span of control warning: > 7 direct reports" : undefined}
            >
              👥 {node.directReportsCount} reports
            </span>
            {node.openHeadcountCount && node.openHeadcountCount > 0 ? (
              <span className={styles.openHcPill}>
                +{node.openHeadcountCount} open reqs
              </span>
            ) : null}
          </div>

          {/* Expand/Collapse Toggle Button */}
          {hasChildren && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={(e) => toggleExpand(node.id, e)}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} direct reports of ${node.name}`}
            >
              {isExpanded ? "−" : `+${node.children!.length}`}
            </button>
          )}
        </div>

        {/* Child Subtree */}
        {hasChildren && isExpanded && (
          <ul className={styles.childList} role="group">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </ul>
        )}
      </li>
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
            🏛️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.orgTag}>Organizational Structure</span>
              <span className={styles.spanNorm}>Target Span: 4–7 Direct Reports</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {organizationName}
            </h2>
          </div>
        </div>
      </header>

      {/* Org Hierarchy Tree View */}
      <div className={styles.treeWrapper}>
        <ul className={styles.rootList} role="tree" aria-label="Organizational Hierarchy">
          {renderNode(rootNode)}
        </ul>
      </div>
    </section>
  );
};
