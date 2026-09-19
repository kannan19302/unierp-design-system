"use client";

import React, { forwardRef } from "react";
import styles from "./sankey-diagram.module.css";

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

export interface SankeyDiagramProps
  extends React.HTMLAttributes<HTMLDivElement> {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  nodeWidth?: number;
}

/**
 * SankeyDiagram visualizes flow distribution and volume transfers between source and destination stages.
 *
 * @maturity stable
 */
export const SankeyDiagram = forwardRef<HTMLDivElement, SankeyDiagramProps>(
  (
    {
      nodes,
      links,
      height = 300,
      nodeWidth: _nodeWidth = 20,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    void _nodeWidth;
    const totalValue = links.reduce((s, l) => s + l.value, 0) || 1;

    const sourceNodes = [...new Set(links.map((l) => l.source))];
    const targetNodes = [...new Set(links.map((l) => l.target))];

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        style={{ height, ...style }}
        role="img"
        aria-label="Sankey diagram"
        {...rest}
      >
        <div className={styles.columns}>
          <div className={styles.nodeColumn}>
            {sourceNodes.map((id) => {
              const node = nodes.find((n) => n.id === id);
              const nodeTotal = links
                .filter((l) => l.source === id)
                .reduce((s, l) => s + l.value, 0);
              const barH = (nodeTotal / totalValue) * (height - 40);
              return (
                <div
                  key={id}
                  className={styles.node}
                  style={{
                    height: Math.max(24, barH),
                    background: node?.color || "var(--color-brand)",
                  }}
                >
                  <span className={styles.nodeLabel}>
                    {node?.label || id}
                  </span>
                  <span className={styles.nodeValue}>
                    {nodeTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={styles.flowArea}>
            <div className={styles.flowPlaceholder}>
              {links.map((l, i) => (
                <div
                  key={i}
                  className={styles.flowBand}
                  style={{
                    height: Math.max(
                      4,
                      (l.value / totalValue) * (height - 40)
                    ),
                    opacity: 0.35,
                    background:
                      nodes.find((n) => n.id === l.source)?.color ||
                      "var(--color-brand)",
                  }}
                  title={`${l.source} → ${l.target}: ${l.value}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.nodeColumn}>
            {targetNodes.map((id) => {
              const node = nodes.find((n) => n.id === id);
              const nodeTotal = links
                .filter((l) => l.target === id)
                .reduce((s, l) => s + l.value, 0);
              const barH = (nodeTotal / totalValue) * (height - 40);
              return (
                <div
                  key={id}
                  className={styles.node}
                  style={{
                    height: Math.max(24, barH),
                    background: node?.color || "var(--color-info)",
                  }}
                >
                  <span className={styles.nodeLabel}>
                    {node?.label || id}
                  </span>
                  <span className={styles.nodeValue}>
                    {nodeTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

SankeyDiagram.displayName = "SankeyDiagram";
