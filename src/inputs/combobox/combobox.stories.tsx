import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ComboBox, type ComboBoxProps, type ComboBoxOption } from "./combobox";
import {
  Globe,
  Server,
  Shield,
  Layers,
  Coins,
  Cpu,
  Database,
  Building,
  CreditCard,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import styles from "./combobox.module.css";

/**
 * ## Strata V1 ComboBox Benchmark
 *
 * Enterprise searchable combobox engineered to the SideNav V1 reference standard:
 * - **W3C APG 1.2 Combobox**: Full keyboard velocity (Arrow navigation, Home, End, PageUp, PageDown, Enter, Escape).
 * - **4-Tier Ergonomic Density Matrix**: `ultra-compact` (24px), `compact` (28px), `standard` (32px), `comfortable` (40px).
 * - **Accessible States**: default, focused, disabled, read-only, invalid/error, loading/busy.
 * - **Tag Management**: Inline tag pills with individual remove controls and batch clear.
 */
const meta: Meta<typeof ComboBox> = {
  title: "Core/Inputs/Combobox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise searchable combobox with single/multi-selection, tag displays, clear buttons, and density scaling.",
      },
    },
  },
  argTypes: {
    placeholder: { control: "text", description: "Placeholder displayed when no option is selected." },
    searchPlaceholder: { control: "text", description: "Placeholder for the interior search input." },
    disabled: { control: "boolean", description: "Disables interaction and dropdown expansion." },
    readOnly: { control: "boolean", description: "Presents value without allowing mutation." },
    invalid: { control: "boolean", description: "Applies error validation styling and aria-invalid." },
    loading: { control: "boolean", description: "Renders loading spinner and marks aria-busy." },
    multiple: { control: "boolean", description: "Enables multiple item selection with tag pills." },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Applies explicit 4-tier density scaling.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const REGION_OPTIONS: ComboBoxOption[] = [
  { value: "us-east-1", label: "US East (N. Virginia)", description: "Primary AWS Core Cluster", icon: Server },
  { value: "us-west-2", label: "US West (Oregon)", description: "Secondary Failover Zone", icon: Server },
  { value: "eu-central-1", label: "EU Central (Frankfurt)", description: "GDPR Compliant Data Vault", icon: Shield },
  { value: "ap-southeast-1", label: "AP Southeast (Singapore)", description: "Low Latency APAC Hub", icon: Globe },
  { value: "me-central-1", label: "ME Central (UAE)", description: "GCC Sovereign Cloud", icon: Database },
  { value: "sa-east-1", label: "SA East (São Paulo)", description: "Latin America Edge Ingress", icon: Cpu },
  { value: "af-south-1", label: "AF South (Cape Town)", description: "Sub-Saharan Ingress", disabled: true, icon: Server },
];

const CURRENCY_OPTIONS: ComboBoxOption[] = [
  { value: "USD", label: "USD - United States Dollar", description: "Primary Settlement", icon: CreditCard },
  { value: "EUR", label: "EUR - Euro", description: "SEPA Clearing", icon: Coins },
  { value: "GBP", label: "GBP - British Pound", description: "BACS / CHAPS", icon: Building },
  { value: "JPY", label: "JPY - Japanese Yen", description: "Zengin System", icon: Coins },
  { value: "SGD", label: "SGD - Singapore Dollar", description: "MEPS+ Network", icon: CreditCard },
  { value: "CHF", label: "CHF - Swiss Franc", description: "SIC Settlement", icon: Shield },
];

function InteractiveWorkbench() {
  const [selectedRegion, setSelectedRegion] = useState<string | string[] | null>("us-east-1");
  const [selectedCurrencies, setSelectedCurrencies] = useState<string | string[] | null>(["USD", "EUR"]);
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6, 24px)",
        maxWidth: "680px",
        padding: "var(--space-6, 24px)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md, 6px)",
      }}
    >
      <header style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-md, 16px)", fontWeight: 600, color: "var(--color-text)" }}>
          Cluster Ingress & Settlement Configuration
        </h3>
        <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-sm, 13px)", color: "var(--color-text-muted)" }}>
          Strata V1 combobox reference demonstrating single-select routing and multi-select currency tags.
        </p>
      </header>

      {/* Field 1: Single Selection */}
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-1-5)" }}>
        <label style={{ fontSize: "var(--text-xs, 12px)", fontWeight: 500, color: "var(--color-text)" }}>
          Primary Ingress Cluster (Single-Select)
        </label>
        <ComboBox
          options={REGION_OPTIONS}
          value={selectedRegion ?? undefined}
          onChange={setSelectedRegion}
          placeholder="Select an active ingress region..."
          density={density}
          disabled={isDisabled}
          readOnly={isReadOnly}
          invalid={isInvalid}
          loading={isLoading}
        />
        {isInvalid && (
          <span style={{ fontSize: "var(--type-micro)", color: "var(--color-text-danger)" }}>
            Please select an authorized failover region.
          </span>
        )}
      </section>

      {/* Field 2: Multi-Selection with Tag Pills */}
      <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-1-5)" }}>
        <label style={{ fontSize: "var(--text-xs, 12px)", fontWeight: 500, color: "var(--color-text)" }}>
          Clearing Currencies (Multi-Select Tags)
        </label>
        <ComboBox
          multiple
          options={CURRENCY_OPTIONS}
          value={selectedCurrencies ?? undefined}
          onChange={setSelectedCurrencies}
          placeholder="Assign settlement currencies..."
          density={density}
          disabled={isDisabled}
          readOnly={isReadOnly}
          invalid={isInvalid}
          loading={isLoading}
        />
      </section>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 combobox reference",
  render: () => <InteractiveWorkbench />,
  parameters: { controls: { disable: true } },
};

