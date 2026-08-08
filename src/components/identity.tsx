"use client";

import { type FC, type ReactNode, type CSSProperties } from "react";
import {
  User,
  Wifi,
  WifiOff,
  Clock,
  MinusCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  Heart,
  X,
} from "lucide-react";

// ── Avatar ────────────────────────────────────────────
// B09: fallbacks are DETERMINISTIC — same name always = same colour,
//   never exposes an email, uses only design tokens for colours.

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string;
  /** Display name — used for initials fallback and alt text. */
  name?: string;
  size?: AvatarSize;
  /** ID to override the deterministic colour palette index. */
  colorIndex?: number;
}

const SIZES: Record<AvatarSize, number> = {
  xs: 20,
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
};

/** Deterministic palette — pure design tokens; no hardcoded colours. */
const AVATAR_PALETTE_VARS = [
  { bg: "var(--color-avatar-0-bg, #e0e7ff)", fg: "var(--color-avatar-0-fg, #4338ca)" },
  { bg: "var(--color-avatar-1-bg, #fce7f3)", fg: "var(--color-avatar-1-fg, #be185d)" },
  { bg: "var(--color-avatar-2-bg, #dcfce7)", fg: "var(--color-avatar-2-fg, #15803d)" },
  { bg: "var(--color-avatar-3-bg, #fef3c7)", fg: "var(--color-avatar-3-fg, #b45309)" },
  { bg: "var(--color-avatar-4-bg, #fce7f3)", fg: "var(--color-avatar-4-fg, #7c3aed)" },
  { bg: "var(--color-avatar-5-bg, #cffafe)", fg: "var(--color-avatar-5-fg, #0e7490)" },
  { bg: "var(--color-avatar-6-bg, #fee2e2)", fg: "var(--color-avatar-6-fg, #b91c1c)" },
  { bg: "var(--color-avatar-7-bg, #f0fdf4)", fg: "var(--color-avatar-7-fg, #166534)" },
];

/** Hash a string deterministically to a palette index. No email exposure risk. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return h % AVATAR_PALETTE_VARS.length;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: FC<AvatarProps> = ({ src, name = "", size = "md", colorIndex }) => {
  const px = SIZES[size];
  const initials = getInitials(name);
  const paletteIdx = colorIndex !== undefined ? colorIndex % AVATAR_PALETTE_VARS.length : hashName(name || "?");
  const palette = AVATAR_PALETTE_VARS[paletteIdx] || AVATAR_PALETTE_VARS[0]!;

  return (
    <div
      aria-label={name || "User avatar"}
      role="img"
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: "50%",
        background: palette.bg,
        color: palette.fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: `${Math.round(px * 0.38)}px`,
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {src ? (
        <img src={src} alt={name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <User size={px * 0.5} aria-hidden="true" />
      )}
    </div>
  );
};

// ── AvatarGroup ───────────────────────────────────────
export interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[];
  max?: number;
  size?: AvatarSize;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({ avatars, max = 3, size = "sm" }) => {
  const visible = avatars.slice(0, max);
  const extra = avatars.length - max;

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center" }}
      aria-label={`${avatars.length} people`}
    >
      {visible.map((a, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? "-8px" : 0 }}>
          <Avatar src={a.src} name={a.name} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: "-8px",
            width: `${SIZES[size]}px`,
            height: `${SIZES[size]}px`,
            borderRadius: "50%",
            background: "var(--color-bg-sunken)",
            border: "1px solid var(--color-border)",
            fontSize: "10px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={`${extra} more`}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

// ── Presence ──────────────────────────────────────────
// B09: Every status carries a NON-COLOUR cue (icon + label) for colour-blind users.

export type PresenceStatus = "online" | "offline" | "busy" | "away";

export interface PresenceProps {
  status: PresenceStatus;
  /** Show full label text alongside the indicator (default: false = icon only). */
  showLabel?: boolean;
  style?: CSSProperties;
}

const PRESENCE_META: Record<
  PresenceStatus,
  { label: string; color: string; Icon: FC<{ size?: number; "aria-hidden"?: boolean }> }
