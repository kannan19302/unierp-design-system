import { useState } from "react";
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
 * - **Event Card Clustering & Categorization**: Color-coded category tags (primary, success, warning, danger).
 * - **Interactive Slot Selection**: Keyboard & click-enabled hour rows triggering event booking callbacks.
 * - **4-Tier Density**: Ultra-compact (28px row), Compact (36px row), Standard (48px row), Comfortable (64px row).
 */
const meta: Meta<typeof Scheduler> = {
  title: "Core/Inputs/Scheduler",
  component: Scheduler,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise hourly timeline scheduler with event card clustering, clickable hour rows, and 4-tier density scaling.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Schedule header banner title." },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Scheduler>;

const SAMPLE_EVENTS: SchedulerEvent[] = [
  { id: "1", title: "Daily Production Standup", subtitle: "Conf Room 304", startHour: 9, category: "primary" },
  { id: "2", title: "Vendor SLA Delivery Dispatch", subtitle: "Gate 4", startHour: 11, category: "success" },
  { id: "3", title: "Reconciliation Audit", subtitle: "Auditor Desk", startHour: 14, category: "warning" },
  { id: "4", title: "Database Migration Maintenance Window", subtitle: "Infra Team", startHour: 18, category: "danger" },
];

function InteractiveScheduler(props: Partial<SchedulerProps>) {
  const [events, setEvents] = useState<SchedulerEvent[]>(props.events ?? SAMPLE_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 23));

  const handleAdd = (hour: number) => {
    const title = prompt(`Book new event for ${hour}:00:`, "Operational Triage");
    if (title) {
      setEvents((prev) => [
        ...prev,
        { id: String(Date.now()), title, startHour: hour, category: "primary" },
      ]);
    }
  };

  return (
    <Scheduler
      date={currentDate}
      onDateChange={setCurrentDate}
      events={events}
      onAddEvent={handleAdd}
      onEventClick={(evt) => alert(`Selected Event: ${evt.title}`)}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <InteractiveScheduler />
    </div>
  ),
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: 600 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Ultra-Compact Density (28px row)</h4>
        <Scheduler
          density="ultra-compact"
          title="Line 1 Shifts (Ultra-Compact)"
          startHour={8}
          endHour={13}
          events={SAMPLE_EVENTS}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Compact Density (36px row)</h4>
        <Scheduler
          density="compact"
          title="Line 2 Shifts (Compact)"
          startHour={8}
          endHour={13}
          events={SAMPLE_EVENTS}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Standard Density (48px row)</h4>
        <Scheduler
          density="standard"
          title="Plant Maintenance (Standard)"
          startHour={8}
          endHour={13}
          events={SAMPLE_EVENTS}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Comfortable Density (64px row)</h4>
        <Scheduler
          density="comfortable"
          title="Executive Schedule (Comfortable)"
          startHour={8}
          endHour={13}
          events={SAMPLE_EVENTS}
        />
      </div>
    </div>
  ),
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Populated Schedule</h4>
        <Scheduler title="Active Day Schedule" events={SAMPLE_EVENTS} startHour={9} endHour={14} />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Empty Schedule</h4>
        <Scheduler title="Sunday Off-shift (Empty)" events={[]} startHour={9} endHour={14} />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 720 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Facility Shift Dispatcher</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Monitor loading dock reservations, maintenance slots, and supervisor walkthrough schedules.
        </p>
      </div>
      <InteractiveScheduler
        title="Dock Bay 4 - Inbound Deliveries"
        startHour={7}
        endHour={16}
      />
    </div>
  ),
};
