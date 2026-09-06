"use client";

import {
  useState,
  useMemo,
  type FC,
  type ReactNode,
} from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link2,
  Sparkles,
  Search,
} from "lucide-react";
import styles from "./batch-reconciliation-matcher.module.css";

export type MatchConfidence = "exact" | "suggested" | "rule" | "unmatched";
export type MatcherDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface StatementItem {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  matchedLedgerId?: string;
}

export interface LedgerItem {
  id: string;
  date: string;
  account: string;
  voucherNumber: string;
  amount: number;
  currency: string;
  matchedStatementId?: string;
}

export interface MatchPair {
  statementId: string;
  ledgerId: string;
  confidence: MatchConfidence;
  confidenceScore: number; // 0 to 100
  varianceAmount: number;
  ruleReason?: string;
}

export interface BatchReconciliationMatcherProps {
  /** External/bank statement records */
  statements: StatementItem[];
  /** Internal General Ledger items */
  ledgerItems: LedgerItem[];
  /** Initial or calculated candidate matches */
  proposedMatches?: MatchPair[];
  /** Callback when matches are confirmed or altered */
  onConfirmMatches?: (confirmedPairs: MatchPair[]) => void;
  /** Currency symbol or ISO code */
  currency?: string;
  /** Allowed auto-match variance threshold in currency units */
  varianceTolerance?: number;
  /** Density scale */
  density?: MatcherDensity;
  className?: string;
}

/**
 * `<BatchReconciliationMatcher>` — High-density side-by-side reconciliation workspace.
 * Benchmarked against Coupa (#34), Mercury Banking (#45), Bill.com (#41), and Oracle Financials.
 */
