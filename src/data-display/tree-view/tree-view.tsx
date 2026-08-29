"use client";

import { useState, type FC, type ReactNode } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";
import styles from "./tree-view.module.css";

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selectedId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  className?: string;
}

export const TreeView: FC<TreeViewProps> = ({
  nodes,
  selectedId,
  onNodeSelect,
  className = "",
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = !!expanded[node.id];
    const hasChildren = !!node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id} className={styles.nodeWrapper} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
        <div
          className={`${styles.nodeRow} ${isSelected ? styles.selected : ""}`}
          style={{ paddingLeft: `calc(var(--space-2) + ${depth * 16}px)` }}
          onClick={() => {
            if (hasChildren) toggle(node.id);
            onNodeSelect?.(node);
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={(e) => {
                e.stopPropagation();
                toggle(node.id);
              }}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronDown size={12} aria-hidden="true" />
              ) : (
                <ChevronRight size={12} aria-hidden="true" />
              )}
            </button>
          ) : (
            <span className={styles.indentSpacer} aria-hidden="true" />
          )}

          <span className={styles.icon} aria-hidden="true">
            {node.icon || (hasChildren ? (
              isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />
            ) : (
              <FileText size={14} />
            ))}
          </span>

          <span className={styles.label}>{node.label}</span>
          {node.badge && <span className={styles.badge}>{node.badge}</span>}
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.childGroup} role="group">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.tree} ${className}`.trim()} role="tree">
      {nodes.map((node) => renderNode(node, 0))}
    </div>
  );
};
