import type { Meta, StoryObj } from "@storybook/react";
import { QualityGatesTable, type QualityGateRow } from "./quality-gates-table";

const meta: Meta<typeof QualityGatesTable> = {
  title: "Core/DataGrid/QualityGatesTable",
  component: QualityGatesTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QualityGatesTable>;

const PASSING_GATES: QualityGateRow[] = [
  {
    id: "qg-rls",
    name: "PostgreSQL RLS Positive & Negative Isolation",
    category: "security",
    required: true,
    status: "passed",
    evidence: "Verified with NOBYPASSRLS role (Acme 0001 isolated)",
    duration: "14.2s",
  },
  {
    id: "qg-typecheck",
    name: "TypeScript Strict & Dependency Layer Validation",
    category: "typecheck",
    required: true,
    status: "passed",
    evidence: "pnpm typecheck exited with code 0 (zero errors)",
    duration: "28.5s",
  },
  {
    id: "qg-a11y",
    name: "WCAG 2.2 AA Automated Screen Reader Audits",
    category: "a11y",
    required: true,
    status: "passed",
    evidence: "vitest-axe 374/374 stories verified (0 violations)",
    duration: "1m 12s",
  },
  {
    id: "qg-unit",
    name: "Domain Unit & Integration Test Suites",
    category: "test",
    required: true,
    status: "passed",
    evidence: "1,248 tests passed across 42 suites",
    duration: "45.1s",
  },
  {
    id: "qg-telemetry",
    name: "API Pino Structured Logging & OpenTelemetry Trace Gate",
    category: "telemetry",
    required: false,
    status: "passed",
    evidence: "Trace context propagation verified on HTTP handlers",
    duration: "8.9s",
  },
];

export const Default: Story = {
  args: {
    gates: PASSING_GATES,
    onViewDetails: (gate) => alert(`Viewing details for ${gate.name}`),
    onRerun: (gate) => alert(`Re-running gate ${gate.name}`),
  },
};

export const WithFailedGates: Story = {
  args: {
    gates: [
      ...PASSING_GATES.slice(0, 2),
      {
        id: "qg-fail-1",
        name: "WCAG 2.2 AA Accessibility Audit",
        category: "a11y",
        required: true,
        status: "failed",
        evidence: "Color contrast violation on #login-subtext (3.8:1 < 4.5:1)",
        duration: "54.2s",
      },
      {
        id: "qg-running-1",
        name: "End-to-End Playwright Smoke Tests",
        category: "test",
        required: true,
        status: "running",
        evidence: "Executing scenario: Checkout with Stripe Elements...",
        duration: "Running 2m 10s",
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>QualityGatesTable Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Panel Header (Title + aggregate pass/fail status scorecard pill)</li>
          <li>Gate Identity (Clear enterprise test name and target capability)</li>
          <li>Category Badges (Security & RLS, Static Analysis, WCAG 2.2 AA, Automated Tests)</li>
          <li>Policy Enforcement (Mandatory blocking gates vs Advisory non-blocking)</li>
          <li>Verifiable Evidence Snippets & Direct Action Triggers (Details & Re-run)</li>
        </ol>
      </div>
      <QualityGatesTable gates={PASSING_GATES} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>All Gates Passed</h4>
        <QualityGatesTable gates={PASSING_GATES} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Active Pipeline with Mixed States</h4>
        <QualityGatesTable
          gates={[
            { id: "1", name: "Security RLS", category: "security", required: true, status: "passed", evidence: "RLS verified" },
            { id: "2", name: "Typecheck", category: "typecheck", required: true, status: "running", evidence: "Checking types..." },
            { id: "3", name: "Integration Tests", category: "test", required: true, status: "failed", evidence: "Assertion error at step 4" },
            { id: "4", name: "Telemetry", category: "telemetry", required: false, status: "skipped", evidence: "Advisory skipped" },
          ]}
        />
      </div>
    </div>
  ),
};