export const BatchReconciliationMatcher: FC<BatchReconciliationMatcherProps> = ({
  statements,
  ledgerItems,
  proposedMatches = [],
  onConfirmMatches,
  currency = "USD",
  varianceTolerance = 0.05,
  density = "compact",
  className = "",
}) => {
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);
  const [activeMatches, setActiveMatches] = useState<MatchPair[]>(proposedMatches);
  const [searchQuery, setSearchQuery] = useState("");

  const matchedStatementIds = useMemo(
    () => new Set(activeMatches.map((m) => m.statementId)),
    [activeMatches]
  );
  const matchedLedgerIds = useMemo(
    () => new Set(activeMatches.map((m) => m.ledgerId)),
    [activeMatches]
  );

  const filteredStatements = useMemo(() => {
    if (!searchQuery.trim()) return statements;
    const q = searchQuery.toLowerCase();
    return statements.filter(
      (s) =>
        s.description.toLowerCase().includes(q) ||
        s.reference.toLowerCase().includes(q) ||
        s.amount.toString().includes(q)
    );
  }, [statements, searchQuery]);

  const filteredLedgers = useMemo(() => {
    if (!searchQuery.trim()) return ledgerItems;
    const q = searchQuery.toLowerCase();
    return ledgerItems.filter(
      (l) =>
        l.account.toLowerCase().includes(q) ||
        l.voucherNumber.toLowerCase().includes(q) ||
        l.amount.toString().includes(q)
    );
  }, [ledgerItems, searchQuery]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleManualPair = () => {
    if (!selectedStatementId || !selectedLedgerId) return;

    const stmt = statements.find((s) => s.id === selectedStatementId);
    const ledg = ledgerItems.find((l) => l.id === selectedLedgerId);
    if (!stmt || !ledg) return;

    const variance = Math.abs(stmt.amount - ledg.amount);
    const confidenceScore = variance === 0 ? 100 : variance <= varianceTolerance ? 95 : 75;
    const confidence: MatchConfidence = variance === 0 ? "exact" : "suggested";

    const newPair: MatchPair = {
      statementId: stmt.id,
      ledgerId: ledg.id,
      confidence,
      confidenceScore,
      varianceAmount: variance,
      ruleReason: variance === 0 ? "Manual exact pair" : "Manual override with variance",
    };

    // Remove existing matches for these items
    const updated = activeMatches.filter(
      (m) => m.statementId !== stmt.id && m.ledgerId !== ledg.id
    );
    updated.push(newPair);
    setActiveMatches(updated);
    setSelectedStatementId(null);
    setSelectedLedgerId(null);
  };

  const handleUnmatch = (statementId: string) => {
    setActiveMatches((prev) => prev.filter((m) => m.statementId !== statementId));
  };

  const handleAutoMatchHighConfidence = () => {
    const unMatchedStmts = statements.filter((s) => !matchedStatementIds.has(s.id));
    const unMatchedLedgs = [...ledgerItems.filter((l) => !matchedLedgerIds.has(l.id))];
    const newMatches: MatchPair[] = [...activeMatches];

    for (const stmt of unMatchedStmts) {
      const exactIndex = unMatchedLedgs.findIndex(
        (l) => Math.abs(l.amount - stmt.amount) === 0
      );
      if (exactIndex !== -1) {
        const matched = unMatchedLedgs[exactIndex];
        if (matched) {
          unMatchedLedgs.splice(exactIndex, 1);
          newMatches.push({
            statementId: stmt.id,
            ledgerId: matched.id,
            confidence: "exact",
            confidenceScore: 100,
            varianceAmount: 0,
            ruleReason: "Auto exact amount match",
          });
        }
      }
    }

    setActiveMatches(newMatches);
  };

  const handleConfirm = () => {
    onConfirmMatches?.(activeMatches);
  };

  const renderConfidenceBadge = (pair: MatchPair) => {
    let icon: ReactNode;
    let badgeClass = styles.badgeExact;

    switch (pair.confidence) {
      case "exact":
        icon = <CheckCircle2 size={12} aria-hidden="true" />;
        badgeClass = styles.badgeExact;
        break;
      case "suggested":
        icon = <Sparkles size={12} aria-hidden="true" />;
        badgeClass = styles.badgeSuggested;
        break;
      case "rule":
        icon = <HelpCircle size={12} aria-hidden="true" />;
        badgeClass = styles.badgeRule;
        break;
      default:
        icon = <AlertCircle size={12} aria-hidden="true" />;
        badgeClass = styles.badgeUnmatched;
        break;
    }

    return (
      <span className={`${styles.badge} ${badgeClass}`}>
        {icon}
        <span>{pair.confidenceScore}%</span>
      </span>
    );
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Batch Reconciliation Matcher"
    >
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Filter statement or ledger records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter records"
          />
        </div>

        <div className={styles.stats}>
          <span className={styles.statLabel}>Matched:</span>
          <span className={styles.statValue}>
            {activeMatches.length} / {Math.min(statements.length, ledgerItems.length)}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleAutoMatchHighConfidence}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>Auto-Match (100% Exact)</span>
          </button>

          <button
            type="button"
            className={styles.btnPrimary}
            disabled={!selectedStatementId || !selectedLedgerId}
            onClick={handleManualPair}
          >
            <Link2 size={13} aria-hidden="true" />
            <span>Link Selected</span>
          </button>

          <button
            type="button"
            className={styles.btnConfirm}
            onClick={handleConfirm}
            disabled={activeMatches.length === 0}
          >
            <ArrowRightLeft size={13} aria-hidden="true" />
            <span>Confirm Matches ({activeMatches.length})</span>
          </button>
        </div>
      </div>

      {/* ── Dual Pane Data Tables ── */}
      <div className={styles.panesWrapper}>
        {/* Statement Pane (Left) */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <span className={styles.paneTitle}>External Statement Records</span>
            <span className={styles.paneCount}>{filteredStatements.length} items</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col">Ref</th>
                  <th scope="col" className={styles.numericCol}>Amount</th>
                  <th scope="col" className={styles.statusCol}>Match Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatements.map((stmt) => {
                  const match = activeMatches.find((m) => m.statementId === stmt.id);
                  const isSelected = selectedStatementId === stmt.id;
                  const isMatched = Boolean(match);

                  return (
                    <tr
                      key={stmt.id}
                      className={`${styles.row} ${isSelected ? styles.rowSelected : ""} ${
                        isMatched ? styles.rowMatched : ""
                      }`}
                      onClick={() => setSelectedStatementId(isSelected ? null : stmt.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedStatementId(isSelected ? null : stmt.id);
                        }
                      }}
                      role="row"
                      aria-selected={isSelected}
                    >
                      <td className={styles.dateCell}>{stmt.date}</td>
                      <td className={styles.descCell} title={stmt.description}>
                        {stmt.description}
                      </td>
                      <td className={styles.monoCell}>{stmt.reference}</td>
                      <td className={`${styles.numericCol} ${styles.amountCell}`}>
                        {formatCurrency(stmt.amount)}
                      </td>
                      <td className={styles.statusCol}>
                        {match ? (
                          <div className={styles.matchCellGroup}>
                            {renderConfidenceBadge(match)}
                            <button
                              type="button"
                              className={styles.unmatchBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnmatch(stmt.id);
                              }}
                              title="Unlink match"
                              aria-label={`Unlink match for ${stmt.reference}`}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className={styles.unmatchedTag}>Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ledger Pane (Right) */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <span className={styles.paneTitle}>Internal General Ledger</span>
            <span className={styles.paneCount}>{filteredLedgers.length} items</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">GL Account</th>
                  <th scope="col">Voucher #</th>
                  <th scope="col" className={styles.numericCol}>Amount</th>
                  <th scope="col" className={styles.statusCol}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedgers.map((ledg) => {
                  const match = activeMatches.find((m) => m.ledgerId === ledg.id);
                  const isSelected = selectedLedgerId === ledg.id;
                  const isMatched = Boolean(match);

                  return (
                    <tr
                      key={ledg.id}
                      className={`${styles.row} ${isSelected ? styles.rowSelected : ""} ${
                        isMatched ? styles.rowMatched : ""
                      }`}
                      onClick={() => setSelectedLedgerId(isSelected ? null : ledg.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedLedgerId(isSelected ? null : ledg.id);
                        }
                      }}
                      role="row"
                      aria-selected={isSelected}
                    >
                      <td className={styles.dateCell}>{ledg.date}</td>
                      <td className={styles.descCell} title={ledg.account}>
                        {ledg.account}
                      </td>
                      <td className={styles.monoCell}>{ledg.voucherNumber}</td>
                      <td className={`${styles.numericCol} ${styles.amountCell}`}>
                        {formatCurrency(ledg.amount)}
                      </td>
                      <td className={styles.statusCol}>
                        {match ? (
                          <span className={styles.matchedLedgerTag}>Linked</span>
                        ) : (
                          <span className={styles.unmatchedTag}>Unmatched</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
