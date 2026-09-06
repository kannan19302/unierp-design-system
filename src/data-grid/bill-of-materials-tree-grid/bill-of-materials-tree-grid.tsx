import React, { useId, useState, useMemo } from "react";
import styles from "./bill-of-materials-tree-grid.module.css";

export type BomItemType = "assembly" | "subassembly" | "part" | "raw_material";
export type SourcingType = "make" | "buy" | "phantom";

export interface BomNode {
  id: string;
  partNumber: string; // "ASM-9020-01"
  description: string; // "Brushless Motor Drive Assembly"
  type: BomItemType;
  sourcing: SourcingType;
  revision: string; // "Rev C"
  quantityPerAssembly: number; // e.g. 2
  unitOfMeasure: string; // "EA", "KG", "M"
  scrapPercentage: number; // e.g. 1.5%
  unitCost: number; // e.g. 48.50
  extendedCost?: number;
  hasActiveEco?: boolean; // Engineering Change Order
  ecoNumber?: string; // "ECO-2026-081"
  children?: BomNode[];
}

export interface BillOfMaterialsTreeGridProps {
  assemblyPartNumber: string; // "PRD-ROBOT-ARM-700"
  assemblyTitle: string; // "6-Axis Industrial Articulated Robotic Arm"
  revision: string; // "Rev D.2"
  rootBomNode: BomNode;
  onSelectNode?: (nodeId: string) => void;
  onToggleEcoDetails?: (ecoNumber: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const BillOfMaterialsTreeGrid: React.FC<BillOfMaterialsTreeGridProps> = ({
  assemblyPartNumber,
  assemblyTitle,
  revision,
  rootBomNode,
  onSelectNode,
  onToggleEcoDetails,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set([rootBomNode.id])
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>(rootBomNode.id);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collect = (node: BomNode) => {
      allIds.add(node.id);
      node.children?.forEach(collect);
    };
    collect(rootBomNode);
    setExpandedNodeIds(allIds);
  };

  const collapseAll = () => {
    setExpandedNodeIds(new Set([rootBomNode.id]));
  };

  const findNode = (node: BomNode, id: string): BomNode | null => {
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
    return findNode(rootBomNode, selectedNodeId) ?? rootBomNode;
  }, [rootBomNode, selectedNodeId]);

  // Aggregate stats
  const stats = useMemo(() => {
    let partCount = 0;
    let totalRollupCost = 0;
    let activeEcos = 0;

    const traverse = (node: BomNode, parentMultiplier: number = 1) => {
      partCount++;
      const effectiveQty = node.quantityPerAssembly * parentMultiplier;
      const nodeCost = node.unitCost * effectiveQty * (1 + node.scrapPercentage / 100);
      totalRollupCost += nodeCost;
      if (node.hasActiveEco) activeEcos++;
      node.children?.forEach((c) => traverse(c, effectiveQty));
    };

    traverse(rootBomNode, 1);
    return { partCount, totalRollupCost, activeEcos };
  }, [rootBomNode]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(val);

  const getTypeBadgeClass = (type: BomItemType) => {
    switch (type) {
      case "assembly":
        return styles.typeAssembly;
      case "subassembly":
        return styles.typeSubassembly;
      case "raw_material":
        return styles.typeRaw;
      default:
        return styles.typePart;
    }
  };

  const renderTreeRows = (node: BomNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedNodeIds.has(node.id);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isSelected = selectedNodeId === node.id;
    const matchesSearch =
      !searchTerm.trim() ||
      node.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase());

    const extendedCost = node.unitCost * node.quantityPerAssembly * (1 + node.scrapPercentage / 100);

    return (
      <React.Fragment key={node.id}>
        {matchesSearch && (
          <tr
            className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
            onClick={() => {
              setSelectedNodeId(node.id);
              onSelectNode?.(node.id);
            }}
          >
            {/* Part Number & Hierarchy indent */}
            <td className={styles.tdPart}>
              <div
                className={styles.indentWrap}
                style={{ paddingLeft: `calc(${depth} * var(--space-4, 1rem))` }}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    className={styles.expandBtn}
                    onClick={(e) => toggleExpand(node.id, e)}
                    aria-label={isExpanded ? `Collapse ${node.partNumber}` : `Expand ${node.partNumber}`}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                ) : (
                  <span className={styles.indentLeafSpacer} aria-hidden="true" />
                )}
                <span className={styles.partNumberText}>{node.partNumber}</span>
                <span className={styles.revBadge}>{node.revision}</span>
                {node.hasActiveEco && (
                  <button
                    type="button"
                    className={styles.ecoPill}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (node.ecoNumber) onToggleEcoDetails?.(node.ecoNumber);
                    }}
                    title={`Active Engineering Change Order: ${node.ecoNumber ?? "Pending"}`}
                    aria-label={`View change order ${node.ecoNumber ?? "ECO"}`}
                  >
                    ⚠️ {node.ecoNumber ?? "ECO"}
                  </button>
                )}
              </div>
            </td>

            {/* Description */}
            <td className={styles.tdDesc}>
              <div className={styles.descBlock}>
                <span className={styles.descTitle}>{node.description}</span>
                <span className={`${styles.typeBadge} ${getTypeBadgeClass(node.type)}`}>
                  {node.type.toUpperCase()}
                </span>
              </div>
            </td>

            {/* Sourcing */}
            <td className={styles.tdSourcing}>
              <span className={node.sourcing === "make" ? styles.sourcingMake : styles.sourcingBuy}>
                {node.sourcing.toUpperCase()}
              </span>
            </td>

            {/* Qty & UOM */}
            <td className={styles.tdQty}>
              <strong>{node.quantityPerAssembly}</strong> {node.unitOfMeasure}
            </td>

            {/* Scrap % */}
            <td className={styles.tdScrap}>
              {node.scrapPercentage > 0 ? `${node.scrapPercentage}%` : "0%"}
            </td>

            {/* Unit Cost */}
            <td className={styles.tdCost}>
              {formatCurrency(node.unitCost)}
            </td>

            {/* Ext Cost */}
            <td className={styles.tdExtCost}>
              <strong>{formatCurrency(extendedCost)}</strong>
            </td>
          </tr>
        )}

        {/* Recursive Children rendering if expanded */}
        {hasChildren && isExpanded && node.children?.map((child) => renderTreeRows(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header Banner */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badgeRow}>
            <span className={styles.plmBadge}>Engineering PLM</span>
            <span className={styles.revTag}>{revision}</span>
            <span className={styles.asmCode}>{assemblyPartNumber}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Bill of Materials: {assemblyTitle}
          </h2>
        </div>

        {/* Manufacturing Rollup Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Components</span>
            <span className={styles.statValue}>{stats.partCount} parts</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>BOM Rollup Cost</span>
            <span className={styles.statValuePrimary}>{formatCurrency(stats.totalRollupCost)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active ECOs</span>
            <span className={stats.activeEcos > 0 ? styles.statValueAlert : styles.statValue}>
              {stats.activeEcos}
            </span>
          </div>
        </div>
      </header>

      {/* Toolbar: Search and Expand/Collapse */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <label htmlFor="bom-search-input" className={styles.srOnly}>
            Filter BOM by part number or description
          </label>
          <input
            id="bom-search-input"
            type="text"
            className={styles.searchInput}
            placeholder="Search part # or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.toolbarRight}>
          <button type="button" className={styles.actionBtn} onClick={expandAll}>
            Expand All
          </button>
          <button type="button" className={styles.actionBtn} onClick={collapseAll}>
            Collapse All
          </button>
        </div>
      </div>

      {/* Main Layout: Tree Grid Table + Selected Node Inspector */}
      <div className={styles.mainLayout}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              Bill of Materials tree for {assemblyTitle} ({assemblyPartNumber})
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.thPart}>Part Number / Rev</th>
                <th scope="col" className={styles.thDesc}>Description / Type</th>
                <th scope="col" className={styles.thSourcing}>Source</th>
                <th scope="col" className={styles.thQty}>Qty / UOM</th>
                <th scope="col" className={styles.thScrap}>Scrap %</th>
                <th scope="col" className={styles.thCost}>Unit Cost</th>
                <th scope="col" className={styles.thExtCost}>Extended Cost</th>
              </tr>
            </thead>
            <tbody>
              {renderTreeRows(rootBomNode)}
            </tbody>
          </table>
        </div>

        {/* Selected Part Detail Inspector */}
        {selectedNode && (
          <aside className={styles.inspector} aria-label="Component Inspector">
            <div className={styles.inspectorHeader}>
              <div>
                <span className={`${styles.typeBadge} ${getTypeBadgeClass(selectedNode.type)}`}>
                  {selectedNode.type.toUpperCase()}
                </span>
                <h3 className={styles.inspectorTitle}>{selectedNode.description}</h3>
                <span className={styles.inspectorPart}>{selectedNode.partNumber} ({selectedNode.revision})</span>
              </div>
            </div>

            {selectedNode.hasActiveEco && (
              <div className={styles.ecoNotice}>
                <strong className={styles.ecoNoticeTitle}>⚠️ Pending Engineering Change Order</strong>
                <p className={styles.ecoNoticeText}>
                  This component is flagged under <strong>{selectedNode.ecoNumber ?? "ECO-PENDING"}</strong>. Sourcing hold in effect until CAD drawing revision release.
                </p>
              </div>
            )}

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Sourcing Strategy:</span>
                <span className={styles.detailVal}>{selectedNode.sourcing.toUpperCase()}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Unit of Measure:</span>
                <span className={styles.detailVal}>{selectedNode.unitOfMeasure}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Scrap Allowance:</span>
                <span className={styles.detailVal}>{selectedNode.scrapPercentage}%</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Direct Unit Cost:</span>
                <span className={styles.detailVal}>{formatCurrency(selectedNode.unitCost)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Qty per Assembly:</span>
                <span className={styles.detailVal}>{selectedNode.quantityPerAssembly}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
