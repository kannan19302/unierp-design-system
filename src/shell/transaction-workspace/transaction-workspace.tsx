"use client";

import { type FC, type ReactNode } from "react";
import { MeridianBar, type MeridianSegment, type MeridianAction, type MeridianState } from "../meridian-bar";
import { PageHeader } from "../../layout/page-header";
import styles from "./transaction-workspace.module.css";

export interface TransactionSummaryItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface TransactionWorkspaceProps {
  /** Context address segments */
  segments?: MeridianSegment[];
  /** Lifecycle / approval status */
  state?: { label: string; tone?: MeridianState };
  /** Primary next verb */
  action?: MeridianAction;
  title: string;
  subtitle?: string;
  documentNumber?: string;
  /** Header fields section (e.g. posting date, entity, currency, ref number) */
  headerFields: ReactNode;
  /** Main transaction line items grid or table */
  children: ReactNode;
  /** Summary calculation totals (subtotal, tax, discounts, net balance) */
  summaryItems?: TransactionSummaryItem[];
  /** Validation / balance alerts */
  validationAlerts?: ReactNode;
  /** Action footer buttons (Save Draft, Post, Submit, Cancel) */
  footerActions?: ReactNode;
  className?: string;
}

export const TransactionWorkspace: FC<TransactionWorkspaceProps> = ({
  segments,
  state,
  action,
  title,
  subtitle,
  documentNumber,
  headerFields,
  children,
  summaryItems,
  validationAlerts,
  footerActions,
  className = "",
}) => {
  return (
    <div className={`${styles.root} ${className}`.trim()} data-floorplan="transaction-workspace">
      {/* Context boundary */}
      {segments && segments.length > 0 && (
        <MeridianBar
          segments={segments}
          state={state}
          action={action}
          copyable
          className={styles.meridianBar}
        />
      )}

      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <PageHeader
            title={documentNumber ? `${title} — ${documentNumber}` : title}
            description={subtitle}
          />
        </div>
      </div>

      {/* Validation banner / alerts if any */}
      {validationAlerts && <div className={styles.alertSlot}>{validationAlerts}</div>}

      {/* Master Document Header Fields */}
      <div className={styles.headerCard} role="region" aria-label="Transaction Details">
        {headerFields}
      </div>

      {/* Line Items Transaction Body */}
      <div className={styles.lineItemsCard} role="region" aria-label="Transaction Line Items">
        {children}
      </div>

      {/* Summary Totals & Footer Action Bar */}
      <div className={styles.footerWrap}>
        {summaryItems && summaryItems.length > 0 && (
          <div className={styles.summaryGrid} role="region" aria-label="Summary Totals">
            {summaryItems.map((item, i) => (
              <div
                key={i}
                className={`${styles.summaryItem} ${item.highlight ? styles.summaryHighlight : ""}`}
              >
                <span className={styles.summaryLabel}>{item.label}</span>
                <span className={styles.summaryValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {footerActions && (
          <div className={styles.actionsBar} role="toolbar" aria-label="Transaction Actions">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
