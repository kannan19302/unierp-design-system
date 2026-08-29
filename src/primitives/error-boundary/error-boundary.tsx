"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./error-boundary.module.css";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  showDetails?: boolean;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showErrorDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public override state: State = {
    hasError: false,
    error: null,
    showErrorDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showErrorDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, showErrorDetails: false });
    this.props.onReset?.();
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showErrorDetails: !prev.showErrorDetails }));
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const title = this.props.title ?? "Something went wrong";
      const description =
        this.props.description ??
        "An unexpected error occurred while rendering this component. You can try refreshing or resetting the view.";

      return (
        <div
          role="alert"
          aria-live="assertive"
          className={cn(styles.card, this.props.className)}
        >
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <AlertTriangle size={20} className={styles.icon} />
            </div>
            <div className={styles.textContainer}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.retryButton}
              onClick={this.handleReset}
            >
              <RefreshCw size={14} />
              <span>Try Again</span>
            </button>

            {this.props.showDetails && this.state.error && (
              <button
                type="button"
                className={styles.detailsToggle}
                onClick={this.toggleDetails}
              >
                {this.state.showErrorDetails ? "Hide Error Details" : "Show Error Details"}
              </button>
            )}
          </div>

          {this.state.showErrorDetails && this.state.error && (
            <pre className={styles.errorTrace}>
              <code>{this.state.error.stack || this.state.error.message}</code>
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
