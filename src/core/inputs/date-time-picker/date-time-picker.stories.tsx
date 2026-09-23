import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateTimePicker, type DateTimePickerProps } from "./date-time-picker";
import { TimePicker } from "./time-picker";

/**
 * ## DateTimePicker & TimePicker Primitives
 *
 * Precision temporal input pairing calendar and clock iconography with native ISO datetime-local
 * pickers, engineered for dispatch shifts, SLA expirations, cron triggers, and delivery windows.
 *
 * ### Key Capabilities
 * - **Full Datetime Integration**: Captures both calendar date and precise minute timestamp.
 * - **Standalone Time Picker**: Dedicated `<TimePicker>` for operating hours and recurring shifts.
 * - **Accessible Validation**: Full `aria-invalid` and disabled state integration.
 */
const meta: Meta<typeof DateTimePicker> = {
  title: "Core/Inputs/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise combined datetime and time input primitives with iconography, ISO formatting, and density scaling.",
      },
    },
  },
  argTypes: {
    value: { control: "text", description: "ISO 8601 string (YYYY-MM-DDTHH:mm)." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted styling." },
    invalid: { control: "boolean", description: "Applies error border and sets aria-invalid." },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

function InteractiveDateTimePicker(props: Partial<DateTimePickerProps>) {
  const [val, setVal] = useState(props.value ?? "2026-08-29T14:30");
  return <DateTimePicker value={val} onChange={setVal} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveDateTimePicker />,
};

export const TimeOnly = () => (
  <div style={{ width: 220 }}>
    <TimePicker value="16:45" />
  </div>
);

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [windowStart, setWindowStart] = useState("2026-09-19T08:00");
  const [cutOffTime, setCutOffTime] = useState("17:30");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Warehouse Logistics Dispatch Window
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Earliest Loading Datetime
            </label>
            <DateTimePicker value={windowStart} onChange={setWindowStart} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Daily Cutoff Time
            </label>
            <TimePicker value={cutOffTime} onChange={setCutOffTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, validation, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Core Temporal Input States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Populated Datetime</span>
          <DateTimePicker value="2026-09-19T09:30" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Standalone Time (14:15)</span>
          <TimePicker value="14:15" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Invalid SLA Expiry</span>
          <DateTimePicker value="2024-01-01T00:00" invalid />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Historical Timestamp</span>
          <DateTimePicker value="2026-05-10T11:00" disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DateTimePicker value="2026-09-19T09:00" />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DateTimePicker value="2026-09-19T09:00" />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DateTimePicker value="2026-09-19T09:00" />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DateTimePicker value="2026-09-19T09:00" />
        </div>
      </div>
    </div>
  </div>
);
