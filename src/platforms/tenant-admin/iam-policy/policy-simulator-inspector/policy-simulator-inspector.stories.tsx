import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  PolicySimulatorInspector,
  type SimulationResult,
} from "./policy-simulator-inspector";

const meta: Meta<typeof PolicySimulatorInspector> = {
  title: "Platforms/TenantAdmin/IamPolicy/PolicySimulatorInspector",
  component: PolicySimulatorInspector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PolicySimulatorInspector>;

const SAMPLE_ALLOW_RESULT: SimulationResult = {
  decision: "ALLOW",
  matchedRule: "POLICY_VENDOR_READ_ROLE_PROCUREMENT",
  tenantScoped: true,
  tenantId: "00000000-0000-0000-0000-000000000001",
  maskedFields: ["bank_account_num", "tax_id"],
};

const SAMPLE_DENY_RESULT: SimulationResult = {
  decision: "DENY",
  matchedRule: "DEFAULT_DENY_FOREIGN_TENANT_ISOLATION",
  tenantScoped: true,
  deniedReason: "Cross-tenant access prohibited. Target resource belongs to Tenant Beta.",
};

const SimulatorInteractiveDemo = () => {
  const [result, setResult] = useState<SimulationResult | null>(SAMPLE_ALLOW_RESULT);

  return (
    <div style={{ maxInlineSize: "560px" }}>
      <PolicySimulatorInspector
        defaultSubject="sarah.chen@acme.corp"
        defaultResource="Vendor #VND-104"
        defaultAction="READ"
        result={result}
        onSimulate={({ subject, resource, action }) => {
          if (resource.toLowerCase().includes("beta") || subject.toLowerCase().includes("guest")) {
            setResult(SAMPLE_DENY_RESULT);
          } else {
            setResult({
              ...SAMPLE_ALLOW_RESULT,
              matchedRule: `POLICY_${action}_FOR_${subject.split("@")[0].toUpperCase()}`,
            });
          }
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SimulatorInteractiveDemo />,
};

export const DeniedAccess: Story = {
  render: () => (
    <div style={{ maxInlineSize: "560px" }}>
      <PolicySimulatorInspector
        defaultSubject="guest.contractor@vendor.io"
        defaultResource="Payroll Invoices 2024"
        defaultAction="DELETE"
        result={SAMPLE_DENY_RESULT}
        onSimulate={() => {}}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxInlineSize: "560px" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>PolicySimulatorInspector Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Simulator Inputs (Subject principal, resource target, requested action verb)</li>
          <li>Decision Pill (Clear ALLOW / DENY status badge)</li>
          <li>Matched Policy Identity & Tenant RLS Scope verification</li>
          <li>Field Masking Projections list (Identifies projected vs masked columns)</li>
          <li>Denial Rationale breakdown for audit diagnostics</li>
        </ol>
      </div>
      <SimulatorInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Allowed Access with Masking</h4>
        <PolicySimulatorInspector
          result={SAMPLE_ALLOW_RESULT}
          onSimulate={() => {}}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Denied Cross-Tenant Access</h4>
        <PolicySimulatorInspector
          defaultSubject="external@hacker.io"
          defaultResource="Tenant Alpha Ledger"
          defaultAction="WRITE"
          result={SAMPLE_DENY_RESULT}
          onSimulate={() => {}}
        />
      </div>
    </div>
  ),
};