> = {
  online: {
    label: "Online",
    color: "var(--color-success, #22c55e)",
    Icon: ({ size, ...rest }) => <Wifi size={size} {...rest} />,
  },
  offline: {
    label: "Offline",
    color: "var(--color-text-muted, #9ca3af)",
    Icon: ({ size, ...rest }) => <WifiOff size={size} {...rest} />,
  },
  busy: {
    label: "Busy",
    color: "var(--color-danger, #ef4444)",
    Icon: ({ size, ...rest }) => <MinusCircle size={size} {...rest} />,
  },
  away: {
    label: "Away",
    color: "var(--color-warning, #eab308)",
    Icon: ({ size, ...rest }) => <Clock size={size} {...rest} />,
  },
};

export const Presence: FC<PresenceProps> = ({ status, showLabel = false, style }) => {
  const meta = PRESENCE_META[status];
  const { Icon } = meta;

  return (
    <span
      aria-label={meta.label}
      title={meta.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        color: meta.color,
        ...style,
      }}
    >
      {/* Icon provides non-colour cue for colour-blind users */}
      <Icon size={10} aria-hidden />
      {showLabel && (
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 500 }}>{meta.label}</span>
      )}
    </span>
  );
};

// ── UserChip ──────────────────────────────────────────
export interface UserChipProps {
  name: string;
  role?: string;
  avatarSrc?: string;
  status?: PresenceStatus;
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
        {status && (
          <Presence
            status={status}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)" }}>
          {name}
        </span>
        {role && (
          <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>{role}</span>
        )}
      </div>
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────
export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "var(--color-bg-sunken)", text: "var(--color-text-secondary)" },
  primary: { bg: "var(--color-primary-light, #e0e7ff)", text: "var(--color-primary, #4338ca)" },
  success: { bg: "var(--color-success-light, #dcfce7)", text: "var(--color-success, #15803d)" },
  warning: { bg: "var(--color-warning-light, #fef3c7)", text: "var(--color-warning, #b45309)" },
  danger: { bg: "var(--color-danger-light, #fee2e2)", text: "var(--color-danger, #b91c1c)" },
  info: { bg: "var(--color-info-light, #cffafe)", text: "var(--color-info, #0e7490)" },
};

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ variant = "default", children }) => {
  const colors = BADGE_COLORS[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px var(--space-2)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        background: colors.bg,
        color: colors.text,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

// ── Tag ───────────────────────────────────────────────
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
          aria-label="Remove tag"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1 }}
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
};

// ── PriorityIndicator ─────────────────────────────────
// B09: each priority has colour + icon (non-colour cue) + text label.
export type Priority = "low" | "medium" | "high" | "urgent";

const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; Icon: FC<{ size?: number; "aria-hidden"?: boolean }> }
> = {
  low: {
    label: "Low",
    color: "var(--color-text-muted)",
    Icon: ({ size, ...rest }) => <ArrowDown size={size} {...rest} />,
  },
  medium: {
    label: "Medium",
    color: "var(--color-info, #0e7490)",
    Icon: ({ size, ...rest }) => <ArrowRight size={size} {...rest} />,
  },
  high: {
    label: "High",
    color: "var(--color-warning, #b45309)",
    Icon: ({ size, ...rest }) => <ArrowUp size={size} {...rest} />,
  },
  urgent: {
    label: "Urgent",
    color: "var(--color-danger, #b91c1c)",
    Icon: ({ size, ...rest }) => <AlertTriangle size={size} {...rest} />,
  },
};

export interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
}

export const PriorityIndicator: FC<PriorityIndicatorProps> = ({
  priority,
  showLabel = true,
}) => {
  const meta = PRIORITY_META[priority];
  const { Icon } = meta;
  return (
    <span
      aria-label={`Priority: ${meta.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-xs)",
        color: meta.color,
        fontWeight: 600,
      }}
    >
      <Icon size={12} aria-hidden />
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
};

// ── HealthScore ───────────────────────────────────────
// B09: colour + numeric value + icon — colour-blind users read the number.
export interface HealthScoreProps {
  score: number; // 0 to 100
}

export const HealthScore: FC<HealthScoreProps> = ({ score }) => {
  const color =
    score >= 80
      ? "var(--color-success, #15803d)"
      : score >= 50
        ? "var(--color-warning, #b45309)"
        : "var(--color-danger, #b91c1c)";
  const label = score >= 80 ? "Good" : score >= 50 ? "Fair" : "Poor";

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
      aria-label={`Health score: ${score}% (${label})`}
    >
      <Heart size={14} style={{ color }} aria-hidden />
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color }}>
        {score}%
        <span style={{ fontWeight: 400, marginLeft: "var(--space-1)" }}>({label})</span>
      </span>
    </div>
  );
};
