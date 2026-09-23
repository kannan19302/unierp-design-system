import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, type CalendarProps } from "./calendar";

/**
 * ## Calendar Primitive
 *
 * Accessible monthly calendar grid component for scheduling, period close dates,
 * tax deadlines, meeting bookings, and date range filters.
 *
 * ### Key Capabilities
 * - **W3C Calendar Grid**: Structured table grid with day headers and accessible cell buttons.
 * - **Month Navigation**: Fast previous/next month transitions with keyboard support.
 * - **Interactive Selection**: Visual highlight on the currently selected date.
 */
const meta: Meta<typeof Calendar> = {
  title: "Core/Inputs/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise monthly calendar picker with weekday headers, month navigation, selected day highlights, and density scaling.",
      },
    },
  },
  argTypes: {
    selectedDate: { control: "date", description: "Currently selected Date object." },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

function InteractiveCalendar(props: Partial<CalendarProps>) {
  const [selected, setSelected] = useState<Date>(new Date(2026, 8, 19));
  return <Calendar selectedDate={selected} onSelectDate={setSelected} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveCalendar />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [date, setDate] = useState<Date>(new Date(2026, 8, 15));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "340px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Fiscal Audit Deadline Picker
        </h4>
        <Calendar selectedDate={date} onSelectDate={setDate} />
        <div style={{ marginTop: "var(--space-3)", padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)" }}>
          <strong>Selected:</strong> {date.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, selection, and density variants.
 */
export const AllStatesGallery = () => {
  const fixedDate = new Date(2026, 8, 19);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Month Views & Selections
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          <div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", display: "block", marginBottom: "var(--space-2)" }}>
              September 2026 (Selected: 19th)
            </span>
            <Calendar selectedDate={fixedDate} />
          </div>
          <div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", display: "block", marginBottom: "var(--space-2)" }}>
              December 2026 (Selected: 31st)
            </span>
            <Calendar selectedDate={new Date(2026, 11, 31)} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          4-Tier Ergonomic Density Matrix
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact" style={{ padding: "var(--space-3)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)", width: "300px" }}>
            <Calendar selectedDate={fixedDate} />
          </div>
          <div data-density="standard" style={{ padding: "var(--space-3)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)", width: "320px" }}>
            <Calendar selectedDate={fixedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};
