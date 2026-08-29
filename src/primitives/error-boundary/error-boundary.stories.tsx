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
