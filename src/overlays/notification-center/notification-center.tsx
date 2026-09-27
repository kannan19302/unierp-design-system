"use client";

import { useState, useEffect, forwardRef, type ReactNode } from "react";
import { X, CheckCheck, Bell, AlertCircle, Info, ShieldAlert, CreditCard } from "lucide-react";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";
import { cva, type VariantProps } from "../../foundation/utils/cva";
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

export const notificationCenterVariants = cva(styles.drawer, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface NotificationCenterProps
  extends VariantProps<typeof notificationCenterVariants> {
  isOpen?: boolean;
  /** Alias for isOpen */
  open?: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  className?: string;
}

const categoryIconMap: Record<NotificationCategory, ReactNode> = {
  approval: <CheckCheck size={14} aria-hidden="true" />,
  system: <Info size={14} aria-hidden="true" />,
  security: <ShieldAlert size={14} aria-hidden="true" />,
  billing: <CreditCard size={14} aria-hidden="true" />,
  task: <AlertCircle size={14} aria-hidden="true" />,
};

const priorityVariantMap: Record<NotificationPriority, "danger" | "warning" | "default" | "info"> = {
  urgent: "danger",
  high: "warning",
  normal: "default",
  low: "info",
};

/**
 * `<NotificationCenter>` — Enterprise Notification Tray & Slide-Over Drawer.
 * Benchmarked against Slack Activity Feed, Salesforce Notification Center, and Linear Inbox.
 *
 * @maturity stable
 */
export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(
  function NotificationCenter(
    {
      isOpen,
      open,
      onClose,
      notifications,
      onMarkAsRead,
      onMarkAllAsRead,
      onClearAll,
      density = "standard",
      className = "",
    },
    ref
  ) {
    const isVisible = open ?? isOpen ?? false;
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "approval" | "system">("all");

    useEffect(() => {
      if (!isVisible) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const unreadCount = notifications.filter((n) => n.unread).length;

    const filtered = notifications.filter((n) => {
      if (activeTab === "unread") return n.unread;
      if (activeTab === "approval") return n.category === "approval";
      if (activeTab === "system") return n.category === "system" || n.category === "security";
      return true;
    });

    return (
      <div
        ref={ref}
        data-slot="notification-center-backdrop"
        className={`${styles.backdrop} ${className}`.trim()}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Notification Center"
      >
        <div
          data-slot="notification-center"
          data-density={density}
          className={notificationCenterVariants({ density })}
          onClick={(e) => e.stopPropagation()}
        >
          <div data-slot="notification-center-header" className={styles.header}>
            <div className={styles.title_wrap}>
              <Bell size={18} aria-hidden="true" />
              <h3 data-slot="notification-center-title" className={styles.title}>
                Notifications
              </h3>
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
              <button
                type="button"
                data-slot="notification-center-close"
                className={styles.close_btn}
                onClick={onClose}
                aria-label="Close notification drawer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div data-slot="notification-center-tabs" className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              data-slot="notification-center-tab"
              className={`${styles.tab_btn} ${activeTab === "all" ? styles.tab_active : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "unread"}
              data-slot="notification-center-tab"
              className={`${styles.tab_btn} ${activeTab === "unread" ? styles.tab_active : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "approval"}
              data-slot="notification-center-tab"
              className={`${styles.tab_btn} ${activeTab === "approval" ? styles.tab_active : ""}`}
              onClick={() => setActiveTab("approval")}
            >
              Approvals
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "system"}
              data-slot="notification-center-tab"
              className={`${styles.tab_btn} ${activeTab === "system" ? styles.tab_active : ""}`}
              onClick={() => setActiveTab("system")}
            >
              System
            </button>
          </div>

          <div data-slot="notification-center-list" className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.empty_state}>
                <Bell size={32} aria-hidden="true" />
                <p>No notifications to display.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  data-slot="notification-center-item"
                  data-unread={Boolean(item.unread)}
                  className={`${styles.item} ${item.unread ? styles.item_unread : ""}`}
                  onClick={() => item.unread && onMarkAsRead?.(item.id)}
                >
                  <div className={styles.item_header}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2, 8px)" }}>
                      {item.category && categoryIconMap[item.category]}
                      <h4 data-slot="notification-center-item-title" className={styles.item_title}>
                        {item.title}
                      </h4>
                    </div>
                    {item.priority && (
                      <Badge variant={priorityVariantMap[item.priority]} size="sm">
                        {item.priority}
                      </Badge>
                    )}
                  </div>

                  <p data-slot="notification-center-item-message" className={styles.item_message}>
                    {item.message}
                  </p>

                  <div data-slot="notification-center-item-footer" className={styles.item_footer}>
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
            <div data-slot="notification-center-footer" className={styles.footer}>
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                Clear all notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NotificationCenter.displayName = "NotificationCenter";
