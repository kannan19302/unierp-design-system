"use client";

import { type FC, type ReactNode } from "react";
import { User, AlertCircle, CheckCircle, Flame, Heart } from "lucide-react";

// ── Avatar & AvatarGroup ──────────────────────────────
export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: 24,
  md: 36,
  lg: 48,
};

export const Avatar: FC<AvatarProps> = ({ src, name = "", size = "md" }) => {
  const px = SIZES[size];
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <div
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: "50%",
        background: "var(--color-primary-light, #e0e7ff)",
        color: "var(--color-primary, #3b82f6)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: `${px * 0.4}px`,
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        flexShrink: 0,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : initials ? (
        initials
      ) : (
        <User size={px * 0.5} />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[];
  max?: number;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({ avatars, max = 3 }) => {
  const visible = avatars.slice(0, max);
  const extra = avatars.length - max;

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {visible.map((a, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? "-8px" : 0 }}>
          <Avatar src={a.src} name={a.name} size="sm" />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: "-8px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "var(--color-bg-sunken)",
            border: "1px solid var(--color-border)",
            fontSize: "10px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

// ── UserChip & Presence ───────────────────────────────
export interface UserChipProps {
  name: string;
  role?: string;
  avatarSrc?: string;
  status?: "online" | "offline" | "busy" | "away";
}

export const UserChip: FC<UserChipProps> = ({ name, role, avatarSrc, status }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-full)",
        background: "var(--color-bg-sunken)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ position: "relative" }}>
        <Avatar src={avatarSrc} name={name} size="sm" />
        {status && <Presence status={status} style={{ position: "absolute", bottom: 0, right: 0 }} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)" }}>{name}</span>
        {role && <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>{role}</span>}
      </div>
    </div>
  );
};

export interface PresenceProps {
  status: "online" | "offline" | "busy" | "away";
  style?: React.CSSProperties;
}

const PRESENCE_COLORS = {
  online: "var(--color-success, #22c55e)",
  offline: "var(--color-text-muted, #9ca3af)",
  busy: "var(--color-danger, #ef4444)",
  away: "var(--color-warning, #eab308)",
};

export const Presence: FC<PresenceProps> = ({ status, style }) => {
  return (
    <span
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: PRESENCE_COLORS[status],
        border: "1px solid #ffffff",
        display: "inline-block",
        ...style,
      }}
    />
  );
};

// ── Tag, PriorityIndicator, HealthScore ───────────────
export interface TagProps {
  children: ReactNode;
  onRemove?: () => void;
}

export const Tag: FC<TagProps> = ({ children, onRemove }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: "2px var(--space-2)",
        borderRadius: "var(--radius-sm)",
        background: "var(--color-bg-sunken)",
        border: "1px solid var(--color-border)",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: 0 }}
        >
          ×
        </button>
      )}
    </span>
  );
};

export interface PriorityIndicatorProps {
  priority: "low" | "medium" | "high" | "urgent";
}

const PRIORITY_META = {
  low: { label: "Low", color: "var(--color-text-muted)", icon: "↓" },
  medium: { label: "Medium", color: "var(--color-info)", icon: "→" },
  high: { label: "High", color: "var(--color-warning)", icon: "↑" },
  urgent: { label: "Urgent", color: "var(--color-danger)", icon: "🔥" },
};

export const PriorityIndicator: FC<PriorityIndicatorProps> = ({ priority }) => {
  const meta = PRIORITY_META[priority];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-xs)", color: meta.color, fontWeight: 600 }}>
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
};

export interface HealthScoreProps {
  score: number; // 0 to 100
}

export const HealthScore: FC<HealthScoreProps> = ({ score }) => {
  const color = score >= 80 ? "var(--color-success)" : score >= 50 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Heart size={14} style={{ color }} />
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color }}>{score}%</span>
    </div>
  );
};
