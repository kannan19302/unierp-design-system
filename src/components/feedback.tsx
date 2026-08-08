"use client";

import { type FC, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { Spinner } from "./spinner";

export type FeedbackVariant = "info" | "success" | "warning" | "danger";

const VARIANT_COLORS: Record<FeedbackVariant, { bg: string; border: string; text: string; iconColor: string }> = {
  info: {
    bg: "var(--color-info-light, rgba(59, 130, 246, 0.08))",
    border: "var(--color-primary)",
    text: "var(--color-text)",
    iconColor: "var(--color-primary)",
  },
  success: {
    bg: "var(--color-success-light, rgba(34, 197, 94, 0.08))",
    border: "var(--color-success)",
    text: "var(--color-text)",
    iconColor: "var(--color-success)",
  },
  warning: {
    bg: "var(--color-warning-light, rgba(234, 179, 8, 0.08))",
    border: "var(--color-warning)",
    text: "var(--color-text)",
    iconColor: "var(--color-warning)",
  },
  danger: {
    bg: "var(--color-danger-light, rgba(239, 68, 68, 0.08))",
    border: "var(--color-danger)",
    text: "var(--color-text)",
    iconColor: "var(--color-danger)",
  },
};

const Icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

// ── Alert ─────────────────────────────────────────────
export interface AlertProps {
  variant?: FeedbackVariant;
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
}

export const Alert: FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  action,
}) => {
  const meta = VARIANT_COLORS[variant];
  const IconComponent = Icons[variant];

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        borderRadius: "var(--radius-md)",
        color: meta.text,
        fontSize: "var(--text-sm)",
      }}
    >
      <IconComponent size={18} style={{ color: meta.iconColor, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div>{children}</div>}
      </div>
      {action && <div>{action}</div>}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss alert"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: meta.iconColor }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// ── Banner ────────────────────────────────────────────
export interface BannerProps {
  variant?: FeedbackVariant;
  children: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
}

export const Banner: FC<BannerProps> = ({ variant = "info", children, onClose, action }) => {
  const meta = VARIANT_COLORS[variant];
  return (
    <div
      role="banner"
      style={{
        width: "100%",
        padding: "var(--space-2) var(--space-4)",
        background: meta.bg,
        borderBottom: `1px solid ${meta.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "var(--text-sm)",
        color: meta.text,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>{children}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        {action}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Dismiss banner"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// ── InlineMessage ─────────────────────────────────────
export interface InlineMessageProps {
  variant?: FeedbackVariant;
  children: ReactNode;
}

export const InlineMessage: FC<InlineMessageProps> = ({ variant = "info", children }) => {
  const meta = VARIANT_COLORS[variant];
  const IconComponent = Icons[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1-5)",
        fontSize: "var(--text-xs)",
        color: meta.iconColor,
      }}
    >
      <IconComponent size={14} />
      <span>{children}</span>
    </span>
  );
};

// ── Progress & ProgressCircle ────────────────────────
export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export const Progress: FC<ProgressProps> = ({ value, max = 100, label, showPercent = false }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: "100%" }}>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={0}
        style={{
          width: "100%",
          height: "8px",
          background: "var(--color-bg-sunken)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--color-primary)",
            transition: "width var(--duration-normal) var(--ease-default)",
          }}
        />
      </div>
    </div>
  );
};

export const ProgressCircle: FC<{ value: number; size?: number }> = ({ value, size = 32 }) => {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-bg-sunken)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset var(--duration-normal) var(--ease-default)" }}
      />
    </svg>
  );
};

// ── LoadingOverlay ────────────────────────────────────
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ visible, message }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
      }}
    >
      <Spinner size="md" />
      {message && <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{message}</span>}
    </div>
  );
};

// ── Toast system ──────────────────────────────────────
// Single notification surface: one queue, deduplication, live region announcement.

import { useState, useEffect as _useEffect, useCallback as _useCallback, createContext, useContext } from "react";
import { createPortal as _createPortal } from "react-dom";

export type ToastVariant = FeedbackVariant;

export interface ToastItem {
  id: string;
  /** Deduplication key — same key = same toast. Omit for always-unique. */
  key?: string;
  message: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss after ms. Default 4000. Set to 0 to require manual dismiss. */
  duration?: number;
}

interface ToastState {
  queue: ToastItem[];
  add: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastState | null>(null);

/** Wrap your app in <ToastProvider> to enable toast notifications. */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const add = _useCallback((toast: Omit<ToastItem, "id">) => {
    setQueue((prev) => {
      // Deduplication: if a key exists and is already in the queue, skip
      if (toast.key && prev.some((t) => t.key === toast.key)) {
        return prev;
      }
      // Burst protection: cap queue at 5 visible toasts
      const capped = prev.length >= 5 ? prev.slice(1) : prev;
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return [...capped, { ...toast, id }];
    });
  }, []);

  const dismiss = _useCallback((id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ queue, add, dismiss }}>
      {children}
      <ToastRegion queue={queue} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

/** useToast — returns the add/dismiss functions for triggering toasts. */
export function useToast(): Pick<ToastState, "add" | "dismiss"> {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return { add: ctx.add, dismiss: ctx.dismiss };
}

// ── Toast region (aria-live) ──────────────────────────
interface ToastRegionProps {
  queue: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastRegion: FC<ToastRegionProps> = ({ queue, onDismiss }) => {
  const [mounted, setMounted] = useState(false);
  _useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return _createPortal(
    <div
      // aria-live="polite" ensures screen readers announce each new toast.
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions"
      style={{
        position: "fixed",
        bottom: "var(--space-5)",
        right: "var(--space-5)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        maxWidth: "360px",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      {queue.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
};

// ── Toast card ────────────────────────────────────────
const ToastCard: FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const duration = toast.duration ?? 4000;
  const meta = VARIANT_COLORS[toast.variant ?? "info"];
  const IconComponent = Icons[toast.variant ?? "info"];

  _useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        background: "var(--color-bg-elevated)",
        border: `1px solid ${meta.border}`,
        borderLeft: `4px solid ${meta.border}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        fontSize: "var(--text-sm)",
        color: meta.text,
        pointerEvents: "all",
      }}
    >
      <IconComponent size={16} style={{ color: meta.iconColor, flexShrink: 0, marginTop: 2 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "var(--color-text-muted)",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
