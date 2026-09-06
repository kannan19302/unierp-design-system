import type { Meta, StoryObj } from "@storybook/react";
import {
  ShipmentTrackingMilestoneTracker,
  type ShipmentMilestone,
} from "./shipment-tracking-milestone-tracker";

const mockMilestones: ShipmentMilestone[] = [
  {
    id: "m-1",
    name: "Factory Origin Dispatch",
    location: "Suzhou Industrial Park, CN",
    mode: "truck",
    status: "completed",
    scheduledTime: "2026-08-28 09:00",
    actualTime: "2026-08-28 08:45",
    carrierName: "Sinotrans Drayage",
  },
  {
    id: "m-2",
    name: "Ocean Vessel Departure",
    location: "Port of Shanghai (CNSHA)",
    mode: "vessel",
    status: "completed",
    scheduledTime: "2026-08-30 18:00",
    actualTime: "2026-08-31 02:30",
    dwellHours: 18,
    carrierName: "MSC Geneva (Voyage 881E)",
  },
  {
    id: "m-3",
    name: "Port Unloading & Customs Dwell",
    location: "Port of Long Beach (USLGB)",
    mode: "customs",
    status: "delayed",
    scheduledTime: "2026-09-12 06:00",
    actualTime: "2026-09-14 11:20",
    dwellHours: 54,
    carrierName: "US Customs & Border Protection",
  },
  {
    id: "m-4",
    name: "Intermodal Rail Transit",
    location: "BNSF Logistics Hub, Chicago IL",
    mode: "rail",
    status: "in_transit",
    scheduledTime: "2026-09-16 08:00",
    carrierName: "BNSF Railway",
  },
  {
    id: "m-5",
    name: "Final Inbound DC Receiving",
    location: "UniERP Central Distribution Center #4",
    mode: "warehouse",
    status: "pending",
    scheduledTime: "2026-09-18 14:00",
  },
];

const meta: Meta<typeof ShipmentTrackingMilestoneTracker> = {
  title: "DataDisplay/ShipmentTrackingMilestoneTracker",
  component: ShipmentTrackingMilestoneTracker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShipmentTrackingMilestoneTracker>;

export const Default: Story = {
  args: {
    shipmentNumber: "MSCU-849102-1",
    routeSummary: "Shanghai Port (CNSHA) → Port of Long Beach (USLGB) → Chicago Rail Hub",
    projectedEta: "2026-09-18 14:00 CST",
    etaVariance: "+3d 4h Delayed (Port Congestion)",
    isDemurrageRisk: true,
    milestones: mockMilestones,
  },
};

export const OnSchedule: Story = {
  args: {
    shipmentNumber: "HLCU-119284-9",
    routeSummary: "Rotterdam Europort (NLRTM) → Port of Newark (USNWK)",
    projectedEta: "2026-09-10 10:00 EST",
    etaVariance: "On Schedule (Zero Variance)",
    isDemurrageRisk: false,
    milestones: mockMilestones.slice(0, 3).map((m) => ({ ...m, status: "completed" })),
  },
};
