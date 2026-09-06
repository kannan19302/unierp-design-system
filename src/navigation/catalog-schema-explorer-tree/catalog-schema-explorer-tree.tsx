import React, { useId, useState } from "react";
import styles from "./catalog-schema-explorer-tree.module.css";

export type CatalogNodeType = "DATABASE" | "SCHEMA" | "TABLE" | "VIEW" | "FUNCTION" | "COLUMN";

export interface CatalogTreeNode {
  id: string;
  name: string;
  type: CatalogNodeType;
  childCount?: number;
  children?: CatalogTreeNode[];
  isExpanded?: boolean;
}

export const defaultCatalogNodes: CatalogTreeNode[] = [
  {
    id: "db_unierp",
    name: "unierp_enterprise_prod",
    type: "DATABASE",
    childCount: 3,
    isExpanded: true,
    children: [
      {
        id: "schema_finance",
        name: "finance",
        type: "SCHEMA",
        childCount: 4,
        isExpanded: true,
        children: [
          { id: "tbl_gl_entries", name: "gl_journal_entries", type: "TABLE", childCount: 18 },
          { id: "tbl_subledgers", name: "subledger_distributions", type: "TABLE", childCount: 12 },
          { id: "view_pl_summary", name: "v_profit_loss_ytd", type: "VIEW", childCount: 8 },
          { id: "fn_reconcile_tax", name: "fn_calculate_nexus_tax()", type: "FUNCTION" },
        ],
      },
      {
        id: "schema_inventory",
        name: "inventory",
        type: "SCHEMA",
        childCount: 3,
        isExpanded: false,
        children: [
          { id: "tbl_storage_bins", name: "warehouse_storage_bins", type: "TABLE", childCount: 14 },
          { id: "tbl_lot_trace", name: "lot_genealogy_records", type: "TABLE", childCount: 22 },
        ],
      },
      {
        id: "schema_analytics",
        name: "analytics_warehouse",
        type: "SCHEMA",
        childCount: 2,
        isExpanded: false,
        children: [
          { id: "view_kpi_arr", name: "v_monthly_recurring_revenue", type: "VIEW", childCount: 6 },
        ],
      },
    ],
  },
];

export interface CatalogSchemaExplorerTreeProps {
  catalogName?: string;
  nodes?: CatalogTreeNode[];
  initialSelectedId?: string;
  onSelectNode?: (node: CatalogTreeNode) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const CatalogSchemaExplorerTree: React.FC<CatalogSchemaExplorerTreeProps> = ({
  catalogName = "Unity Catalog (Snowflake/PostgreSQL)",
  nodes: propNodes = defaultCatalogNodes,
  initialSelectedId = "tbl_gl_entries",
  onSelectNode,
  density = "compact",
  className = "",
}) => {
  const treeHeadingId = useId();
  const searchInputId = useId();
  const [nodes, setNodes] = useState<CatalogTreeNode[]>(propNodes);
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleExpand = (nodeId: string) => {
    const updateRecursive = (list: CatalogTreeNode[]): CatalogTreeNode[] => {
      return list.map((node) => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(updateRecursive(nodes));
  };

  const handleNodeSelect = (node: CatalogTreeNode) => {
    setSelectedId(node.id);
    onSelectNode?.(node);
  };

  const getNodeIcon = (type: CatalogNodeType) => {
    switch (type) {
      case "DATABASE":
        return "🗄️";
      case "SCHEMA":
        return "📁";
      case "TABLE":
        return "▦";
      case "VIEW":
        return "👁️";
      case "FUNCTION":
        return "ƒ";
      case "COLUMN":
        return "⊞";
    }
  };

  const filterTree = (list: CatalogTreeNode[]): CatalogTreeNode[] => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();

    return list
      .map((node) => {
        const matchesSelf = node.name.toLowerCase().includes(q);
        const filteredChildren = node.children ? filterTree(node.children) : [];
        if (matchesSelf || filteredChildren.length > 0) {
          return { ...node, isExpanded: true, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as CatalogTreeNode[];
  };

  const visibleNodes = filterTree(nodes);

  const renderNodes = (nodeList: CatalogTreeNode[], level = 0): React.ReactNode => {
    return (
      <ul
        className={level === 0 ? styles.treeList : styles.treeSubList}
        role={level === 0 ? "tree" : "group"}
        aria-label={level === 0 ? "Database Object Hierarchy" : undefined}
      >
        {nodeList.map((node) => {
          const isSelected = node.id === selectedId;
          const hasChildren = node.children && node.children.length > 0;

          return (
            <li
              key={node.id}
              role="treeitem"
              aria-expanded={hasChildren ? Boolean(node.isExpanded) : undefined}
              aria-selected={isSelected}
            >
              <button
                type="button"
                className={`${styles.nodeItem} ${isSelected ? styles.nodeItemActive : ""}`}
                onClick={() => {
                  if (hasChildren) toggleExpand(node.id);
                  handleNodeSelect(node);
                }}
              >
                <div className={styles.nodeLeft}>
                  {hasChildren ? (
                    <span className={styles.toggleIcon} aria-hidden="true">
                      {node.isExpanded ? "▾" : "▸"}
                    </span>
                  ) : (
                    <span className={styles.toggleIcon} style={{ visibility: "hidden" }} aria-hidden="true">
                      •
                    </span>
                  )}
                  <span className={styles.typeIcon} aria-hidden="true">
                    {getNodeIcon(node.type)}
                  </span>
                  <span className={styles.nodeLabel}>{node.name}</span>
                </div>

                {node.childCount !== undefined && (
                  <span className={styles.nodeCount}>{node.childCount}</span>
                )}
              </button>

              {hasChildren && node.isExpanded && renderNodes(node.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <nav
      aria-labelledby={treeHeadingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h2 id={treeHeadingId} className={styles.title}>
            <span>Schema Explorer</span>
            <span className={styles.catalogBadge}>v2.0</span>
          </h2>
        </div>

        <div>
          <label htmlFor={searchInputId} className={styles.srOnly}>
            Search schemas, tables, and views
          </label>
          <input
            id={searchInputId}
            type="search"
            className={styles.searchInput}
            placeholder="Search schema, table, view..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.treeArea}>
        {renderNodes(visibleNodes)}
        {visibleNodes.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--color-text-secondary, #64748b)", fontSize: "0.75rem", padding: "1rem" }}>
            No database objects match &quot;{searchQuery}&quot;
          </p>
        )}
      </div>

      <footer className={styles.footer}>
        <span>{catalogName}</span>
        <span>PostgreSQL 16 / ANSI SQL</span>
      </footer>
    </nav>
  );
};
