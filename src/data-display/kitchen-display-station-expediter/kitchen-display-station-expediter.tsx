import React, { useId, useState } from "react";
import styles from "./kitchen-display-station-expediter.module.css";

export type KdsOrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY" | "VIP";
export type KdsTicketStatus = "NEW" | "PREPARING" | "READY" | "BUMPED";

export interface KdsOrderItem {
  id: string;
  name: string; // "Prime Bone-In Ribeye 16oz"
  quantity: number; // 2
  modifiers?: string[]; // ["Medium Rare", "Truffle Butter (+)", "No Rosemary"]
  isCompleted?: boolean;
}

export interface KdsTicketOrder {
  ticketId: string; // "T-104"
  tableNumber: string; // "Table 12"
  serverName: string; // "Marco S."
  elapsedMinutes: number; // 14
  orderType: KdsOrderType;
  status: KdsTicketStatus;
  items: KdsOrderItem[];
}

export interface KitchenDisplayStationExpediterProps {
  stationName: string;
  ticketOrders: KdsTicketOrder[];
  onBumpTicket?: (ticketId: string) => void;
  onToggleItemComplete?: (ticketId: string, itemId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const KitchenDisplayStationExpediter: React.FC<KitchenDisplayStationExpediterProps> = ({
  stationName,
  ticketOrders: initialTickets,
  onBumpTicket,
  onToggleItemComplete,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [tickets, setTickets] = useState<KdsTicketOrder[]>(initialTickets);

  const activeTickets = tickets.filter((t) => t.status !== "BUMPED");
  const delayedTickets = activeTickets.filter((t) => t.elapsedMinutes >= 15);

  const handleBump = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === ticketId ? { ...t, status: "BUMPED" as KdsTicketStatus } : t))
    );
    onBumpTicket?.(ticketId);
  };

  const handleToggleItem = (ticketId: string, itemId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId !== ticketId) return t;
        const newItems = t.items.map((it) =>
          it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it
        );
        const allDone = newItems.every((it) => it.isCompleted);
        return {
          ...t,
          status: allDone ? ("READY" as KdsTicketStatus) : ("PREPARING" as KdsTicketStatus),
          items: newItems,
        };
      })
    );
    onToggleItemComplete?.(ticketId, itemId);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.stationRow}>
          <div className={styles.stationBadgeGroup}>
            <span className={styles.kdsBadge}>KDS EXPEDITER &amp; KITCHEN DISPLAY</span>
            <h2 id={headingId} className={styles.stationTitle}>
              {stationName}
            </h2>
          </div>

          <div className={styles.statsStrip}>
            <span className={styles.statActive}>{activeTickets.length} Active Orders</span>
            {delayedTickets.length > 0 && (
              <span className={styles.statDelayed}>
                {delayedTickets.length} Rush / Delayed (&gt;15m)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Ticket Grid */}
      <div className={styles.ticketGrid} role="region" aria-label="Kitchen order tickets grid">
        {activeTickets.length === 0 ? (
          <div className={styles.emptyState}>All orders bumped. Station is currently clear.</div>
        ) : (
          activeTickets.map((ticket) => {
            const isCritical = ticket.elapsedMinutes >= 15;
            const isWarning = ticket.elapsedMinutes >= 10 && ticket.elapsedMinutes < 15;
            const isReady = ticket.status === "READY";

            return (
              <article
                key={ticket.ticketId}
                className={`${styles.ticketCard} ${
                  isCritical
                    ? styles.ticketCritical
                    : isWarning
                    ? styles.ticketWarning
                    : isReady
                    ? styles.ticketReady
                    : ""
                }`}
                aria-label={`Order ticket ${ticket.ticketId} for ${ticket.tableNumber}`}
              >
                <div className={styles.ticketHeader}>
                  <div className={styles.ticketIdRow}>
                    <span className={styles.ticketId}>#{ticket.ticketId}</span>
                    <span
                      className={`${styles.orderTypeBadge} ${
                        ticket.orderType === "VIP"
                          ? styles.typeVip
                          : ticket.orderType === "DELIVERY"
                          ? styles.typeDelivery
                          : ticket.orderType === "TAKEOUT"
                          ? styles.typeTakeout
                          : styles.typeDineIn
                      }`}
                    >
                      {ticket.orderType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className={styles.ticketMetaRow}>
                    <span className={styles.tableNumber}>{ticket.tableNumber}</span>
                    <span className={styles.serverName}>Svr: {ticket.serverName}</span>
                    <span
                      className={`${styles.timerBadge} ${
                        isCritical ? styles.timerCritical : isWarning ? styles.timerWarning : ""
                      }`}
                    >
                      ⏱ {ticket.elapsedMinutes}m
                    </span>
                  </div>
                </div>

                <div className={styles.ticketBody}>
                  <ul className={styles.itemList}>
                    {ticket.items.map((item) => (
                      <li
                        key={item.id}
                        className={`${styles.itemRow} ${
                          item.isCompleted ? styles.itemCompleted : ""
                        }`}
                      >
                        <button
                          type="button"
                          className={styles.itemCheckBtn}
                          onClick={() => handleToggleItem(ticket.ticketId, item.id)}
                          aria-pressed={item.isCompleted}
                          aria-label={`Mark ${item.quantity}x ${item.name} as ${
                            item.isCompleted ? "incomplete" : "completed"
                          }`}
                        >
                          <span className={styles.itemQty}>{item.quantity}x</span>
                          <span className={styles.itemName}>{item.name}</span>
                          {item.isCompleted && <span className={styles.checkMark}>✓</span>}
                        </button>

                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className={styles.modifierList}>
                            {item.modifiers.map((mod, i) => (
                              <span key={i} className={styles.modifierItem}>
                                • {mod}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.ticketFooter}>
                  <button
                    type="button"
                    className={`${styles.bumpBtn} ${isReady ? styles.bumpReady : ""}`}
                    onClick={() => handleBump(ticket.ticketId)}
                    aria-label={`Bump order ticket ${ticket.ticketId}`}
                  >
                    {isReady ? "Bump Order (Ready)" : "Bump Ticket"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Real-time POS synchronizer active. Orders highlighted in red exceed the 15-minute kitchen SLA threshold.
        </span>
      </footer>
    </section>
  );
};
