import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  TextField,
  Input,
  Textarea,
  Select,
  FormField,
  FormSection,
  AutosaveIndicator,
} from "./form-control";
import {
  Search,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building,
  KeyRound,
  FileText,
  Sliders,
} from "lucide-react";

/**
 * ## Strata V1 FormControl & Field Primitives
 *
 * Authoritative form architecture for Strata DL 2.0. Enforces accessible field bindings,
 * floating/stacked labels, hint messages, validation state indicators, responsive input slots,
 * collapsible sections, and 4-tier density scaling.
 */
const meta: Meta<typeof TextField> = {
  title: "Core/Inputs/FormControl",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise form control primitives supporting accessible text fields, textareas, native selects, prefix/suffix icons, collapsible form sections, and auto-save indicators.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Visual label text associated with the form field." },
    placeholder: { control: "text", description: "Placeholder text rendered when the field is empty." },
    error: { control: "text", description: "Error message displayed below the field. Triggers aria-invalid." },
    hint: { control: "text", description: "Assistive hint text displayed below the field when error is absent." },
    required: { control: "boolean", description: "Renders an accessible required asterisk and marks input required." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    readOnly: { control: "boolean", description: "Renders the control in a non-editable, read-only state." },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const V1WorkspacePreview: Story = {
  name: "V1 form control reference",
  render: () => {
    const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("saved");

    return (
      <div
        data-density={density}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6, 24px)",
          maxWidth: "640px",
          padding: "var(--space-6, 24px)",
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md, 6px)",
        }}
      >
        <header style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "var(--text-lg, 18px)", fontWeight: 600, color: "var(--color-text)" }}>
                Organization Provisioning Workbench
              </h2>
              <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Strata V1 form controls with accessible labeling, input slots, and real-time autosave.
              </p>
            </div>
            <AutosaveIndicator status={saveStatus} />
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Density:</span>
            {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                style={{
                  fontSize: "var(--type-micro, 11px)",
                  padding: "2px 8px",
                  background: density === d ? "var(--color-primary)" : "var(--color-bg-sunken)",
                  color: density === d ? "var(--color-bg-elevated)" : "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </header>

        <FormSection title="Entity Identification" description="Corporate registry details and legal domicile.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <TextField
              label="Legal Corporate Name"
              defaultValue="Acme Global Technologies Ltd."
              required
              hint="Exact registered name from certificate."
            />
            <TextField
              label="Tax Identification / EIN"
              defaultValue="US-94829104"
              required
            />
          </div>
          <FormField label="Primary Corporate Ingress" htmlFor="ingress-domain" hint="Subdomain prefix.">
            <Input
              id="ingress-domain"
              defaultValue="acme-technologies"
              prefixIcon={<Building size={14} style={{ color: "var(--color-text-muted)" }} />}
              suffixIcon={<span style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)" }}>.unierp.com</span>}
            />
          </FormField>
        </FormSection>

        <FormSection title="Security & Compliance" description="Access governance and jurisdiction routing." collapsible>
          <FormField label="Security Clearance Key" htmlFor="clearance-key" required>
            <Input
              id="clearance-key"
              type="password"
              defaultValue="vault_live_secret_key_84920"
              prefixIcon={<KeyRound size={14} style={{ color: "var(--color-text-muted)" }} />}
              suffixIcon={<CheckCircle2 size={14} style={{ color: "var(--color-text-success, var(--color-success))" }} />}
            />
          </FormField>

          <FormField label="Sovereign Data Jurisdiction" htmlFor="data-jurisdiction">
            <Select id="data-jurisdiction" defaultValue="eu">
              <option value="eu">European Union (GDPR — Frankfurt)</option>
              <option value="us">United States (FedRAMP — Virginia)</option>
              <option value="sg">Singapore (PDPA — APAC West)</option>
            </Select>
          </FormField>

          <FormField label="Compliance Audit Notice" htmlFor="audit-notice">
            <Textarea
              id="audit-notice"
              defaultValue="All automated cryptographic keys rotate on a 90-day cycle under SOC2 Type II controls."
              rows={2}
            />
          </FormField>
        </FormSection>
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Default Empty
        </div>
        <TextField label="Default Field" placeholder="Enter alphanumeric code..." hint="Optional reference." />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Filled with Required Star
        </div>
        <TextField label="Legal Name" defaultValue="Acme Corporation" required />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-danger)" }}>
          3. Invalid with Error Alert
        </div>
        <TextField
          label="Billing Email"
          defaultValue="invalid-address"
          error="Please provide a valid RFC-5322 email."
          required
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          4. Disabled Control
        </div>
        <TextField label="System Identifier" defaultValue="SYS-ROOT-001" disabled />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          5. Read-Only Record
        </div>
        <TextField label="Immutable Hash" defaultValue="sha256:7f83b1657ff1fc53b92dc18148a1d65d" readOnly />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          6. Prefix & Suffix Slots
        </div>
        <FormField label="Search Ledger" htmlFor="matrix-search">
          <Input
            id="matrix-search"
            placeholder="Search accounts..."
            prefixIcon={<Search size={14} style={{ color: "var(--color-text-muted)" }} />}
            suffixIcon={<span style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)" }}>⌘K</span>}
          />
        </FormField>
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          7. Native Select Control
        </div>
        <FormField label="Reporting Frequency" htmlFor="matrix-select">
          <Select id="matrix-select" defaultValue="monthly">
            <option value="daily">Daily Real-Time Settlement</option>
            <option value="weekly">Weekly Consolidated</option>
            <option value="monthly">Monthly Close Cycle</option>
          </Select>
        </FormField>
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          8. Multiline Textarea
        </div>
        <FormField label="Audit Manifest" htmlFor="matrix-textarea">
          <Textarea id="matrix-textarea" rows={2} placeholder="Add compliance notes..." />
        </FormField>
      </div>

      {/* 4-Tier Density Row */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          9. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Ultra-Compact (24px)
            </div>
            <TextField label="Ledger Code" defaultValue="GL-10492" />
          </div>
          <div data-density="compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Compact (28px)
            </div>
            <TextField label="Operational SKU" defaultValue="SKU-84920" />
          </div>
          <div data-density="standard">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Standard (32px)
            </div>
            <TextField label="Account Owner" defaultValue="Corporate Officer" />
          </div>
          <div data-density="comfortable">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Comfortable (40px)
            </div>
            <TextField label="Touch Terminal" defaultValue="Register Pos 01" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  args: {
    label: "Company Name",
    placeholder: "Acme Industrial Corp",
    hint: "Enter registered legal entity name.",
  },
};

export const WithError: Story = {
  args: {
    label: "Tax Identification Number",
    placeholder: "XX-XXXXXXX",
    defaultValue: "123",
    error: "TIN must contain at least 9 alphanumeric digits.",
    required: true,
  },
};
