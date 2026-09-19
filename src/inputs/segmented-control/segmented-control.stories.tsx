import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid, List, Table, BarChart3, LineChart, PieChart } from "lucide-react";
import { SegmentedControl, type SegmentedControlProps } from "./segmented-control";

/**
 * ## SegmentedControl Primitive
 *
 * High-density linear segmented button group for switching views, operational frequencies,
 * timeframes, chart modes, and filter dimensions.
 *
 * ### Key Capabilities
 * - **W3C ARIA Roving Tabindex**: Arrow-key traversal (`Left`/`Right`/`Up`/`Down`) adhering to accessible radio patterns.
 * - **Icon and Text Composition**: Supports leading icons paired with concise label strings.
 * - **Width Adaptability**: Supports content-hugging or container `fullWidth` expansion.
 */
const meta: Meta<typeof SegmentedControl> = {
  title: "Inputs/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
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

function InteractiveSegmentedControl(props: Partial<SegmentedControlProps>) {
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
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveSegmentedControl />,
};

export const WithIcons: Story = {
  render: () => {
    const [view, setView] = useState("grid");
    return (
      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          { value: "grid", label: "Grid", icon: <LayoutGrid size={14} /> },
          { value: "list", label: "List", icon: <List size={14} /> },
          { value: "table", label: "Table", icon: <Table size={14} /> },
        ]}
      />
    );
  },
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [chart, setChart] = useState("bar");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "520px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Financial Visualization Analytics Mode
        </h4>
        <SegmentedControl
          value={chart}
          onChange={setChart}
          fullWidth
          options={[
            { value: "bar", label: "Revenue Breakdown", icon: <BarChart3 size={14} /> },
            { value: "line", label: "Cash Velocity", icon: <LineChart size={14} /> },
            { value: "pie", label: "Expense Allocation", icon: <PieChart size={14} /> },
          ]}
        />
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, sizing, and density variants.
 */
export const AllStatesGallery = () => {
  const [val, setVal] = useState("active");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Size Hierarchy (sm, md, lg)
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <SegmentedControl
            size="sm"
            value={val}
            onChange={setVal}
            options={[{ value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "closed", label: "Closed" }]}
          />
          <SegmentedControl
            size="md"
            value={val}
            onChange={setVal}
            options={[{ value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "closed", label: "Closed" }]}
          />
          <SegmentedControl
            size="lg"
            value={val}
            onChange={setVal}
            options={[{ value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "closed", label: "Closed" }]}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Disabled Segment & Full Width
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <SegmentedControl
            value="opt1"
            onChange={() => {}}
            options={[
              { value: "opt1", label: "Standard Production" },
              { value: "opt2", label: "Beta Sandbox" },
              { value: "opt3", label: "Decommissioned", disabled: true },
            ]}
          />
          <SegmentedControl
            disabled
            value="opt1"
            onChange={() => {}}
            options={[
              { value: "opt1", label: "Policy Locked View" },
              { value: "opt2", label: "Read Only Partition" },
            ]}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          4-Tier Ergonomic Density Matrix
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <SegmentedControl size="sm" value="v1" onChange={() => {}} options={[{ value: "v1", label: "Ultra-Compact (24px)" }, { value: "v2", label: "View 2" }]} />
          </div>
          <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <SegmentedControl size="sm" value="v1" onChange={() => {}} options={[{ value: "v1", label: "Compact (28px)" }, { value: "v2", label: "View 2" }]} />
          </div>
          <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <SegmentedControl size="md" value="v1" onChange={() => {}} options={[{ value: "v1", label: "Standard (32px)" }, { value: "v2", label: "View 2" }]} />
          </div>
          <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <SegmentedControl size="lg" value="v1" onChange={() => {}} options={[{ value: "v1", label: "Comfortable (40px)" }, { value: "v2", label: "View 2" }]} />
          </div>
        </div>
      </div>
    </div>
  );
};
