import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "./error-boundary";
import { Button } from "../button";
import { Badge } from "../badge";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Primitives/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### ErrorBoundary — Resilient React Component Crash Isolation

The **ErrorBoundary** primitive captures unhandled runtime JavaScript exceptions thrown within its child component subtree, isolates faults, and renders an accessible fallback recovery card with incident tracking and stack diagnostics.

#### Strata Design Specifications
- **Graceful Fault Containment**: Isolates exceptions within specific panels, widgets, or data grids without impacting sibling tabs or active document sessions.
- **Incident ID Attribution**: Attaches tracking identifier (e.g. \`INC-4820-A7\`) for immediate support correlation.
- **Diagnostics Inspection**: Integrated expandable trace viewer with one-click clipboard diagnostic copy.
- **Interactive Recovery**: Smooth "Try Again" retry action that resets local fault state and re-mounts the child subtree.
- **WCAG 2.2 AA Compliance**: Uses \`role="alert"\` and \`aria-live="assertive"\` with high-contrast icon and accessible buttons.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Primary failure heading displayed in the default error card.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Something went wrong" },
      },
    },
    description: {
      control: "text",
      description: "Descriptive explanation and recovery guidance for the user.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "An unexpected error occurred while rendering this component." },
      },
    },
    incidentId: {
      control: "text",
      description: "Enterprise tracking code for telemetry and customer support.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "INC-4820-A7" },
      },
    },
    showDetails: {
      control: "boolean",
      description: "Whether to render expandable stack trace diagnostics for engineers.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    variant: {
      control: "select",
      options: ["card", "inline"],
      description: "Display density format.",
      table: {
        type: { summary: '"card" | "inline"' },
        defaultValue: { summary: "card" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

function BuggyLedgerComponent({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Simulated runtime exception: Failed to parse GL ledger record at journal row #42 (NullReferenceException in FiscalPeriodReconciler).");
  }

  return (
    <div
      style={{
        padding: "var(--space-4)",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
          General Ledger Widget — Period Q3 2026
        </span>
        <Badge variant="success" size="sm">ONLINE</Badge>
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
        Active accounts reconciled: 1,420 entries ($4,829,102.50 USD balance).
      </p>
    </div>
  );
}

function InteractiveErrorBoundarySandbox() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 480 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--space-2) var(--space-3)",
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Interactive Fault Simulator:
        </span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!shouldCrash ? (
            <Button
              variant="danger"
              size="xs"
              onClick={() => setShouldCrash(true)}
            >
              Simulate Runtime Crash
            </Button>
          ) : (
            <Button
              variant="primary"
              size="xs"
              onClick={() => {
                setShouldCrash(false);
                setResetKey((k) => k + 1);
              }}
            >
              Restore Safe State
            </Button>
          )}
        </div>
      </div>

      <ErrorBoundary
        key={resetKey}
        incidentId="INC-9482-GL"
        title="General Ledger Rendering Failed"
        description="A simulated unhandled error was intercepted by the UniERP ErrorBoundary primitive."
        showDetails
        onReset={() => {
          setShouldCrash(false);
          setResetKey((k) => k + 1);
        }}
      >
        <BuggyLedgerComponent shouldCrash={shouldCrash} />
      </ErrorBoundary>
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveErrorBoundarySandbox />,
};

export const Healthy: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ErrorBoundary incidentId="INC-HEALTHY-01">
        <BuggyLedgerComponent shouldCrash={false} />
      </ErrorBoundary>
    </div>
  ),
};

export const CaughtError: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ErrorBoundary
        incidentId="INC-7721-RECON"
        title="Ledger Reconciliation Exception"
        description="Floating point overflow detected during VAT rate aggregation."
        showDetails
      >
        <BuggyLedgerComponent shouldCrash={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const CustomFallback: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <ErrorBoundary
        fallback={
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-bg-muted)",
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Custom minimal fallback UI: Please check back later.</span>
            <Button variant="outline" size="xs" onClick={() => window.location.reload()}>
              Refresh App
            </Button>
          </div>
        }
      >
        <BuggyLedgerComponent shouldCrash={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded anatomy of ErrorBoundary: icon shield, incident ID badge, retry button, copy diagnostic button, and collapsible stack trace.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 480 }}>
      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Fault Isolation Card Anatomy
        </div>
        <ErrorBoundary
          incidentId="INC-ANATOMY-01"
          title="Tax Calculation Engine Interrupted"
          description="A floating-point arithmetic overflow occurred during VAT reconciliation."
          showDetails
        >
          <BuggyLedgerComponent shouldCrash={true} />
        </ErrorBoundary>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Complete matrix of ErrorBoundary states: Healthy active subtree, Caught error card with incident tracking, and Custom minimal fallback.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 480 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Healthy Child Subtree (Normal Operation)
        </div>
        <ErrorBoundary incidentId="INC-NORMAL">
          <BuggyLedgerComponent shouldCrash={false} />
        </ErrorBoundary>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          2. Caught Runtime Error with Incident ID &amp; Diagnostics
        </div>
        <ErrorBoundary
          incidentId="INC-8832-TX"
          title="Tax Withholding Engine Interrupted"
          description="NullReferenceException caught during transaction settlement calculation."
          showDetails
        >
          <BuggyLedgerComponent shouldCrash={true} />
        </ErrorBoundary>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          3. Custom Minimal Fallback Layout
        </div>
        <ErrorBoundary
          fallback={
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-bg-sunken)",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
              }}
            >
              Custom lightweight fallback message rendered in place of crashed component.
            </div>
          }
        >
          <BuggyLedgerComponent shouldCrash={true} />
        </ErrorBoundary>
      </div>
    </div>
  ),
};
