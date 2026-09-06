import React, { useId, useState } from "react";
import styles from "./warehouse-pick-pack-wave-console.module.css";

export interface PickTask {
  id: string;
  sequenceNumber: number;
  locationBarcode: string;
  locationLabel: string; // e.g. "AISLE 04 - BAY B - SHELF 2 - BIN 14"
  sku: string;
  itemDescription: string;
  requiredQty: number;
  pickedQty: number;
  targetToteSlot: string; // e.g. "TOTE-A1"
  orderReference: string;
  customerName: string;
  isCompleted: boolean;
}

export interface ToteSlot {
  slotId: string; // "A1", "A2", "B1", "B2"
  toteBarcode: string;
  assignedOrder: string;
  itemCount: number;
  targetCapacity: number;
  status: "active" | "full" | "idle";
}

export interface WarehousePickPackWaveConsoleProps {
  waveId?: string;
  priority?: "normal" | "expedited" | "critical";
  cutoffTime?: string; // e.g. "16:30 EST (42m remaining)"
  cartId?: string;
  pickerName?: string;
  initialTasks: PickTask[];
  toteSlots: ToteSlot[];
  onConfirmPick?: (taskId: string, scannedBarcode: string) => void;
  onReportShortage?: (taskId: string) => void;
  onCompleteWave?: (waveId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const WarehousePickPackWaveConsole: React.FC<WarehousePickPackWaveConsoleProps> = ({
  waveId = "WAVE-2026-0819",
  priority = "expedited",
  cutoffTime = "16:30 EST (38m remaining)",
  cartId = "CART-07",
  pickerName = "Marcus Rivera",
  initialTasks,
  toteSlots,
  onConfirmPick,
  onReportShortage,
  onCompleteWave,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [tasks, setTasks] = useState<PickTask[]>(initialTasks);
  const [scanInput, setScanInput] = useState<string>("");
  const [scanFeedback, setScanFeedback] = useState<{
    type: "success" | "error" | "neutral";
    message: string;
  }>({ type: "neutral", message: "Scan SKU or Bin barcode to verify pick." });

  // Current active task is the first incomplete task
  const activeTaskIndex = tasks.findIndex((t) => !t.isCompleted);
  const activeTask = activeTaskIndex !== -1 ? tasks[activeTaskIndex] : null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    const trimmed = scanInput.trim().toUpperCase();
    if (trimmed === activeTask.sku.toUpperCase() || trimmed === activeTask.locationBarcode.toUpperCase()) {
      setScanFeedback({
        type: "success",
        message: `✓ Verified: Scanned ${trimmed} matches active item. Place in ${activeTask.targetToteSlot}.`,
      });
      // Mark active task completed
      setTasks((prev) =>
        prev.map((t, idx) =>
          idx === activeTaskIndex ? { ...t, isCompleted: true, pickedQty: t.requiredQty } : t
        )
      );
      setScanInput("");
      onConfirmPick?.(activeTask.id, trimmed);
    } else {
      setScanFeedback({
        type: "error",
        message: `⛔ Barcode mismatch: Scanned "${trimmed}" does not match expected SKU "${activeTask.sku}".`,
      });
    }
  };

  const handleShortage = () => {
    if (!activeTask) return;
    setScanFeedback({
      type: "error",
      message: `⚠️ Shortage reported for line ${activeTask.sku}. Supervisor notified.`,
    });
    setTasks((prev) =>
      prev.map((t, idx) =>
        idx === activeTaskIndex ? { ...t, isCompleted: true, pickedQty: 0 } : t
      )
    );
    setScanInput("");
    onReportShortage?.(activeTask.id);
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Wave HUD Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📦
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.waveBadge}>{waveId}</span>
              <span className={`${styles.priorityBadge} ${styles[priority]}`}>
                {priority.toUpperCase()} PRIORITY
              </span>
              <span className={styles.cartBadge}>{cartId}</span>
              <span className={styles.pickerName}>Picker: {pickerName}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Fulfillment Pick &amp; Pack Wave Console
            </h2>
          </div>
        </div>

        {/* Progress & Cutoff */}
        <div className={styles.hudBox}>
          <div className={styles.hudMetric}>
            <span className={styles.hudLabel}>Wave Progress:</span>
            <span className={styles.hudVal}>
              {completedTasks} / {totalTasks} lines ({progressPct}%)
            </span>
          </div>
          <div className={styles.hudMetric}>
            <span className={styles.hudLabel}>Carrier Cut-Off:</span>
            <span className={styles.cutoffVal}>⏱️ {cutoffTime}</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Wave pick completion percentage"
      >
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Active Pick Terminal */}
      {activeTask ? (
        <div className={styles.activePickCard}>
          <div className={styles.locationBanner}>
            <span className={styles.locSub}>NEXT PICK LOCATION:</span>
            <h3 className={styles.locTitle}>{activeTask.locationLabel}</h3>
            <span className={styles.locCode}>[{activeTask.locationBarcode}]</span>
          </div>

          <div className={styles.itemDetailsRow}>
            <div className={styles.itemInfo}>
              <span className={styles.skuPill}>{activeTask.sku}</span>
              <h4 className={styles.itemHeading}>{activeTask.itemDescription}</h4>
              <div className={styles.orderTag}>
                Order: <strong>{activeTask.orderReference}</strong> ({activeTask.customerName})
              </div>
            </div>

            <div className={styles.qtyBox}>
              <span className={styles.qtyLabel}>PICK QUANTITY</span>
              <span className={styles.qtyNum}>{activeTask.requiredQty} UNITS</span>
            </div>

            <div className={styles.targetToteBox}>
              <span className={styles.toteLabel}>PUT TO TOTE</span>
              <span className={styles.toteSlotName}>{activeTask.targetToteSlot}</span>
            </div>
          </div>

          {/* Barcode Scanner Form */}
          <form className={styles.scanForm} onSubmit={handleScanSubmit}>
            <label htmlFor="barcode-scanner-input" className={styles.scanLabel}>
              Scan Barcode / SKU to Confirm:
            </label>
            <div className={styles.scanInputGroup}>
              <input
                id="barcode-scanner-input"
                type="text"
                className={styles.scanInput}
                placeholder="Scan SKU barcode or enter identifier..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                autoFocus
                autoComplete="off"
              />
              <button type="submit" className={styles.verifyBtn}>
                Verify Scan
              </button>
              <button
                type="button"
                className={styles.shortageBtn}
                onClick={handleShortage}
              >
                Report Shortage
              </button>
            </div>

            {/* Scan Feedback Banner */}
            <div
              className={`${styles.feedbackBanner} ${
                scanFeedback.type === "success"
                  ? styles.feedbackSuccess
                  : scanFeedback.type === "error"
                  ? styles.feedbackError
                  : styles.feedbackNeutral
              }`}
              role="status"
              aria-live="polite"
            >
              {scanFeedback.message}
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.waveCompletedCard}>
          <span className={styles.completedIcon} aria-hidden="true">🎉</span>
          <h3 className={styles.completedTitle}>All Wave Picks Completed!</h3>
          <p className={styles.completedDesc}>
            All {totalTasks} lines have been picked and staged into totes. Proceed to packing station.
          </p>
          <button
            type="button"
            className={styles.completeWaveBtn}
            onClick={() => onCompleteWave?.(waveId)}
          >
            Release Cart to Packing ({cartId})
          </button>
        </div>
      )}

      {/* Cart Tote Layout Grid */}
      <div className={styles.cartSection}>
        <h3 className={styles.cartSectionTitle}>Cart {cartId} Tote Slots</h3>
        <div className={styles.toteGrid}>
          {toteSlots.map((slot) => {
            const isTarget = activeTask && activeTask.targetToteSlot === slot.slotId;
            return (
              <div
                key={slot.slotId}
                className={`${styles.toteCard} ${isTarget ? styles.toteTarget : ""}`}
              >
                <div className={styles.toteHeader}>
                  <span className={styles.slotName}>SLOT {slot.slotId}</span>
                  <span className={`${styles.toteStatus} ${styles[slot.status]}`}>
                    {slot.status.toUpperCase()}
                  </span>
                </div>
                <div className={styles.toteBarcode}>{slot.toteBarcode}</div>
                <div className={styles.toteOrder}>Order: {slot.assignedOrder}</div>
                <div className={styles.toteCapacity}>
                  <span>Load: {slot.itemCount} / {slot.targetCapacity} items</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
