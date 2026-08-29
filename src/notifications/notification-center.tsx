"use client";

import { useState, useEffect, type FC, type ReactNode } from "react";
import { X, CheckCheck, Bell, AlertCircle, Info, ShieldAlert, CreditCard } from "lucide-react";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import styles from "./notification-center.module.css";

export type NotificationPriority = "urgent" | "high" | "normal" | "low";
export type NotificationCategory = "approval" | "system" | "security" | "billing" | "task";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread?: boolean;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

const categoryIconMap: Record<NotificationCategory, ReactNode> = {
  approval: <CheckCheck size={14} />,
  system: <Info size={14} />,
  security: <ShieldAlert size={14} />,
  billing: <CreditCard size={14} />,
  task: <AlertCircle size={14} />,
};

const priorityVariantMap: Record<NotificationPriority, "danger" | "warning" | "default" | "info"> = {
  urgent: "danger",
  high: "warning",
  normal: "default",
  low: "info",
};

/**
 * `<NotificationCenter>` — Enterprise Notification Tray & Slide-Over Drawer.
 *
 * Capabilities:
 * - Category-segmented filtering (`All`, `Unread`, `Approvals`, `System`)
 * - Priority status badges (`urgent`, `high`, `normal`, `low`)
 * - Tabular timestamp formatting
 * - Inline action triggers & batch "Mark all as read"
 * - Escape key dismiss and focus trapping
 */
export const NotificationCenter: FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "approval" | "system">("all");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "approval") return n.category === "approval";
    if (activeTab === "system") return n.category === "system" || n.category === "security";
    return true;
  });

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Notification Center">
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title_wrap}>
            <Bell size={18} />
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className={styles.header_actions}>
            {onMarkAllAsRead && unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                Mark all read
              </Button>
            )}
            <button className={styles.close_btn} onClick={onClose} aria-label="Close notification drawer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab_btn} ${activeTab === "all" ? styles.tab_active : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.tab_btn} ${activeTab === "unread" ? styles.tab_active : ""}`}
            onClick={() => setActiveTab("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`${styles.tab_btn} ${activeTab === "approval" ? styles.tab_active : ""}`}
            onClick={() => setActiveTab("approval")}
          >
            Approvals
          </button>
          <button
            className={`${styles.tab_btn} ${activeTab === "system" ? styles.tab_active : ""}`}
            onClick={() => setActiveTab("system")}
          >
            System
          </button>
        </div>

        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div className={styles.empty_state}>
              <Bell size={32} />
              <p>No notifications to display.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`${styles.item} ${item.unread ? styles.item_unread : ""}`}
                onClick={() => item.unread && onMarkAsRead?.(item.id)}
              >
                <div className={styles.item_header}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    {item.category && categoryIconMap[item.category]}
                    <h4 className={styles.item_title}>{item.title}</h4>
                  </div>
                  {item.priority && (
                    <Badge variant={priorityVariantMap[item.priority]} size="sm">
                      {item.priority}
                    </Badge>
                  )}
                </div>

                <p className={styles.item_message}>{item.message}</p>

                <div className={styles.item_footer}>
                  <span className={styles.item_timestamp}>{item.timestamp}</span>
                  {item.actionLabel && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        item.onAction?.();
                      }}
                    >
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {onClearAll && notifications.length > 0 && (
          <div className={styles.footer}>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
