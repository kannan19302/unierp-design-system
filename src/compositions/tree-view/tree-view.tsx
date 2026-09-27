"use client";

import { useState, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./tree-view.module.css";

export type TreeViewDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export const treeViewVariants = cva(styles.tree, {
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

export interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof treeViewVariants> {
  nodes: TreeNode[];
  selectedId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  density?: TreeViewDensity;
  className?: string;
}

/**
 * TreeView component renders hierarchical navigation structures with expanding branches.
 * @maturity stable
 */
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      nodes,
      selectedId,
      onNodeSelect,
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggle = (id: string) => {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const renderNode = (node: TreeNode, depth: number = 0) => {
      const isExpanded = !!expanded[node.id];
      const hasChildren = !!node.children && node.children.length > 0;
      const isSelected = selectedId === node.id;

      return (
        <div
          key={node.id}
          className={styles.nodeWrapper}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          data-slot="tree-view-item"
        >
          <div
            className={`${styles.nodeRow} ${isSelected ? styles.selected : ""}`}
            style={{ paddingInlineStart: `calc(var(--space-2) + ${depth * 16}px)` }}
            data-slot="tree-view-row"
            onClick={() => {
              if (hasChildren) toggle(node.id);
              onNodeSelect?.(node);
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                className={styles.toggleBtn}
                data-slot="tree-view-toggle"
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
              <span className={styles.indentSpacer} aria-hidden="true" data-slot="tree-view-indent" />
            )}

            <span className={styles.icon} aria-hidden="true" data-slot="tree-view-icon">
              {node.icon || (hasChildren ? (
                isExpanded ? <FolderOpen size={14} /> : <Folder size={14} />
              ) : (
                <FileText size={14} />
              ))}
            </span>

            <span className={styles.label} data-slot="tree-view-label">{node.label}</span>
            {node.badge && <span className={styles.badge} data-slot="tree-view-badge">{node.badge}</span>}
          </div>
          {hasChildren && isExpanded && (
            <div className={styles.childGroup} role="group" data-slot="tree-view-group">
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={`${treeViewVariants({ density })} ${className}`.trim()}
        role="tree"
        data-slot="tree-view"
        data-density={density}
        {...props}
      >
        {nodes.map((node) => renderNode(node, 0))}
      </div>
    );
  }
);

TreeView.displayName = "TreeView";
