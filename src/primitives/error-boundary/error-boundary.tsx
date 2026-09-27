"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./error-boundary.module.css";

/**
 * Class variance authority definitions for ErrorBoundary.
 * Compatible with React Spectrum / Carbon UI error recovery benchmark.
 */
export const errorBoundaryVariants = cva(styles.card, {
  variants: {
    variant: {
      card: styles.card,
      inline: styles.inline,
    },
  },
  defaultVariants: {
    variant: "card",
  },
});

export interface ErrorBoundaryProps
  extends VariantProps<typeof errorBoundaryVariants> {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  incidentId?: string;
  showDetails?: boolean;
  variant?: "card" | "inline";
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showErrorDetails: boolean;
  copied: boolean;
  isRetrying: boolean;
}

/**
 * `<ErrorBoundary>` — Fault-isolation boundary capturing render errors with incident ID reporting.
 * Standardized with cva, data-slot, and Spectrum/Carbon enterprise error recovery patterns.
 * @maturity stable
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public override state: State = {
    hasError: false,
    error: null,
    showErrorDetails: false,
    copied: false,
    isRetrying: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, showErrorDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ isRetrying: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, showErrorDetails: false, isRetrying: false });
      this.props.onReset?.();
    }, 120);
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showErrorDetails: !prev.showErrorDetails }));
  };

  private handleCopy = () => {
    const errorText = this.state.error?.stack || this.state.error?.message || "Unknown error";
    const incident = this.props.incidentId ?? "INC-ERR-7821";
    const payload = `Incident ID: ${incident}\nComponent Failure: ${this.props.title ?? "Error"}\n\n${errorText}`;
    navigator.clipboard?.writeText(payload).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
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
      const incidentId = this.props.incidentId ?? "INC-4820-A7";
      const variant = this.props.variant ?? "card";
      const containerClass = errorBoundaryVariants({ variant, className: this.props.className });

      return (
        <div
          role="alert"
          aria-live="assertive"
          data-slot="error-boundary"
          data-variant={variant}
          className={containerClass}
        >
          <div data-slot="error-boundary-header" className={styles.header}>
            <div data-slot="error-boundary-icon" className={styles.iconContainer} aria-hidden="true">
              <AlertTriangle size={20} className={styles.icon} />
            </div>
            <div className={styles.textContainer}>
              <div className={styles.titleRow}>
                <h3 data-slot="error-boundary-title" className={styles.title}>
                  {title}
                </h3>
                <span data-slot="error-boundary-incident" className={styles.incidentBadge}>
                  ID: {incidentId}
                </span>
              </div>
              <p data-slot="error-boundary-description" className={styles.description}>
                {description}
              </p>
            </div>
          </div>

          <div data-slot="error-boundary-footer" className={styles.footer}>
            <div className={styles.actionGroup}>
              <button
                type="button"
                data-slot="error-boundary-retry"
                className={styles.retryButton}
                onClick={this.handleReset}
              >
                <RefreshCw
                  size={14}
                  style={this.state.isRetrying ? { animation: "spin 1s linear infinite" } : undefined}
                />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                data-slot="error-boundary-copy"
                className={styles.copyButton}
                onClick={this.handleCopy}
                aria-label="Copy incident diagnostic info"
              >
                {this.state.copied ? <Check size={14} style={{ color: "var(--color-success)" }} /> : <Copy size={14} />}
                <span>{this.state.copied ? "Copied" : "Copy Diagnostic"}</span>
              </button>
            </div>

            {this.props.showDetails && this.state.error && (
              <button
                type="button"
                data-slot="error-boundary-details-toggle"
                className={styles.detailsToggle}
                onClick={this.toggleDetails}
              >
                {this.state.showErrorDetails ? (
                  <>
                    <span>Hide Error Details</span>
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>Show Error Details</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>

          {this.state.showErrorDetails && this.state.error && (
            <pre
              data-slot="error-boundary-trace"
              className={styles.errorTrace}
              tabIndex={0}
              aria-label="Error stack trace"
            >
              <code>{this.state.error.stack || this.state.error.message}</code>
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
