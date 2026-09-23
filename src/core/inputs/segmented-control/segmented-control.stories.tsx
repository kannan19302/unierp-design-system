import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid, List, Table, BarChart3, LineChart, PieChart } from "lucide-react";
import { SegmentedControl, type SegmentedControlProps } from "./segmented-control";

/**
 * ## Strata V1 SegmentedControl Primitive
 *
 * High-density linear segmented button group engineered to the SideNav V1 reference standard:
 * - **W3C ARIA Roving Tabindex**: Arrow-key traversal (`Left`/`Right`/`Up`/`Down`) adhering to accessible radio patterns.
 * - **Icon and Text Composition**: Supports leading icons paired with concise label strings.
 * - **4-Tier Density**: `ultra-compact` (24px), `compact` (28px), `standard` (32px), `comfortable` (40px).
 */
const meta: Meta<typeof SegmentedControl> = {
  title: "Core/Inputs/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise segmented toggle control with roving tabindex arrow-key navigation, icon slotting, and density sizing.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls the height and padding of the segmented segments.",
    },
    fullWidth: {
      control: "boolean",
      description: "Expands segments to occupy 100% of parent width equally.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction across all segments in the control.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function ViewSwitcherWorkbench() {
  const [view, setView] = useState("grid");
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");

  return (
    <div
      data-density={density}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        maxWidth: "540px",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)" }}>
            Ledger Display Mode
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Active View: <strong style={{ color: "var(--color-text)" }}>{view.toUpperCase()}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              style={{
                fontSize: "var(--type-micro, 11px)",
                padding: "2px 6px",
                background: density === d ? "var(--color-primary)" : "var(--color-bg-sunken)",
                color: density === d ? "var(--color-bg-elevated)" : "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              {d === "ultra-compact" ? "24px" : d === "compact" ? "28px" : d === "standard" ? "32px" : "40px"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <SegmentedControl
          value={view}
          onChange={setView}
          density={density}
          options={[
            { value: "grid", label: "Cards", icon: <LayoutGrid size={14} /> },
            { value: "list", label: "Triage List", icon: <List size={14} /> },
            { value: "table", label: "DataGrid", icon: <Table size={14} /> },
          ]}
        />

        <span style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)" }}>
          Use ← / → keys to navigate
        </span>
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 segmented control reference",
  render: () => <ViewSwitcherWorkbench />,
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
          1. Default Text Labels
        </div>
        <SegmentedControl
          value="month"
          onChange={() => {}}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Icons with Labels
        </div>
        <SegmentedControl
          value="bar"
          onChange={() => {}}
          options={[
            { value: "bar", label: "Bar", icon: <BarChart3 size={14} /> },
            { value: "line", label: "Line", icon: <LineChart size={14} /> },
            { value: "pie", label: "Pie", icon: <PieChart size={14} /> },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          3. Disabled Group
        </div>
        <SegmentedControl
          disabled
          value="locked"
          onChange={() => {}}
          options={[
            { value: "locked", label: "Locked Mode" },
            { value: "unlocked", label: "Unlocked Mode" },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          4. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <SegmentedControl
              density="ultra-compact"
              value="a"
              onChange={() => {}}
              options={[{ value: "a", label: "Ultra-Compact (24px)" }, { value: "b", label: "Plan B" }]}
            />
          </div>
          <div data-density="compact">
            <SegmentedControl
              density="compact"
              value="a"
              onChange={() => {}}
              options={[{ value: "a", label: "Compact (28px)" }, { value: "b", label: "Plan B" }]}
            />
          </div>
          <div data-density="standard">
            <SegmentedControl
              density="standard"
              value="a"
              onChange={() => {}}
              options={[{ value: "a", label: "Standard (32px)" }, { value: "b", label: "Plan B" }]}
            />
          </div>
          <div data-density="comfortable">
            <SegmentedControl
              density="comfortable"
              value="a"
              onChange={() => {}}
              options={[{ value: "a", label: "Comfortable (40px)" }, { value: "b", label: "Plan B" }]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState("month");
    return (
      <SegmentedControl
        value={val}
        onChange={setVal}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
        ]}
      />
    );
  },
};
