"use client";

import { type FC } from "react";
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import styles from "./entity-lineage.module.css";


export interface LineageItem {
  id: string;
  documentType: string;
  documentNumber: string;
  date?: string;
  amount?: string;
  status?: "draft" | "pending" | "approved" | "completed" | "rejected";
  isCurrent?: boolean;
}

export interface EntityLineageProps {
  items: LineageItem[];
  onItemClick?: (item: LineageItem) => void;
  className?: string;
}

export const EntityLineage: FC<EntityLineageProps> = ({
  items,
  onItemClick,
  className = "",
}) => {
  const getStatusBadge = (status?: LineageItem["status"]) => {
    switch (status) {
      case "completed":
      case "approved":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--color-success, #10b981)" }}>
            <CheckCircle2 size={12} />
            <span style={{ textTransform: "capitalize" }}>{status}</span>
          </span>
        );
      case "rejected":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--color-danger, #ef4444)" }}>
            <AlertTriangle size={12} />
            <span>Rejected</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--color-warning, #f59e0b)" }}>
            <Clock size={12} />
            <span style={{ textTransform: "capitalize" }}>{status || "Pending"}</span>
          </span>
        );
    }
  };

  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Document lineage progression">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div
              className={`${styles.item} ${item.isCurrent ? styles.itemCurrent : ""}`}
              onClick={() => onItemClick?.(item)}
              role="button"
              tabIndex={0}
              aria-label={`${item.documentType} ${item.documentNumber}`}
            >
              <div className={styles.itemHeader}>
                <span>{item.documentType}</span>
                {getStatusBadge(item.status)}
              </div>

              <div className={styles.itemDocNumber}>{item.documentNumber}</div>

              {(item.amount || item.date) && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  {item.amount && <span>{item.amount}</span>}
                  {item.date && <span>{item.date}</span>}
                </div>
              )}
            </div>

            {!isLast && (
              <div className={styles.arrow} aria-hidden="true">
                <ArrowRight size={18} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
