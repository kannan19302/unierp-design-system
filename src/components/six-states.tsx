"use client";

import { type FC } from "react";
import { Spinner } from "./spinner";
import { EmptyState } from "./empty-state";
import { AlertTriangle, ShieldAlert, Filter, AlertCircle } from "lucide-react";

export { EmptyState };

// ── LoadingState ──────────────────────────────────────
export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: FC<LoadingStateProps> = ({ message = "Loading..." }: any) => {
  return (
    <div
      style={{
        padding: "var(--space-12) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-3)",
      }}
    >
      <Spinner size="lg" />
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{message}</span>
    </div>
  );
};

// ── FilteredEmptyState ────────────────────────────────
export interface FilteredEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export const FilteredEmptyState: FC<FilteredEmptyStateProps> = ({
  title = "No matching records",
  description = "No results found for the current filters.",
  onClearFilters,
}: any) => {
  return (
    <EmptyState
      icon={<Filter size={32} style={{ color: "var(--color-text-muted)" }} />}
      title={title}
      description={description}
      action={
        onClearFilters ? (
          <button
            onClick={onClearFilters}
            style={{
              padding: "var(--space-2) var(--space-4)",
              background: "var(--color-primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Clear filters
          </button>
        ) : undefined
      }
    />
  );
};

// ── ErrorState ────────────────────────────────────────
export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Failed to load data. Please try again.",
  onRetry,
}: any) => {
  return (
    <EmptyState
      icon={<AlertTriangle size={32} style={{ color: "var(--color-danger)" }} />}
      title={title}
      description={description}
      action={
        onRetry ? (
          <button
            onClick={onRetry}
            style={{
              padding: "var(--space-2) var(--space-4)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        ) : undefined
      }
    />
  );
};

// ── ForbiddenState ────────────────────────────────────
export interface ForbiddenStateProps {
  title?: string;
  description?: string;
}

export const ForbiddenState: FC<ForbiddenStateProps> = ({
  title = "Access restricted",
  description = "You do not have permission to view this content.",
}: any) => {
  return (
    <EmptyState
      icon={<ShieldAlert size={32} style={{ color: "var(--color-warning)" }} />}
      title={title}
      description={description}
    />
  );
};

// ── PartialState ──────────────────────────────────────
export interface PartialStateProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export const PartialState: FC<PartialStateProps> = ({
  title = "Partial data loaded",
  description = "Some items could not be retrieved.",
  onRefresh,
}: any) => {
  return (
    <EmptyState
      icon={<AlertCircle size={32} style={{ color: "var(--color-warning)" }} />}
      title={title}
      description={description}
      action={
        onRefresh ? (
          <button
            onClick={onRefresh}
            style={{
              padding: "var(--space-2) var(--space-4)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        ) : undefined
      }
    />
  );
};
