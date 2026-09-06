import React, { useId, useState } from "react";
import styles from "./gitops-deployment-sync-tree.module.css";

export type GitOpsSyncStatus = "Synced" | "OutOfSync" | "Unknown";
export type GitOpsHealthStatus = "Healthy" | "Progressing" | "Degraded" | "Suspended" | "Missing";
export type K8sResourceKind = "Application" | "Namespace" | "Deployment" | "Service" | "Ingress" | "ConfigMap" | "Pod";

export interface GitOpsResourceNode {
  id: string;
  name: string; // e.g. "unierp-api-service"
  kind: K8sResourceKind;
  namespace?: string; // "production"
  syncStatus: GitOpsSyncStatus;
  healthStatus: GitOpsHealthStatus;
  diffSummary?: string; // "spec.replicas: Git 6 != Live 4"
  children?: GitOpsResourceNode[];
}

export interface GitOpsDeploymentSyncTreeProps {
  appName: string; // "unierp-core-production"
  gitRepo: string; // "github.com/unierp/platform-infra"
  gitRevision: string; // "main (8f2a91b)"
  targetCluster: string; // "aws-eks-us-east-1-prod"
  rootNodes: GitOpsResourceNode[];
  onSyncAll?: () => void;
  onSyncNode?: (node: GitOpsResourceNode) => void;
  onViewDiff?: (node: GitOpsResourceNode) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const GitOpsDeploymentSyncTree: React.FC<GitOpsDeploymentSyncTreeProps> = ({
  appName,
  gitRepo,
  gitRevision,
  targetCluster,
  rootNodes,
  onSyncAll,
  onSyncNode,
  onViewDiff,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    const expandAll = (nodes: GitOpsResourceNode[]) => {
      nodes.forEach((n) => {
        init[n.id] = true;
        if (n.children) expandAll(n.children);
      });
    };
    expandAll(rootNodes);
    return init;
  });

  const [selectedNode, setSelectedNode] = useState<GitOpsResourceNode | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSyncBadge = (status: GitOpsSyncStatus) => {
    switch (status) {
      case "Synced":
        return <span className={`${styles.syncBadge} ${styles.synced}`}>Synced</span>;
      case "OutOfSync":
        return <span className={`${styles.syncBadge} ${styles.outOfSync}`}>Out of Sync</span>;
      default:
        return <span className={`${styles.syncBadge} ${styles.unknownSync}`}>Unknown</span>;
    }
  };

  const getHealthBadge = (status: GitOpsHealthStatus) => {
    switch (status) {
      case "Healthy":
        return <span className={`${styles.healthBadge} ${styles.healthHealthy}`}>Healthy</span>;
      case "Progressing":
        return <span className={`${styles.healthBadge} ${styles.healthProgressing}`}>Progressing</span>;
      case "Degraded":
        return <span className={`${styles.healthBadge} ${styles.healthDegraded}`}>Degraded</span>;
      default:
        return <span className={`${styles.healthBadge} ${styles.healthSuspended}`}>{status}</span>;
    }
  };

  const renderNode = (node: GitOpsResourceNode, level = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedNodes[node.id] !== false;

    return (
      <div key={node.id} className={styles.treeNodeWrapper}>
        <div
          className={`${styles.nodeRow} ${selectedNode?.id === node.id ? styles.nodeRowSelected : ""}`}
          style={{ paddingLeft: `calc(var(--pad-indent, 1rem) * ${level} + var(--space-2, 0.5rem))` }}
          onClick={() => setSelectedNode(node)}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          {hasChildren ? (
            <button
              type="button"
              className={styles.expandToggleBtn}
              onClick={(e) => toggleExpand(node.id, e)}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.name}`}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          ) : (
            <span className={styles.leafSpacer} />
          )}

          <span className={styles.kindTag}>{node.kind}</span>
          <strong className={styles.nodeName}>{node.name}</strong>

          {node.namespace && <span className={styles.nsTag}>ns:{node.namespace}</span>}

          <div className={styles.statusPills}>
            {getSyncBadge(node.syncStatus)}
            {getHealthBadge(node.healthStatus)}
          </div>

          <div className={styles.nodeActions}>
            {node.diffSummary && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDiff?.(node);
                }}
                aria-label={`View GitOps diff for ${node.name}`}
              >
                Diff
              </button>
            )}
            <button
              type="button"
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onSyncNode?.(node);
              }}
              aria-label={`Sync ${node.name} to live cluster`}
            >
              Sync
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.childrenWrapper} role="group">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaCol}>
          <div className={styles.subMeta}>
            <span className={styles.clusterBadge}>{targetCluster}</span>
            <span className={styles.repoRevision}>
              {gitRepo} @ {gitRevision}
            </span>
          </div>
          <h2 id={headingId} className={styles.appName}>
            {appName}
          </h2>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.syncAllButton}
            onClick={onSyncAll}
            aria-label="Synchronize entire application to desired Git state"
          >
            Synchronize App
          </button>
        </div>
      </header>

      <div className={styles.treeBody} role="tree" aria-label="GitOps Deployment Resource Hierarchy">
        {rootNodes.map((node) => renderNode(node, 0))}
      </div>

      {selectedNode?.diffSummary && (
        <aside className={styles.diffPanel} aria-label="Live State Diff Inspector">
          <div className={styles.diffHeader}>
            <strong className={styles.diffTitle}>Live State Drift: {selectedNode.name}</strong>
            <span className={styles.diffKind}>{selectedNode.kind}</span>
          </div>
          <pre className={styles.diffSnippet}>{selectedNode.diffSummary}</pre>
        </aside>
      )}
    </section>
  );
};
