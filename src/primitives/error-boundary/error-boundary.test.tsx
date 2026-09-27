import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ErrorBoundary } from "./error-boundary";

function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test explosion");
  }
  return <div>Safe Content</div>;
}

describe("ErrorBoundary Component", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("catches render errors and renders fallback card", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  it("renders custom fallback node if provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom Crash View</div>}>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom Crash View")).toBeInTheDocument();
  });

  it("toggles error stack details when showDetails is enabled", () => {
    render(
      <ErrorBoundary showDetails>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>,
    );

    const toggleBtn = screen.getByRole("button", { name: /show error details/i });
    expect(screen.queryByText(/test explosion/i)).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText(/test explosion/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations in healthy state", async () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Accessible Child</div>
      </ErrorBoundary>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in error state", async () => {
    const { container } = render(
      <ErrorBoundary>
        <Thrower shouldThrow={true} />
      </ErrorBoundary>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
