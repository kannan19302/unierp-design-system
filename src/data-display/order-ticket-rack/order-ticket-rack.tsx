import React, { useState, useId } from "react";
import styles from "./order-ticket-rack.module.css";

export interface OrderTicketItem {
  id: string;
  name: string;
  quantity: number;
  modifiers?: string[];
  isCompleted?: boolean;
}

export interface OrderTicket {
  id: string;
  orderNumber: string;
  destination: "Dine-In" | "Takeout" | "Delivery" | "Express";
  tableOrChannel?: string;
  serverOrCustomerName?: string;
  elapsedSeconds: number;
  targetSeconds?: number;
  items: OrderTicketItem[];
}

export interface OrderTicketRackProps {
  /** Title of the rack (default: "Live Order Queue") */
  title?: string;
  /** Active order tickets */
  tickets: OrderTicket[];
  /** Callback fired when an entire ticket is bumped/completed */
  onBumpTicket?: (ticketId: string) => void;
  /** Callback fired when an individual line item is struck off/completed */
  onToggleItem?: (ticketId: string, itemId: string) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const OrderTicketRack: React.FC<OrderTicketRackProps> = ({
  title = "Live Order Queue",
  tickets,
  onBumpTicket,
  onToggleItem,
  density = "compact",
  className,
}) => {
  const rackId = useId();
  const [filter, setFilter] = useState<"all" | "Dine-In" | "Takeout" | "Delivery">("all");

  const filteredTickets = tickets.filter((t) => {
    if (filter === "all") return true;
    return t.destination === filter;
  });

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getUrgencyClass = (elapsed: number, target = 600) => {
    if (elapsed > target) return styles.urgencyCritical;
    if (elapsed > target * 0.6) return styles.urgencyWarning;
    return styles.urgencyNormal;
  };

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${rackId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.posBadge}>KDS</span>
          <h3 id={`${rackId}-title`} className={styles.rackTitle}>
            {title}
          </h3>
          <span className={styles.countBadge}>
            {filteredTickets.length} Active Orders
          </span>
        </div>

        {/* Destination Filter Tabs */}
        <div className={styles.filterTabs} role="group" aria-label="Filter orders by channel">
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({tickets.length})
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "Dine-In" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("Dine-In")}
          >
            Dine-In
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "Takeout" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("Takeout")}
          >
            Takeout
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "Delivery" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("Delivery")}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Rack Queue */}
      <div className={styles.rackScroll} role="feed" aria-label="Order tickets queue">
        {filteredTickets.length === 0 ? (
          <div className={styles.emptyRack}>All tickets cleared. Queue is currently empty.</div>
        ) : (
          filteredTickets.map((ticket) => {
            const urgencyClass = getUrgencyClass(
              ticket.elapsedSeconds,
              ticket.targetSeconds ?? 600
            );
            const allItemsCompleted =
              ticket.items.length > 0 &&
              ticket.items.every((i) => i.isCompleted);

            return (
              <article
                key={ticket.id}
                className={`${styles.ticketCard} ${urgencyClass}`}
                aria-label={`Order #${ticket.orderNumber}, ${ticket.destination}`}
              >
                {/* Ticket Top Header */}
                <div className={styles.ticketHeader}>
                  <div className={styles.orderIdent}>
                    <span className={styles.orderNumber}>#{ticket.orderNumber}</span>
                    <span className={styles.destPill}>{ticket.destination}</span>
                  </div>
                  <div className={styles.timerZone}>
                    <span className={styles.timerIcon} aria-hidden="true">⏱</span>
                    <time className={styles.elapsedTimer}>
                      {formatElapsed(ticket.elapsedSeconds)}
                    </time>
                  </div>
                </div>

                {/* Sub-header with table/server info */}
                {(ticket.tableOrChannel || ticket.serverOrCustomerName) && (
                  <div className={styles.metaRow}>
                    {ticket.tableOrChannel && (
                      <span className={styles.metaChannel}>{ticket.tableOrChannel}</span>
                    )}
                    {ticket.serverOrCustomerName && (
                      <span className={styles.metaServer}>
                        • {ticket.serverOrCustomerName}
                      </span>
                    )}
                  </div>
                )}

                {/* Items List */}
                <ul className={styles.itemList} aria-label={`Items for order #${ticket.orderNumber}`}>
                  {ticket.items.map((item) => (
                    <li
                      key={item.id}
                      className={`${styles.itemRow} ${
                        item.isCompleted ? styles.itemCompleted : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={styles.itemToggleBtn}
                        onClick={() => onToggleItem?.(ticket.id, item.id)}
                        aria-pressed={Boolean(item.isCompleted)}
                        aria-label={`${item.quantity}x ${item.name} (${
                          item.isCompleted ? "Completed" : "Pending"
                        })`}
                      >
                        <span className={styles.itemCheckbox}>
                          {item.isCompleted ? "✓" : "○"}
                        </span>
                        <span className={styles.itemQty}>{item.quantity}x</span>
                        <span className={styles.itemName}>{item.name}</span>
                      </button>

                      {/* Modifiers / Special Instructions */}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className={styles.modifierList}>
                          {item.modifiers.map((mod, idx) => (
                            <span key={idx} className={styles.modifierTag}>
                              + {mod}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Bump Ticket Footer Button */}
                <div className={styles.ticketFooter}>
                  <button
                    type="button"
                    className={`${styles.bumpBtn} ${
                      allItemsCompleted ? styles.bumpBtnReady : ""
                    }`}
                    onClick={() => onBumpTicket?.(ticket.id)}
                    aria-label={`Bump order #${ticket.orderNumber}`}
                  >
                    <span>{allItemsCompleted ? "BUMP COMPLETED" : "BUMP ORDER"}</span>
                    <span className={styles.bumpShortcut}>↵</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
