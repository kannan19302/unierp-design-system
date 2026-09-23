import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Scheduler, type SchedulerProps, type SchedulerEvent } from "./scheduler";

/**
 * ## Scheduler Primitive
 *
 * Hourly timeline calendar view engineered for operations triage, delivery route dispatches,
 * audit interviews, and warehouse maintenance slot bookings.
 *
 * ### Key Capabilities
 * - **Hourly Granularity**: Continuous vertical timeline ranging across active operational business hours.
 * - **Event Card Clustering**: Renders multiple event cards per time slot without overlap collision.
 * - **Interactive Slot Selection**: Clickable hour rows triggering new event booking modals.
 */
const meta: Meta<typeof Scheduler> = {
  title: "Core/Inputs/Scheduler",
  component: Scheduler,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise hourly timeline scheduler with event card clustering, clickable hour rows, and density scaling.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Schedule header banner title." },
  },
};

export default meta;
type Story = StoryObj<typeof Scheduler>;

const SAMPLE_EVENTS: SchedulerEvent[] = [
  { id: "1", title: "Daily Production Standup (Room 304)", startHour: 9 },
  { id: "2", title: "Vendor SLA Delivery Dispatch", startHour: 11 },
  { id: "3", title: "Quarterly Financial Reconciliation Audit", startHour: 14 },
  { id: "4", title: "Database Migration Maintenance Window", startHour: 18 },
];

function InteractiveScheduler(props: Partial<SchedulerProps>) {
  const [events, setEvents] = useState<SchedulerEvent[]>(props.events ?? SAMPLE_EVENTS);

  const handleAdd = (hour: number) => {
    const title = prompt(`Book new event for ${hour}:00:`, "Operational Triage");
    if (title) {
      setEvents((prev) => [...prev, { id: String(Date.now()), title, startHour: hour }]);
    }
  };

  return <Scheduler events={events} onAddEvent={handleAdd} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveScheduler />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "540px" }}>
    <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <Scheduler
        title="Plant 4 - Heavy Machinery Maintenance Timeline"
        events={[
          { id: "m1", title: "Turbine 1 Lubrication Cycle", startHour: 8 },
          { id: "m2", title: "Hydraulic Pressure Sensor Recalibration", startHour: 10 },
          { id: "m3", title: "Safety Inspector Audit Walkthrough", startHour: 13 },
        ]}
      />
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, event density, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Populated & Empty Scheduler States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", display: "block", marginBottom: "var(--space-2)" }}>
            Populated Schedule
          </span>
          <Scheduler title="Active Ops Day" events={SAMPLE_EVENTS} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", display: "block", marginBottom: "var(--space-2)" }}>
            Empty Schedule (No Bookings)
          </span>
          <Scheduler title="Open Weekend Shift" events={[]} />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Scheduler title="Ultra-Compact (24px) Schedule" events={[{ id: "1", title: "Quick Shift", startHour: 9 }]} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Scheduler title="Standard (32px) Schedule" events={[{ id: "1", title: "Standard Meeting", startHour: 10 }]} />
        </div>
      </div>
    </div>
  </div>
);