export const V1MultiSelectWorkbench: Story = {
  name: "V1 multi-select tags",
  render: () => {
    const [val, setVal] = useState<string | string[] | null>(["USD", "EUR", "GBP"]);
    return (
      <div style={{ maxWidth: "480px", padding: "var(--space-4)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
          Cross-Border Liquidity Rails
        </h4>
        <ComboBox
          multiple
          options={CURRENCY_OPTIONS}
          value={val ?? undefined}
          onChange={setVal}
          placeholder="Select liquidity settlement rails..."
        />
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
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      {/* 1. Default Unselected */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Default (Empty)
        </div>
        <ComboBox options={REGION_OPTIONS} placeholder="Select ingress zone..." />
      </div>

      {/* 2. Single Value Selected */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Single Value Selected
        </div>
        <ComboBox options={REGION_OPTIONS} value="us-east-1" />
      </div>

      {/* 3. Multi-Select Tags */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          3. Multi-Select Tags
        </div>
        <ComboBox multiple options={CURRENCY_OPTIONS} value={["USD", "EUR"]} />
      </div>

      {/* 4. Invalid / Error State */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-danger)" }}>
          4. Invalid / Error State
        </div>
        <ComboBox invalid options={REGION_OPTIONS} value="us-east-1" />
      </div>

      {/* 5. Disabled State */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          5. Disabled State
        </div>
        <ComboBox disabled options={REGION_OPTIONS} value="us-west-2" />
      </div>

      {/* 6. Read-Only State */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          6. Read-Only State
        </div>
        <ComboBox readOnly options={REGION_OPTIONS} value="eu-central-1" />
      </div>

      {/* 7. Loading / Busy State */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          7. Loading / Busy State
        </div>
        <ComboBox loading options={REGION_OPTIONS} placeholder="Connecting to node..." />
      </div>

      {/* 8. 4-Tier Density Spectrum */}
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          8. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          <div>
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Ultra-Compact (24px)
            </div>
            <ComboBox density="ultra-compact" options={REGION_OPTIONS} value="us-east-1" />
          </div>
          <div>
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Compact (28px)
            </div>
            <ComboBox density="compact" options={REGION_OPTIONS} value="us-east-1" />
          </div>
          <div>
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Standard (32px)
            </div>
            <ComboBox density="standard" options={REGION_OPTIONS} value="us-east-1" />
          </div>
          <div>
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Comfortable (40px)
            </div>
            <ComboBox density="comfortable" options={REGION_OPTIONS} value="us-east-1" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const DensityComparison: Story = {
  name: "V1 density comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px", padding: "var(--space-4)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
            {density} ({density === "ultra-compact" ? "24px" : density === "compact" ? "28px" : density === "standard" ? "32px" : "40px"})
          </div>
          <ComboBox density={density} options={CURRENCY_OPTIONS} value="USD" />
        </div>
      ))}
    </div>
  ),
};

export const RtlPreview: Story = {
  name: "V1 RTL layout",
  render: () => (
    <div dir="rtl" style={{ maxWidth: "480px", padding: "var(--space-4)", background: "var(--color-bg)" }}>
      <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
        توجيه العملات الأجنبية (RTL)
      </h4>
      <ComboBox
        multiple
        options={CURRENCY_OPTIONS}
        value={["USD", "EUR"]}
        placeholder="اختر العملات المصرح بها..."
      />
    </div>
  ),
};
