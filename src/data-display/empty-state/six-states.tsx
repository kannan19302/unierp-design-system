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
    <div className={`${styles.loadingState} ${className}`.trim()} role="status" aria-live="polite">
      <Spinner size="lg" />
      <span className={styles.loadingMessage}>{message}</span>
    </div>
  );
};

export interface FilteredEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  className?: string;
}

export const FilteredEmptyState: FC<FilteredEmptyStateProps> = ({
  title = "No matching records",
  description = "No results found for the current filters.",
  onClearFilters,
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
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
  className?: string;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Failed to load data. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
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
  className?: string;
}

export const ForbiddenState: FC<ForbiddenStateProps> = ({
  title = "Access restricted",
  description = "You do not have permission to view this ledger partition.",
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
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
  className?: string;
}

export const PartialState: FC<PartialStateProps> = ({
  title = "Partial data loaded",
  description = "Some partition nodes could not be retrieved.",
  onRefresh,
  className = "",
}) => {
  return (
    <EmptyState
      className={className}
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
