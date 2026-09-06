import React, { useId, useState, useMemo } from "react";
import styles from "./split-bill-calculator.module.css";

export type SplitMode = "split_evenly" | "split_by_item";
export type TenderMethod = "card" | "cash" | "gift_card" | "room_charge";

export interface BillLineItem {
  id: string;
  name: string; // "Wild Pacific Salmon"
  quantity: number; // 1
  unitPrice: number; // 38.00
  assignedGuestIndex?: number; // 1 to N
}

export interface PaymentTender {
  id: string;
  method: TenderMethod;
  amount: number;
  guestIndex?: number;
  timestamp: string;
}

export interface SplitBillCalculatorProps {
  checkNumber: string; // "CHK-8812"
  tableNumber: string; // "Table 14"
  items: BillLineItem[];
  initialGuestCount?: number;
  taxRate?: number; // 0.09 = 9%
  initialTipPct?: number; // 18%
  tenders?: PaymentTender[];
  onRecordPayment?: (payment: Omit<PaymentTender, "id" | "timestamp">) => void;
  onFinalizeCheck?: (checkNumber: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SplitBillCalculator: React.FC<SplitBillCalculatorProps> = ({
  checkNumber,
  tableNumber,
  items,
  initialGuestCount = 2,
  taxRate = 0.08875,
  initialTipPct = 18,
  tenders = [],
  onRecordPayment,
  onFinalizeCheck,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [splitMode, setSplitMode] = useState<SplitMode>("split_evenly");
  const [guestCount, setGuestCount] = useState<number>(initialGuestCount);
  const [tipPct, setTipPct] = useState<number>(initialTipPct);
  const [activeGuest, setActiveGuest] = useState<number>(1);
  const [tenderMethod, setTenderMethod] = useState<TenderMethod>("card");
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  }, [items]);

  const taxAmount = subtotal * taxRate;
  const tipAmount = subtotal * (tipPct / 100);
  const grandTotal = subtotal + taxAmount + tipAmount;

  const totalPaid = useMemo(() => {
    return tenders.reduce((acc, t) => acc + t.amount, 0);
  }, [tenders]);

  const balanceRemaining = Math.max(0, grandTotal - totalPaid);
  const perGuestEvenShare = grandTotal / Math.max(1, guestCount);

  const handleApplyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    onRecordPayment?.({
      method: tenderMethod,
      amount: amt,
      guestIndex: activeGuest,
    });
    setPaymentAmount("");
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            🧾
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.checkBadge}>{checkNumber}</span>
              <span className={styles.tableBadge}>{tableNumber}</span>
              {balanceRemaining === 0 ? (
                <span className={styles.paidBadge}>● Settled in Full</span>
              ) : (
                <span className={styles.dueBadge}>
                  Due: {formatCurrency(balanceRemaining)}
                </span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>
              Point-of-Sale Split Bill &amp; Multi-Tender Settlement
            </h2>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className={styles.modeTabs} role="tablist" aria-label="Split method">
          <button
            type="button"
            role="tab"
            aria-selected={splitMode === "split_evenly"}
            className={`${styles.modeTab} ${
              splitMode === "split_evenly" ? styles.activeModeTab : ""
            }`}
            onClick={() => setSplitMode("split_evenly")}
          >
            ⚖️ Split Evenly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={splitMode === "split_by_item"}
            className={`${styles.modeTab} ${
              splitMode === "split_by_item" ? styles.activeModeTab : ""
            }`}
            onClick={() => setSplitMode("split_by_item")}
          >
            📋 Split by Item
          </button>
        </div>
      </header>

      {/* Guest Count & Gratuity Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.guestSelector}>
          <label htmlFor={`guests-${headingId}`} className={styles.toolLabel}>
            Number of Guests:
          </label>
          <select
            id={`guests-${headingId}`}
            value={guestCount}
            onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10)))}
            className={styles.select}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tipPresets}>
          <span className={styles.toolLabel}>Gratuity (Tip):</span>
          {[0, 15, 18, 20, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              className={`${styles.tipBtn} ${tipPct === pct ? styles.activeTip : ""}`}
              onClick={() => setTipPct(pct)}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Financial Breakdown Ribbon */}
      <div className={styles.breakdownRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Food &amp; Beverage Subtotal</span>
          <span className={styles.ribbonValue}>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Sales Tax ({(taxRate * 100).toFixed(2)}%)</span>
          <span className={styles.ribbonValue}>{formatCurrency(taxAmount)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Gratuity ({tipPct}%)</span>
          <span className={styles.ribbonValue}>{formatCurrency(tipAmount)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Bill</span>
          <span className={`${styles.ribbonValue} ${styles.totalHighlight}`}>
            {formatCurrency(grandTotal)}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Per Guest Even Share</span>
          <span className={`${styles.ribbonValue} ${styles.shareHighlight}`}>
            {formatCurrency(perGuestEvenShare)}
          </span>
        </div>
      </div>

      {/* Main Split Interface Area */}
      <div className={styles.splitMainArea}>
        {/* Left Side: Order Items */}
        <div className={styles.itemsPane}>
          <h3 className={styles.paneTitle}>Ordered Items ({items.length})</h3>
          <div className={styles.itemList}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <span className={styles.itemQty}>{item.quantity}x</span>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Tender Recording */}
        <div className={styles.tenderPane}>
          <h3 className={styles.paneTitle}>Record Payment Tender</h3>
          <form className={styles.tenderForm} onSubmit={handleApplyPayment}>
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor={`guest-${headingId}`} className={styles.fieldLabel}>
                  Guest #
                </label>
                <select
                  id={`guest-${headingId}`}
                  value={activeGuest}
                  onChange={(e) => setActiveGuest(parseInt(e.target.value, 10))}
                  className={styles.select}
                >
                  {Array.from({ length: guestCount }, (_, i) => i + 1).map((g) => (
                    <option key={g} value={g}>
                      Guest {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`method-${headingId}`} className={styles.fieldLabel}>
                  Tender Method
                </label>
                <select
                  id={`method-${headingId}`}
                  value={tenderMethod}
                  onChange={(e) => setTenderMethod(e.target.value as TenderMethod)}
                  className={styles.select}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="gift_card">Gift Card</option>
                  <option value="room_charge">Room Folio Charge</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor={`amount-${headingId}`} className={styles.fieldLabel}>
                  Payment Amount
                </label>
                <input
                  id={`amount-${headingId}`}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder={formatCurrency(
                    splitMode === "split_evenly" ? perGuestEvenShare : balanceRemaining
                  )}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={styles.applyBtn}
                  disabled={balanceRemaining <= 0}
                >
                  + Apply Payment
                </button>
              </div>
            </div>
          </form>

          {/* Tenders Recorded History */}
          <div className={styles.tenderHistory}>
            <h4 className={styles.historyTitle}>Applied Payments ({tenders.length})</h4>
            {tenders.length === 0 ? (
              <div className={styles.emptyTenders}>No payments recorded yet.</div>
            ) : (
              <div className={styles.tenderList}>
                {tenders.map((t) => (
                  <div key={t.id} className={styles.tenderRow}>
                    <span>Guest {t.guestIndex || 1} ({t.method.toUpperCase()})</span>
                    <span className={styles.tenderAmount}>
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Finalize Button */}
      {balanceRemaining <= 0 && onFinalizeCheck && (
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.finalizeBtn}
            onClick={() => onFinalizeCheck(checkNumber)}
          >
            ✓ Close &amp; Print Final Receipt
          </button>
        </footer>
      )}
    </section>
  );
};
