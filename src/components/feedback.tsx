"use client";

import { type FC, type ReactNode, type CSSProperties } from "react";
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
