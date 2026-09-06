"use client";

import React from "react";
import styles from "./sankey-diagram.module.css";

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  nodeWidth?: number;
}

export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export const SankeyDiagram: React.FC<SankeyDiagramProps> = (props) => {
  const { nodes, links, height = 300, nodeWidth: _nodeWidth = 20 } = props;
  void _nodeWidth;
  const totalValue = links.reduce((s, l) => s + l.value, 0) || 1;

  const sourceNodes = [...new Set(links.map(l => l.source))];
  const targetNodes = [...new Set(links.map(l => l.target))];

  return (
    <div className={styles.container} style={{ height }} role="img" aria-label="Sankey diagram">
      <div className={styles.columns}>
        <div className={styles.nodeColumn}>
          {sourceNodes.map(id => {
            const node = nodes.find(n => n.id === id);
            const nodeTotal = links.filter(l => l.source === id).reduce((s, l) => s + l.value, 0);
            const barH = (nodeTotal / totalValue) * (height - 40);
            return (
              <div key={id} className={styles.node} style={{ height: barH, background: node?.color || 'var(--color-brand)' }}>
                <span className={styles.nodeLabel}>{node?.label || id}</span>
                <span className={styles.nodeValue}>{nodeTotal.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.flowArea}>
          <div className={styles.flowPlaceholder}>
            {links.map((l, i) => (
              <div key={i} className={styles.flowBand} style={{ height: (l.value / totalValue) * (height - 40), opacity: 0.3, background: nodes.find(n => n.id === l.source)?.color || 'var(--color-brand)' }} title={`${l.source} → ${l.target}: ${l.value}`} />
            ))}
          </div>
        </div>
        <div className={styles.nodeColumn}>
          {targetNodes.map(id => {
            const node = nodes.find(n => n.id === id);
            const nodeTotal = links.filter(l => l.target === id).reduce((s, l) => s + l.value, 0);
            const barH = (nodeTotal / totalValue) * (height - 40);
            return (
              <div key={id} className={styles.node} style={{ height: barH, background: node?.color || 'var(--color-info, #06b6d4)' }}>
                <span className={styles.nodeLabel}>{node?.label || id}</span>
                <span className={styles.nodeValue}>{nodeTotal.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
