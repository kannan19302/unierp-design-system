import React, { useId, useState, useMemo } from "react";
import styles from "./service-catalog-cart-checkout.module.css";

export type ServiceItemCategory = "hardware" | "software_license" | "cloud_access" | "peripherals";
export type BillingFrequency = "one_time" | "monthly" | "annual";

export interface ServiceCartItem {
  id: string;
  name: string; // "MacBook Pro 16-inch M3 Max"
  sku: string; // "IT-HW-MBP16-01"
  category: ServiceItemCategory;
  quantity: number;
  unitPrice: number;
  billingFrequency: BillingFrequency;
  slaDays: number; // e.g. 2 days
  specSummary?: string; // "36GB RAM, 1TB SSD"
}

export interface ServiceCatalogCartCheckoutProps {
  requestId: string; // "REQ-2026-9402"
  requesterName: string; // "Elena Rostova"
  requesterEmail: string; // "elena.rostova@unierp.internal"
  costCenters: string[]; // ["CC-4010 Engineering", "CC-1020 Finance", "CC-8030 SecOps"]
  initialItems: ServiceCartItem[];
  defaultCostCenter?: string;
  onSubmitRequest?: (data: {
    costCenter: string;
    businessJustification: string;
    items: ServiceCartItem[];
  }) => void;
  onUpdateQuantity?: (itemId: string, newQty: number) => void;
  onRemoveItem?: (itemId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ServiceCatalogCartCheckout: React.FC<ServiceCatalogCartCheckoutProps> = ({
  requestId,
  requesterName,
  requesterEmail,
  costCenters,
  initialItems,
  defaultCostCenter,
  onSubmitRequest,
  onUpdateQuantity,
  onRemoveItem,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [items, setItems] = useState<ServiceCartItem[]>(initialItems);
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>(
    defaultCostCenter ?? (costCenters[0] ?? "CC-GENERAL")
  );
  const [businessJustification, setBusinessJustification] = useState<string>("");

  const handleQtyChange = (itemId: string, val: string) => {
    const qty = Math.max(1, parseInt(val, 10) || 1);
    const updated = items.map((it) => (it.id === itemId ? { ...it, quantity: qty } : it));
    setItems(updated);
    onUpdateQuantity?.(itemId, qty);
  };

  const handleRemove = (itemId: string) => {
    const updated = items.filter((it) => it.id !== itemId);
    setItems(updated);
    onRemoveItem?.(itemId);
  };

  const totals = useMemo(() => {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;
    let maxSlaDays = 0;

    items.forEach((item) => {
      if (item.slaDays > maxSlaDays) maxSlaDays = item.slaDays;
      const extended = item.unitPrice * item.quantity;
      if (item.billingFrequency === "one_time") {
        oneTimeTotal += extended;
      } else if (item.billingFrequency === "monthly") {
        monthlyTotal += extended;
      } else if (item.billingFrequency === "annual") {
        monthlyTotal += extended / 12;
      }
    });

    return { oneTimeTotal, monthlyTotal, maxSlaDays };
  }, [items]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(val);

  const getCategoryBadgeClass = (cat: ServiceItemCategory) => {
    switch (cat) {
      case "hardware":
        return styles.catHardware;
      case "software_license":
        return styles.catSoftware;
      case "cloud_access":
        return styles.catCloud;
      default:
        return styles.catPeripherals;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessJustification.trim() || items.length === 0) return;
    onSubmitRequest?.({
      costCenter: selectedCostCenter,
      businessJustification,
      items,
    });
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.metaRow}>
            <span className={styles.reqBadge}>{requestId}</span>
            <span className={styles.slaBadge}>⏱ Max SLA: {totals.maxSlaDays} Business Days</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Enterprise IT Service Provisioning Checkout
          </h2>
          <p className={styles.requesterInfo}>
            Requested by: <strong>{requesterName}</strong> ({requesterEmail})
          </p>
        </div>

        {/* Cost Summary Cards */}
        <div className={styles.totalsSummary}>
          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>One-Time Capex</span>
            <span className={styles.totalVal}>{formatCurrency(totals.oneTimeTotal)}</span>
          </div>
          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>Recurring Opex</span>
            <span className={styles.totalValPrimary}>
              {formatCurrency(totals.monthlyTotal)} /mo
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout: Cart Items Table + Approval & Cost Allocation Sidebar */}
      <form onSubmit={handleSubmit} className={styles.mainLayout}>
        {/* Cart Item Rows */}
        <div className={styles.cartArea}>
          <h3 className={styles.sectionHeader}>Requested Provisioning Items ({items.length})</h3>

          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your provisioning cart is empty. Browse the IT Service Catalog to add hardware or software.</p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemInfoCol}>
                    <div className={styles.itemBadgeRow}>
                      <span className={`${styles.catBadge} ${getCategoryBadgeClass(item.category)}`}>
                        {item.category.replace("_", " ").toUpperCase()}
                      </span>
                      <span className={styles.skuText}>{item.sku}</span>
                    </div>
                    <strong className={styles.itemName}>{item.name}</strong>
                    {item.specSummary && (
                      <span className={styles.itemSpec}>{item.specSummary}</span>
                    )}
                  </div>

                  <div className={styles.itemControlsCol}>
                    <div className={styles.qtyWrap}>
                      <label htmlFor={`qty-${item.id}`} className={styles.srOnly}>
                        Quantity for {item.name}
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        className={styles.qtyInput}
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      />
                    </div>

                    <div className={styles.priceWrap}>
                      <span className={styles.extPrice}>
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                      <span className={styles.freqTag}>
                        {item.billingFrequency === "one_time" ? "one-time" : "recurring"}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Cost Center & Approval Chain */}
        <aside className={styles.sidebar} aria-label="Order Approval and Allocation">
          <h3 className={styles.sectionHeader}>Allocation & Approval</h3>

          <div className={styles.formGroup}>
            <label htmlFor="checkout-cost-center" className={styles.inputLabel}>
              Cost Center Allocation
            </label>
            <select
              id="checkout-cost-center"
              className={styles.select}
              value={selectedCostCenter}
              onChange={(e) => setSelectedCostCenter(e.target.value)}
            >
              {costCenters.map((cc) => (
                <option key={cc} value={cc}>
                  {cc}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="checkout-justification" className={styles.inputLabel}>
              Business Justification <span className={styles.required}>*</span>
            </label>
            <textarea
              id="checkout-justification"
              rows={3}
              className={styles.textarea}
              placeholder="State project code or operational necessity for this equipment..."
              value={businessJustification}
              onChange={(e) => setBusinessJustification(e.target.value)}
              required
            />
          </div>

          {/* Governance Approval Preview Waterfall */}
          <div className={styles.approvalWorkflow}>
            <h4 className={styles.approvalTitle}>Governance Sign-off Sequence</h4>
            <ol className={styles.approvalList}>
              <li className={styles.approvalStep}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <strong>Direct Manager:</strong> Automated notification upon submit
                </div>
              </li>
              <li className={styles.approvalStep}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <strong>IT Asset Custodian:</strong> Warehouse inventory dispatch
                </div>
              </li>
            </ol>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={items.length === 0 || !businessJustification.trim()}
          >
            Submit Provisioning Request
          </button>
        </aside>
      </form>
    </section>
  );
};
