"use client";

import { type FC } from "react";
import { Spinner } from "../../primitives/spinner";
import { Button } from "../../primitives/button";
import { EmptyState } from "./empty-state";
import { AlertTriangle, ShieldAlert, Filter, AlertCircle } from "lucide-react";
import styles from "./empty-state.module.css";

export { EmptyState };

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: FC<LoadingStateProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={`${styles.loadingState} ${className}`.trim()}
      data-slot="loading-state"
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" data-slot="loading-state-spinner" />
      <span className={styles.loadingMessage} data-slot="loading-state-message">{message}</span>
    </div>
  );
};

export interface FilteredEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const FilteredEmptyState: FC<FilteredEmptyStateProps> = ({
  title = "No matching records",
  description = "No results found for the current filters.",
  onClearFilters,
  density = "standard",
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
      density={density}
      data-slot="filtered-empty-state"
      icon={<Filter size={24} className={styles.filterIcon} />}
      title={title}
      description={description}
      action={
        onClearFilters ? (
          <Button variant="primary" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : undefined
      }
    />
  );
};

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Failed to load data. Please try again.",
  onRetry,
  density = "standard",
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
      density={density}
      data-slot="error-state"
      icon={<AlertTriangle size={24} className={styles.dangerIcon} />}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  );
};

export interface ForbiddenStateProps {
  title?: string;
  description?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ForbiddenState: FC<ForbiddenStateProps> = ({
  title = "Access restricted",
  description = "You do not have permission to view this ledger partition.",
  density = "standard",
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
      density={density}
      data-slot="forbidden-state"
      icon={<ShieldAlert size={24} className={styles.warningIcon} />}
      title={title}
      description={description}
    />
  );
};

export interface PartialStateProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const PartialState: FC<PartialStateProps> = ({
  title = "Partial data loaded",
  description = "Some partition nodes could not be retrieved.",
  onRefresh,
  density = "standard",
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
      density={density}
      data-slot="partial-state"
      icon={<AlertCircle size={24} className={styles.warningIcon} />}
      title={title}
      description={description}
      action={
        onRefresh ? (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Retry missing nodes
          </Button>
        ) : undefined
      }
    />
  );
};
