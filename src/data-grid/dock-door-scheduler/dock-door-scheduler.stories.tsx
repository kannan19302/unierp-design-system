import type { Meta, StoryObj } from "@storybook/react";
import { DockDoorScheduler, type DockAppointment } from "./dock-door-scheduler";

const mockAppointments: DockAppointment[] = [
  {
    id: "appt-1",
    doorNumber: "Door 01",
    timeSlot: "08:00",
    carrierName: "J.B. Hunt Transport",
    trailerId: "TR-8819",
    purchaseOrder: "PO-2026-9901",
    palletCount: 26,
    status: "docked_unloading",
    detentionRiskMinutes: 45,
  },
  {
    id: "appt-2",
    doorNumber: "Door 01",
    timeSlot: "10:00",
    carrierName: "Schneider National",
    trailerId: "TR-4412",
    purchaseOrder: "PO-2026-9904",
    palletCount: 28,
    status: "scheduled",
  },
  {
    id: "appt-3",
    doorNumber: "Door 02",
    timeSlot: "08:00",
    carrierName: "Swift Transportation",
    trailerId: "TR-1049",
    purchaseOrder: "PO-2026-9877",
    palletCount: 22,
    status: "completed",
  },
  {
    id: "appt-4",
    doorNumber: "Door 03",
    timeSlot: "08:00",
    carrierName: "Knight Transportation",
    trailerId: "TR-9021",
    purchaseOrder: "PO-2026-9811",
    palletCount: 30,
    status: "delayed",
    detentionRiskMinutes: 15,
  },
  {
    id: "appt-5",
    doorNumber: "Door 04",
    timeSlot: "06:00",
    carrierName: "Old Dominion Freight",
    trailerId: "TR-3391",
    purchaseOrder: "PO-2026-9799",
    palletCount: 24,
    status: "at_gate",
  },
];

const meta: Meta<typeof DockDoorScheduler> = {
  title: "DataGrid/DockDoorScheduler",
  component: DockDoorScheduler,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DockDoorScheduler>;

export const Default: Story = {
  args: {
    facilityTitle: "East Coast Logistics Gateway DC #02",
    dateLabel: "Today, Sep 06, 2026",
    appointments: mockAppointments,
  },
};

export const Compact: Story = {
  args: {
    facilityTitle: "Secondary Inbound Yard",
    dateLabel: "Today, Sep 06, 2026",
    appointments: mockAppointments,
    density: "compact",
  },
};
