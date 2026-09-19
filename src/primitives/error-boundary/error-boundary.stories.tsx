import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "./error-boundary";
import { Button } from "../button";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Primitives/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### ErrorBoundary — Resilient React Component Crash Isolation

The **ErrorBoundary** primitive captures unhandled runtime JavaScript exceptions thrown within its child component subtree, logs telemetry, and renders an accessible fallback recovery view instead of allowing the entire enterprise workspace to crash.

#### Strata Design Specifications
- **Graceful Fault Containment**: Isolates exceptions within specific panels, widgets, or data grids without impacting sibling tabs or active document sessions.
- **Recovery Action**: Provides integrated "Try Again" reset handler via \`onReset()\` to clear failure state and retry rendering.
- **Diagnostics Inspection**: Configurable \`showDetails\` drawer to inspect stack trace in staging/development environments while masking sensitive internals in production.
- **WCAG 2.2 AA Compliance**: Fallback container uses \`role="alert"\` and \`aria-live="assertive"\` with high-contrast icon and typography hierarchy.
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
    showDetails: {
      control: "boolean",
      description: "Whether to render expandable stack trace diagnostics for engineers.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    fallback: {
      control: false,
      description: "Custom replacement JSX rendered instead of the default error card.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    onReset: {
      action: "reset",
      description: "Callback invoked when user clicks the retry button.",
      table: {
        type: { summary: "() => void" },
      },
    },
    onError: {
      action: "error",
      description: "Telemetry hook called when an error is caught.",
      table: {
        type: { summary: "(error: Error, errorInfo: ErrorInfo) => void" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

function CrashingChild({ shouldCrash }: { shouldCrash: boolean }) {
  if (shouldCrash) {
    throw new Error("Simulated runtime error: Failed to parse remote ledger record at row 42.");
  }
  return (
    <div
      style={{
        padding: "var(--space-4)",
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text)",
      }}
    >
      Financial Ledger widget loaded normally without exceptions.
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ width: 440 }}>
      <ErrorBoundary title="General Ledger Rendering Failed" showDetails>
        <CrashingChild shouldCrash={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const Healthy: Story = {
  render: () => (
    <div style={{ width: 440 }}>
      <ErrorBoundary>
        <CrashingChild shouldCrash={false} />
      </ErrorBoundary>
    </div>
  ),
};

export const CaughtError: Story = {
  render: () => (
    <div style={{ width: 440 }}>
      <ErrorBoundary showDetails title="General Ledger Rendering Failed">
        <CrashingChild shouldCrash={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const CustomFallback: Story = {
  render: () => (
    <div style={{ width: 440 }}>
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
            }}
          >
            Custom minimal fallback UI: Please refresh the application.
          </div>
        }
      >
        <CrashingChild shouldCrash={true} />
      </ErrorBoundary>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded anatomy of the ErrorBoundary fallback card: failure alert badge, header message, retry action button, and expandable diagnostic trace.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 460 }}>
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
          Fault Isolation Boundary (Card Anatomy)
        </div>
        <ErrorBoundary
          title="Tax Calculation Engine Interrupted"
          description="A floating-point arithmetic overflow occurred during VAT reconciliation."
          showDetails
        >
          <CrashingChild shouldCrash={true} />
        </ErrorBoundary>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Interactive simulation matrix demonstrating both Healthy, Caught Error, and Reset recovery states.",
      },
    },
  },
  render: () => {
    const [shouldCrash, setShouldCrash] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 460 }}>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button
            variant="danger"
            size="xs"
            onClick={() => setShouldCrash(true)}
          >
            Trigger Exception
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setShouldCrash(false);
              setResetKey((k) => k + 1);
            }}
          >
            Reset Simulation
          </Button>
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
          <CrashingChild shouldCrash={shouldCrash} />
        </ErrorBoundary>
      </div>
    );
  },
};
