import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "./error-boundary";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Primitives/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

function CrashingChild({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Simulated runtime error: Failed to parse remote ledger record at row 42.");
  }
  return <div>Component rendered successfully without errors.</div>;
}

export const Healthy: Story = {
  render: () => (
    <ErrorBoundary>
      <CrashingChild shouldCrash={false} />
    </ErrorBoundary>
  ),
};

export const CaughtError: Story = {
  render: () => {
    return (
      <ErrorBoundary showDetails title="General Ledger Rendering Failed">
        <CrashingChild shouldCrash={true} />
      </ErrorBoundary>
    );
  },
};

export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary fallback={<div>Custom minimal fallback UI: Please check back later.</div>}>
      <CrashingChild shouldCrash={true} />
    </ErrorBoundary>
  ),
};

export const InteractiveCrashAndReset = () => {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 480 }}>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <button
          type="button"
          onClick={() => setShouldCrash(true)}
          style={{
            padding: "var(--space-1-5) var(--space-3)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-danger)",
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            cursor: "pointer",
          }}
        >
          Simulate Runtime Exception
        </button>
        <button
          type="button"
          onClick={() => {
            setShouldCrash(false);
            setResetKey((k) => k + 1);
          }}
          style={{
            padding: "var(--space-1-5) var(--space-3)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-surface)",
            color: "var(--color-text)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            cursor: "pointer",
          }}
        >
          Reset Simulation
        </button>
      </div>

      <ErrorBoundary
        key={resetKey}
        showDetails
        title="Ledger Reconciliation Exception"
        description="A simulated unhandled error was intercepted by the UniERP ErrorBoundary primitive."
        onReset={() => {
          setShouldCrash(false);
          setResetKey((k) => k + 1);
        }}
      >
        <div
          style={{
            padding: "var(--space-4)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-surface)",
          }}
        >
          <CrashingChild shouldCrash={shouldCrash} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
